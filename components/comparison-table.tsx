import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Platform</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Rating</TableHead>
          <TableHead className="text-right">Reviews</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MERCHANT_ORDER.map((merchant) => {
          const listing = byMerchant.get(merchant);
          const isLowest = !!listing && listing.inStock && listing.priceInPaise === lowestPrice;

          return (
            <TableRow key={merchant}>
              <TableCell className="font-medium">{MERCHANT_DISPLAY_NAMES[merchant]}</TableCell>
              <TableCell className="text-right">
                {listing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className={isLowest ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}>
                      {formatInr(listing.priceInPaise)}
                    </span>
                    {isLowest && <Badge variant="secondary">Best Price</Badge>}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {listing ? `${listing.rating.toFixed(1)}/5` : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-right">
                {listing ? listing.reviewCount.toLocaleString("en-IN") : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                {listing ? (
                  listing.inStock ? "In Stock" : "Out of Stock"
                ) : (
                  <span className="text-muted-foreground">Not Available</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {listing ? (
                  <a
                    href={listing.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View Deal
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
