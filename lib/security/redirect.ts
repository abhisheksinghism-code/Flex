const ALLOWED_REDIRECT_HOSTS = new Set([
  "www.amazon.in",
  "www.flipkart.com",
  "www.myntra.com",
]);

/**
 * Every outbound "View Deal" link must come from a provider adapter's own
 * buildRedirectUrl(), never from user input. This is the last-line check
 * before we hand a URL to the browser, so Flex can never be used as an open
 * redirector to an arbitrary site.
 */
export function assertAllowedRedirect(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid redirect URL: ${url}`);
  }
  if (parsed.protocol !== "https:" || !ALLOWED_REDIRECT_HOSTS.has(parsed.hostname)) {
    throw new Error(`Redirect host not allowed: ${parsed.hostname}`);
  }
  return parsed.toString();
}
