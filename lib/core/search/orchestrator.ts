import { MERCHANT_PROVIDERS } from "@/lib/core/providers/registry";
import { matchCandidates, MATCH_CONFIDENCE_THRESHOLD } from "@/lib/core/matching/match";
import { MockAIReviewProvider } from "@/lib/core/ai/mock-summarizer";
import { assertAllowedRedirect } from "@/lib/security/redirect";
import {
  loadCachedCompareView,
  logSearchQuery,
  persistCompareResult,
  type CompareViewModel,
  type ListingWithRedirect,
} from "@/lib/db/cache";
import { buildVariantLabel } from "@/lib/core/format";
import type { MatchedVariantGroup, MerchantId, MerchantListingCandidate } from "@/lib/core/types";

// One slow/broken provider must never take the whole comparison down with it.
const PROVIDER_TIMEOUT_MS = 4000;

const PROVIDER_BY_ID = new Map(MERCHANT_PROVIDERS.map((provider) => [provider.id, provider]));

const aiProvider = new MockAIReviewProvider();

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("provider timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export interface SearchOutcome {
  groups: MatchedVariantGroup[];
  needsDisambiguation: boolean;
  unavailableMerchants: MerchantId[];
}

/** Fans out to every provider in parallel and groups the results. No DB access. */
export async function computeGroups(query: string): Promise<SearchOutcome> {
  const candidateLists = await Promise.allSettled(
    MERCHANT_PROVIDERS.map((provider) => withTimeout(provider.searchProducts(query), PROVIDER_TIMEOUT_MS))
  );

  const candidates: MerchantListingCandidate[] = [];
  const unavailableMerchants: MerchantId[] = [];
  candidateLists.forEach((result, index) => {
    const provider = MERCHANT_PROVIDERS[index];
    if (result.status === "fulfilled") {
      candidates.push(...result.value);
    } else {
      unavailableMerchants.push(provider.id);
    }
  });

  const groups = matchCandidates(candidates);
  const needsDisambiguation = groups.length > 1 && groups[0].confidence < MATCH_CONFIDENCE_THRESHOLD;

  return { groups, needsDisambiguation, unavailableMerchants };
}

function buildListingsWithRedirects(group: MatchedVariantGroup): ListingWithRedirect[] {
  return group.listings.map((listing) => {
    const provider = PROVIDER_BY_ID.get(listing.merchant);
    const redirectUrl = provider
      ? assertAllowedRedirect(provider.buildRedirectUrl(group.canonicalName))
      : "";
    return {
      merchant: listing.merchant,
      priceInPaise: listing.priceInPaise,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      inStock: listing.inStock,
      redirectUrl,
      reviewSnippets: listing.reviewSnippets,
    };
  });
}

/**
 * Cache-first: returns a cached, still-fresh view if one exists. Otherwise
 * recomputes from providers (requires the original query, since a bookmarked
 * slug alone isn't enough to re-run a mock "search"), persists it, and
 * returns the freshly computed view.
 */
export async function getOrBuildCompareView(
  slug: string,
  originalQuery?: string
): Promise<CompareViewModel | null> {
  const cached = await loadCachedCompareView(slug);
  if (cached) return cached;

  if (!originalQuery) return null;

  const { groups, unavailableMerchants } = await computeGroups(originalQuery);
  const group = groups.find((candidate) => candidate.slug === slug);
  if (!group) return null;

  const listings = buildListingsWithRedirects(group);
  const allSnippets = group.listings.flatMap((listing) => listing.reviewSnippets);
  const aiSummary = await aiProvider.summarize(allSnippets);

  await persistCompareResult(group, listings, aiSummary);

  return {
    slug: group.slug,
    canonicalName: group.canonicalName,
    productName: `${group.attributes.brand ?? ""} ${group.attributes.model}`.trim(),
    variantLabel: buildVariantLabel(
      group.attributes.storageGb,
      group.attributes.colorName,
      group.attributes.sizeLabel
    ),
    unavailableMerchants,
    listings: listings.map((listing) => ({
      merchant: listing.merchant,
      priceInPaise: listing.priceInPaise,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      inStock: listing.inStock,
      redirectUrl: listing.redirectUrl,
    })),
    aiSummary,
    fromCache: false,
  };
}

export async function search(query: string) {
  const outcome = await computeGroups(query);
  await logSearchQuery(query, outcome.groups[0]?.slug ?? null);
  return outcome;
}
