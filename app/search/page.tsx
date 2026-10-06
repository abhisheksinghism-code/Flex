import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { search } from "@/lib/core/search/orchestrator";
import { parseSearchQuery } from "@/lib/validation/search";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { EmptyState } from "@/components/empty-state";
import { SearchBar } from "@/components/search-bar";
import { CategoryIcon } from "@/components/category-icon";
import { MERCHANT_DISPLAY_NAMES } from "@/lib/core/format";

export const metadata = { title: "Search | Flex" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const parsed = parseSearchQuery(q ?? "");

  if (!parsed.success) {
    return (
      <EmptyState
        title="What are you looking for?"
        message="Try something like “iPhone 17 Pro” or “Nike Air Max 90”."
      >
        <SearchBar />
      </EmptyState>
    );
  }

  const query = parsed.data;

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(`search:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return (
      <EmptyState
        title="Too many searches"
        message="You've made a lot of searches in a short time. Please wait a minute and try again."
      />
    );
  }

  const outcome = await search(query);

  if (outcome.groups.length === 0) {
    return (
      <EmptyState
        title="We couldn't find that one."
        message="Try checking the product name, or search with the brand and model — for example “Sony WH-1000XM6”."
      >
        <SearchBar defaultValue={query} />
      </EmptyState>
    );
  }

  if (!outcome.needsDisambiguation) {
    redirect(`/compare/${outcome.groups[0].slug}?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Which one did you mean?</h1>
        <p className="text-sm text-muted-foreground">
          A few possible matches — pick the right one to compare.
        </p>
      </div>
      <ul className="space-y-3">
        {outcome.groups.map((group) => (
          <li key={group.slug}>
            <Link
              href={`/compare/${group.slug}?q=${encodeURIComponent(query)}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <CategoryIcon category={group.attributes.category} className="size-5 text-muted-foreground" />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{group.canonicalName}</span>
                <span className="block text-sm text-muted-foreground">
                  Available on{" "}
                  {group.listings.map((listing) => MERCHANT_DISPLAY_NAMES[listing.merchant]).join(", ")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
