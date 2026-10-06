import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrBuildCompareView } from "@/lib/core/search/orchestrator";
import { parseSlug } from "@/lib/validation/search";
import { ComparisonTable } from "@/components/comparison-table";
import { AIReviewCard } from "@/components/ai-review-card";
import { EmptyState } from "@/components/empty-state";

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
        title="Product not found"
        message="This comparison link doesn't match anything in Flex's demo catalog."
      >
        <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
          Back to search
        </Link>
      </EmptyState>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-2xl font-semibold sm:text-3xl">{view.canonicalName}</h1>
      <div className="overflow-x-auto rounded-lg border">
        <ComparisonTable listings={view.listings} />
      </div>
      <AIReviewCard summary={view.aiSummary} />
      <p className="text-xs text-muted-foreground">
        Demo data — see{" "}
        <Link href="/disclaimer" className="underline-offset-4 hover:underline">
          Disclaimer
        </Link>
        . Prices and availability can change on the merchant&apos;s own site.
      </p>
    </main>
  );
}
