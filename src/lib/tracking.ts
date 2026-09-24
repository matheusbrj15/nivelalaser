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

export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "InitiateCheckout");
  } catch {
    // tracking must never break navigation
  }
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
