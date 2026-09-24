// Client-side tracking helpers for the external checkout flow.
//
// The real checkout for this store runs on a third-party platform
// (seguro.final-agora-br.shop) that we don't control and that never
// redirects back to this site. That means:
//  - A real "Purchase" event can never fire from this domain — the
//    payment confirmation happens entirely on the external platform.
//  - The best signal we CAN capture here is "the visitor clicked through
//    to checkout" (Meta's InitiateCheckout), fired right before leaving.
//  - Any ad-attribution parameters already in the page URL (utm_*,
//    fbclid, gclid, UTMify's own click-id params, etc.) should be
//    forwarded onto the external checkout link, so that platform — if it
//    reports order status back to UTMify/Meta itself — can still
//    attribute the sale to the right campaign/ad.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// UTMify's pixel.js intercepts clicks on outbound links and re-dispatches
// the click itself (that's how it navigates with its tracking codes), so
// one real click reaches our listener more than once. Ignore repeats within
// a short window so Meta receives a single InitiateCheckout per click.
const DEDUPE_MS = 2000;
let lastInitiateCheckoutAt = 0;

export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastInitiateCheckoutAt < DEDUPE_MS) return;
  lastInitiateCheckoutAt = now;
  try {
    window.fbq?.("track", "InitiateCheckout");
  } catch {
    // tracking must never break navigation
  }
}

// Safety net for the buy buttons.
//
// UTMify's pixel.js intercepts real clicks on outbound links, sends its own
// tracking request, and only lets the browser leave once that request
// succeeds. When the request is blocked (Android Private DNS / ad blockers,
// Samsung Internet or Mi Browser tracking protection) or hangs on a weak
// mobile connection, the page never leaves and the button looks dead.
// UTMify also stops the real click from reaching React, so this can't live
// in an onClick handler: it listens on window in the capture phase, which
// runs before UTMify's interception.
//
// If we're still on the page FALLBACK_MS after the click, we navigate
// ourselves, using the link's current href, which already carries UTMify's
// tracking codes (xcod, sck, subid), so the sale stays attributed. On a
// normal connection UTMify navigates within milliseconds and this never fires.
const CHECKOUT_LINK_SELECTOR = "a[data-checkout-link]";
const FALLBACK_MS = 1800;
let guardInstalled = false;

export function installCheckoutClickGuard() {
  if (guardInstalled || typeof window === "undefined") return;
  guardInstalled = true;

  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  let leaving = false;

  const stop = () => {
    leaving = true;
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  };
  window.addEventListener("pagehide", stop);
  // Not fired by iOS Safari, which is why the two checks below also exist.
  window.addEventListener("beforeunload", stop);
  // Navigation API (Chrome/Android Chrome, Samsung Internet, Edge, newer
  // Safari): fires the moment any navigation to another site starts, however
  // UTMify triggers it. Same-site navigations (the "Ver tudo" anchor, router
  // changes) are ignored so they can't switch the safety net off.
  const nav = (window as unknown as {
    navigation?: {
      addEventListener: (type: "navigate", cb: (e: { destination: { url: string } }) => void) => void;
    };
  }).navigation;
  nav?.addEventListener("navigate", (e) => {
    try {
      if (new URL(e.destination.url).origin !== window.location.origin) stop();
    } catch {
      // ignore malformed destinations
    }
  });
  // Coming back with the browser's back button can restore this page from
  // cache; reset so the next click gets a fresh safety net.
  window.addEventListener("pageshow", () => {
    leaving = false;
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  });

  window.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(CHECKOUT_LINK_SELECTOR);
      if (!link) return;

      trackInitiateCheckout();

      // Opening in a new tab/window: the current page stays, so don't redirect it.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Already navigating (UTMify re-dispatches its click after the page
      // starts leaving): don't arm a timer that could fire on a cached page.
      if (leaving || fallbackTimer) return;
      fallbackTimer = setTimeout(() => {
        fallbackTimer = null;
        if (!leaving) window.location.assign(link.href);
      }, FALLBACK_MS);
    },
    true,
  );

  // Last listener to see the click (window, bubble phase). If a plain click
  // on a buy link got here without being cancelled, the browser is following
  // the link right now (typically UTMify's re-dispatched click once its
  // tracking succeeded), so the safety net must stand down. This works in
  // every browser, including iOS Safari where beforeunload may not fire.
  window.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (!target.closest(CHECKOUT_LINK_SELECTOR)) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!e.defaultPrevented) stop();
  });
}

/**
 * Appends any tracking query params present on the current page URL
 * (utm_source, utm_campaign, fbclid, gclid, xcod, sck, etc.) onto a
 * checkout URL, without overwriting params the checkout URL already
 * carries (product, store). Returns the base URL unchanged during SSR
 * or when there is nothing to forward.
 */
export function appendTrackingParams(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;
  try {
    const current = new URLSearchParams(window.location.search);
    if ([...current.keys()].length === 0) return baseUrl;
    const target = new URL(baseUrl);
    current.forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.set(key, value);
    });
    return target.toString();
  } catch {
    return baseUrl;
  }
}
