/**
 * Forwards ad-click/campaign attribution query params from the marketing site
 * onto outbound links to the separate revive-quote-app deployment, so a click
 * that arrived via a Meta or Google ad isn't attributed as "direct" once the
 * visitor lands on the other origin (cookies don't cross origins).
 *
 * Explicit allowlist only — never forward arbitrary query params, cookies, or
 * form/PII data.
 */
const ATTRIBUTION_PARAM_ALLOWLIST = [
  // Meta
  "fbclid",
  // Google Ads
  "gclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "gad_adgroupid",
  "gad_creative",
  "gad_term",
  // Standard campaign attribution
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Returns `href` unchanged unless the current page URL carries one or more
 * allow-listed attribution params that `href` doesn't already have — in which
 * case it returns a new URL string with those params appended. Params already
 * present on `href` are left as-is (never overwritten).
 */
export function withForwardedAttribution(href: string): string {
  if (typeof window === "undefined") return href;

  try {
    const current = new URL(window.location.href);
    const destination = new URL(href, window.location.href);
    let appended = false;

    for (const key of ATTRIBUTION_PARAM_ALLOWLIST) {
      const value = current.searchParams.get(key);
      if (value && !destination.searchParams.has(key)) {
        destination.searchParams.set(key, value);
        appended = true;
      }
    }

    return appended ? destination.toString() : href;
  } catch {
    return href;
  }
}
