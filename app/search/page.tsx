import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { search } from "@/lib/core/search/orchestrator";
import { parseSearchQuery } from "@/lib/validation/search";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { EmptyState } from "@/components/empty-state";
import { SearchBar } from "@/components/search-bar";
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
        title="Enter a product to search"
        message="Try something like “iPhone 17 Pro 256GB” or “Nike Air Max 90”."
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
        message="You've made a lot of searches in a short time — please wait a minute and try again."
      />
    );
  }

  const outcome = await search(query);

  if (outcome.groups.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        message={`Flex's demo catalog doesn't have a match for "${query}" yet. Try one of the examples on the homepage.`}
      >
        <SearchBar defaultValue={query} />
      </EmptyState>
    );
  }

  if (!outcome.needsDisambiguation) {
    redirect(`/compare/${outcome.groups[0].slug}?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Which one did you mean?</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Flex found more than one possible match and isn&apos;t confident enough to compare them
        automatically. Pick the right one below.
      </p>
      <ul className="space-y-3">
        {outcome.groups.map((group) => (
          <li key={group.slug}>
            <Link
              href={`/compare/${group.slug}?q=${encodeURIComponent(query)}`}
              className="block rounded-lg border p-4 transition-colors hover:border-foreground"
            >
              <p className="font-medium">{group.canonicalName}</p>
              <p className="text-sm text-muted-foreground">
                Available on{" "}
                {group.listings.map((listing) => MERCHANT_DISPLAY_NAMES[listing.merchant]).join(", ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
