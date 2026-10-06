import type { MerchantListingCandidate } from "@/lib/core/types";
import { listingsForMerchant } from "@/lib/core/providers/seed-catalog";
import { RELEVANCE_THRESHOLD, relevance, type MerchantProvider } from "@/lib/core/providers/types";

export class MockAmazonProvider implements MerchantProvider {
  readonly id = "amazon_in" as const;
  readonly displayName = "Amazon";

  async searchProducts(query: string): Promise<MerchantListingCandidate[]> {
    return listingsForMerchant("amazon_in")
      .filter((listing) => relevance(query, listing.title) >= RELEVANCE_THRESHOLD)
      .map((listing) => ({ ...listing, isMocked: true as const }));
  }

  buildRedirectUrl(productName: string): string {
    return `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`;
  }
}
