import { ArrowUpRight } from "lucide-react";
import { formatInr, MERCHANT_DISPLAY_NAMES, MERCHANT_ORDER } from "@/lib/core/format";
import type { MerchantId } from "@/lib/core/types";

export interface ComparisonListing {
  merchant: MerchantId;
  priceInPaise: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  redirectUrl: string;
}

export function ComparisonTable({ listings }: { listings: ComparisonListing[] }) {
  const byMerchant = new Map(listings.map((listing) => [listing.merchant, listing]));
  const inStockPrices = listings.filter((l) => l.inStock).map((l) => l.priceInPaise);
  const lowestPrice = inStockPrices.length > 0 ? Math.min(...inStockPrices) : null;

  return (
    <ul className="divide-y divide-border">
      {MERCHANT_ORDER.map((merchant) => {
        const listing = byMerchant.get(merchant);
        const isLowest = !!listing && listing.inStock && listing.priceInPaise === lowestPrice;

        if (!listing) {
          return (
            <li key={merchant} className="flex items-center justify-between py-5">
              <span className="font-medium text-muted-foreground">
                {MERCHANT_DISPLAY_NAMES[merchant]}
              </span>
              <span className="text-sm text-muted-foreground">Not available</span>
            </li>
          );
        }

        return (
          <li key={merchant} className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-medium">{MERCHANT_DISPLAY_NAMES[merchant]}</span>
              {isLowest && (
                <span className="text-xs font-medium text-primary">Best price</span>
              )}
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className={isLowest ? "font-semibold text-primary" : "font-medium"}>
                  {listing.inStock ? formatInr(listing.priceInPaise) : "Out of stock"}
                </p>
                <p className="text-xs text-muted-foreground">
                  ★ {listing.rating.toFixed(1)} · {listing.reviewCount.toLocaleString("en-IN")}
                </p>
              </div>
              <a
                href={listing.redirectUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex shrink-0 items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                View deal
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
