import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getOrBuildCompareView } from "@/lib/core/search/orchestrator";
import { parseSlug } from "@/lib/validation/search";
import { ComparisonTable } from "@/components/comparison-table";
import { FlexReview } from "@/components/flex-review";
import { EmptyState } from "@/components/empty-state";
import { formatInr, MERCHANT_DISPLAY_NAMES } from "@/lib/core/format";

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed.success) return { title: "Flex" };
  const view = await getOrBuildCompareView(parsed.data);
  return {
    title: view ? `${view.canonicalName} — price comparison | Flex` : "Product not found | Flex",
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: PageProps<"/compare/[slug]">) {
  const { slug: rawSlug } = await params;
  const { q } = await searchParams;

  const slugResult = parseSlug(rawSlug);
  if (!slugResult.success) notFound();

  const originalQuery = typeof q === "string" ? q : undefined;
  const view = await getOrBuildCompareView(slugResult.data, originalQuery);

  if (!view) {
    return (
      <EmptyState
        title="We couldn't find that one."
        message="This comparison link doesn't match anything in Flex's catalog."
      >
        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Search again
        </Link>
      </EmptyState>
    );
  }

  const inStock = view.listings.filter((l) => l.inStock);
  const lowestPrice = inStock.length > 0 ? Math.min(...inStock.map((l) => l.priceInPaise)) : null;
  const highestPrice = inStock.length > 0 ? Math.max(...inStock.map((l) => l.priceInPaise)) : null;
  const bestListing = lowestPrice !== null ? inStock.find((l) => l.priceInPaise === lowestPrice) : null;
  const savings = lowestPrice !== null && highestPrice !== null ? highestPrice - lowestPrice : 0;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <div className="mb-10 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{view.productName}</h1>
        {view.variantLabel && <p className="text-sm text-muted-foreground">{view.variantLabel}</p>}
      </div>

      {lowestPrice !== null && bestListing && (
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Best price
          </p>
          <p className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            {formatInr(lowestPrice)}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Best on <span className="font-medium text-foreground">{MERCHANT_DISPLAY_NAMES[bestListing.merchant]}</span>
            {savings > 0 && <> · Save {formatInr(savings)} vs the highest listing</>}
          </p>
        </div>
      )}

      {view.unavailableMerchants.length > 0 && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Couldn&apos;t check{" "}
            {view.unavailableMerchants.map((m) => MERCHANT_DISPLAY_NAMES[m]).join(" or ")} right
            now. The results below are still available.
          </p>
        </div>
      )}

      <ComparisonTable listings={view.listings} />

      <div className="my-10 border-t border-border" />

      <FlexReview summary={view.aiSummary} />

      <p className="mt-12 text-xs text-muted-foreground">
        Demo data — see{" "}
        <Link href="/disclaimer" className="underline-offset-4 hover:underline">
          Disclaimer
        </Link>
        . Prices and availability can change on the merchant&apos;s own site.
      </p>
    </main>
  );
}
