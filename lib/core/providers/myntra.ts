import type { MerchantListingCandidate } from "@/lib/core/types";
import { listingsForMerchant } from "@/lib/core/providers/seed-catalog";
import { RELEVANCE_THRESHOLD, relevance, type MerchantProvider } from "@/lib/core/providers/types";

export class MockMyntraProvider implements MerchantProvider {
  readonly id = "myntra" as const;
  readonly displayName = "Myntra";

  async searchProducts(query: string): Promise<MerchantListingCandidate[]> {
    return listingsForMerchant("myntra")
      .filter((listing) => relevance(query, listing.title) >= RELEVANCE_THRESHOLD)
      .map((listing) => ({ ...listing, isMocked: true as const }));
  }

  buildRedirectUrl(productName: string): string {
    return `https://www.myntra.com/search?q=${encodeURIComponent(productName)}`;
  }
}
