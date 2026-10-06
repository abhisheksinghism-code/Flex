import type { MerchantId, MerchantListingCandidate } from "@/lib/core/types";

export interface MerchantProvider {
  readonly id: MerchantId;
  readonly displayName: string;

  /** Returns raw listings this merchant has for the query. Mocked in Phase 1. */
  searchProducts(query: string): Promise<MerchantListingCandidate[]>;

  /**
   * Builds a real, clickable link to this platform's own public search
   * results for a product name. Never scraped, never a user-supplied URL —
   * just a constructed query string, which is why it's safe to redirect to
   * (see lib/security/redirect.ts).
   */
  buildRedirectUrl(productName: string): string;
}

export function tokenize(text: string): string[] {
  const merged = text.toLowerCase().replace(/(\d+)\s?gb\b/g, "$1gb");
  return merged
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
}

/** Fraction of the query's tokens that also appear in the title — cheap, deterministic "search". */
export function relevance(query: string, title: string): number {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;
  const titleTokens = new Set(tokenize(title));
  let hits = 0;
  for (const token of queryTokens) if (titleTokens.has(token)) hits += 1;
  return hits / queryTokens.size;
}

export const RELEVANCE_THRESHOLD = 0.6;
