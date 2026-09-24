import { useEffect, useState } from "react";
import { appendTrackingParams } from "./tracking";

/**
 * Returns a checkout URL that, once mounted on the client, has any
 * ad-tracking query params from the current page forwarded onto it.
 * Starts as the plain base URL (so SSR and first client render match,
 * avoiding a hydration mismatch) and updates right after mount.
 */
export function useCheckoutUrl(baseUrl: string): string {
  const [url, setUrl] = useState(baseUrl);
  useEffect(() => {
    setUrl(appendTrackingParams(baseUrl));
  }, [baseUrl]);
  return url;
}
