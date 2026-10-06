import { describe, expect, it } from "vitest";
import { matchCandidates, MATCH_CONFIDENCE_THRESHOLD } from "@/lib/core/matching/match";
import type { MerchantListingCandidate } from "@/lib/core/types";

function listing(overrides: Partial<MerchantListingCandidate>): MerchantListingCandidate {
  return {
    merchant: "amazon_in",
    title: "",
    category: "smartphone",
    priceInPaise: 100_000,
    rating: 4,
    reviewCount: 10,
    inStock: true,
    reviewSnippets: [],
    isMocked: true,
    ...overrides,
  };
}

describe("matchCandidates", () => {
  it("groups the same product across merchants into one high-confidence group", () => {
    const groups = matchCandidates([
      listing({ merchant: "amazon_in", title: "Apple iPhone 17 Pro (256 GB) - Natural Titanium" }),
      listing({ merchant: "flipkart", title: "APPLE iPhone 17 Pro (Natural Titanium, 256 GB)" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].listings).toHaveLength(2);
    expect(groups[0].confidence).toBeGreaterThanOrEqual(MATCH_CONFIDENCE_THRESHOLD);
  });

  it("keeps materially different variants of the same brand+model apart instead of merging them", () => {
    const groups = matchCandidates([
      listing({ merchant: "amazon_in", title: "Nike Air Max 90 Men's Shoes - White/Black, UK 9" }),
      listing({ merchant: "flipkart", title: "NIKE Air Max 90 Men (Black/Red) UK 10" }),
    ]);
    expect(groups).toHaveLength(2);
    for (const group of groups) {
      expect(group.confidence).toBeLessThan(MATCH_CONFIDENCE_THRESHOLD);
    }
  });

  it("returns no groups for an empty candidate list", () => {
    expect(matchCandidates([])).toHaveLength(0);
  });
});
