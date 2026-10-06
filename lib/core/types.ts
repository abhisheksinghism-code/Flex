export type MerchantId = "amazon_in" | "flipkart" | "myntra";

export type ReviewSentiment = "POSITIVE" | "NEGATIVE";

export interface ReviewSnippet {
  text: string;
  sentiment: ReviewSentiment;
}

/** One merchant's listing for a product, as that provider's mock catalog returns it. */
export interface MerchantListingCandidate {
  merchant: MerchantId;
  /** Raw, merchant-styled title — platforms phrase the same product differently.
   * This is the ONLY thing the matching layer reads to derive brand/model/
   * variant; providers never hand over pre-structured attributes, the same
   * way a real merchant API/scrape would only give you a title string. */
  title: string;
  category: string;
  priceInPaise: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  reviewSnippets: ReviewSnippet[];
  /** Always true in Phase 1 — every merchant listing is seeded demo data, not live. */
  isMocked: true;
}

export interface NormalizedAttributes {
  brand: string | null;
  model: string;
  category: string;
  storageGb: number | null;
  colorName: string | null;
  sizeLabel: string | null;
}

export interface MatchedVariantGroup {
  slug: string;
  canonicalName: string;
  attributes: NormalizedAttributes;
  /** 0-1 confidence that every listing in `listings` is the same real-world product. */
  confidence: number;
  listings: MerchantListingCandidate[];
}

export interface ReviewSummary {
  likes: string[];
  complaints: string[];
  verdict: string | null;
  bestFor: string | null;
  thinkTwiceIf: string | null;
  insufficientData: boolean;
}
