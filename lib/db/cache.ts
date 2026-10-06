import { prisma } from "@/lib/db/client";
import type { Merchant } from "@/lib/generated/prisma/client";
import type { MatchedVariantGroup, MerchantId, ReviewSummary } from "@/lib/core/types";
import { buildVariantLabel } from "@/lib/core/format";

// Price/rating snapshots are reused within this window instead of being
// recomputed on every request; the AI summary separately within its own
// (longer) window. No Redis — Postgres read/writes are cheap enough here.
const PRICE_RATING_TTL_MS = 6 * 60 * 60 * 1000;
const AI_SUMMARY_TTL_MS = 24 * 60 * 60 * 1000;

const MERCHANT_TO_ENUM: Record<MerchantId, Merchant> = {
  amazon_in: "AMAZON_IN",
  flipkart: "FLIPKART",
  myntra: "MYNTRA",
};

const ENUM_TO_MERCHANT: Record<Merchant, MerchantId> = {
  AMAZON_IN: "amazon_in",
  FLIPKART: "flipkart",
  MYNTRA: "myntra",
};

export interface CompareListingView {
  merchant: MerchantId;
  priceInPaise: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  redirectUrl: string;
}

export interface CompareViewModel {
  slug: string;
  canonicalName: string;
  productName: string;
  variantLabel: string | null;
  listings: CompareListingView[];
  aiSummary: ReviewSummary;
  fromCache: boolean;
  /** Merchants that failed to respond on this fetch. Only meaningful for a
   * freshly computed view — a cache hit has no fresh provider-failure info. */
  unavailableMerchants: MerchantId[];
}

/** Cache is an optimization, not a hard dependency — any DB error (including
 * no DATABASE_URL configured at all) is treated as a cache miss so the app
 * still works end to end on freshly computed mock data. */
export async function loadCachedCompareView(slug: string): Promise<CompareViewModel | null> {
  let variant;
  try {
    variant = await prisma.productVariant.findUnique({
      where: { slug },
      include: {
        product: true,
        listings: {
          include: {
            priceSnapshots: { orderBy: { fetchedAt: "desc" }, take: 1 },
            ratingSnapshots: { orderBy: { fetchedAt: "desc" }, take: 1 },
          },
        },
        aiSummary: true,
      },
    });
  } catch (error) {
    console.error("[flex] loadCachedCompareView failed, computing fresh instead:", error);
    return null;
  }
  if (!variant || variant.listings.length === 0) return null;

  const now = Date.now();
  const priceDataFresh = variant.listings.every((listing) => {
    const snapshot = listing.priceSnapshots[0];
    return snapshot && now - snapshot.fetchedAt.getTime() < PRICE_RATING_TTL_MS;
  });
  if (!priceDataFresh) return null;

  const aiFresh =
    !!variant.aiSummary && now - variant.aiSummary.fetchedAt.getTime() < AI_SUMMARY_TTL_MS;
  if (!aiFresh) return null;

  return {
    slug: variant.slug,
    canonicalName: variant.product.canonicalName,
    productName: `${variant.product.brand} ${variant.product.model}`.trim(),
    variantLabel: buildVariantLabel(variant.storageGb, variant.colorName, variant.sizeLabel),
    unavailableMerchants: [],
    listings: variant.listings.map((listing) => ({
      merchant: ENUM_TO_MERCHANT[listing.merchant],
      priceInPaise: listing.priceSnapshots[0].priceInPaise,
      rating: listing.ratingSnapshots[0]?.rating ?? 0,
      reviewCount: listing.ratingSnapshots[0]?.reviewCount ?? 0,
      inStock: listing.priceSnapshots[0].inStock,
      redirectUrl: listing.redirectUrl,
    })),
    aiSummary: {
      likes: variant.aiSummary!.likes,
      complaints: variant.aiSummary!.complaints,
      verdict: variant.aiSummary!.verdict,
      bestFor: variant.aiSummary!.bestFor,
      thinkTwiceIf: variant.aiSummary!.thinkTwiceIf,
      insufficientData: variant.aiSummary!.insufficientData,
    },
    fromCache: true,
  };
}

export interface ListingWithRedirect {
  merchant: MerchantId;
  priceInPaise: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  redirectUrl: string;
  reviewSnippets: { text: string; sentiment: "POSITIVE" | "NEGATIVE" }[];
}

/** Persists a freshly computed match + AI summary. Best-effort: a DB outage
 * degrades to "results render but aren't cached," never a broken page. */
export async function persistCompareResult(
  group: MatchedVariantGroup,
  listings: ListingWithRedirect[],
  aiSummary: ReviewSummary
): Promise<void> {
  try {
    const brand = group.attributes.brand ?? "Unknown";
    const product =
      (await prisma.product.findFirst({
        where: { brand, model: group.attributes.model, category: group.attributes.category },
      })) ??
      (await prisma.product.create({
        data: {
          brand,
          model: group.attributes.model,
          category: group.attributes.category,
          canonicalName: group.canonicalName,
        },
      }));

    const variant = await prisma.productVariant.upsert({
      where: { slug: group.slug },
      update: {},
      create: {
        slug: group.slug,
        productId: product.id,
        storageGb: group.attributes.storageGb ?? null,
        colorName: group.attributes.colorName ?? null,
        sizeLabel: group.attributes.sizeLabel ?? null,
      },
    });

    for (const listing of listings) {
      const merchantListing = await prisma.merchantListing.upsert({
        where: { variantId_merchant: { variantId: variant.id, merchant: MERCHANT_TO_ENUM[listing.merchant] } },
        update: { redirectUrl: listing.redirectUrl, isMocked: true },
        create: {
          variantId: variant.id,
          merchant: MERCHANT_TO_ENUM[listing.merchant],
          redirectUrl: listing.redirectUrl,
          isMocked: true,
        },
      });

      await prisma.priceSnapshot.create({
        data: {
          listingId: merchantListing.id,
          priceInPaise: listing.priceInPaise,
          inStock: listing.inStock,
        },
      });
      await prisma.ratingSnapshot.create({
        data: {
          listingId: merchantListing.id,
          rating: listing.rating,
          reviewCount: listing.reviewCount,
        },
      });

      const existingReviewCount = await prisma.reviewSource.count({
        where: { listingId: merchantListing.id },
      });
      if (existingReviewCount === 0 && listing.reviewSnippets.length > 0) {
        await prisma.reviewSource.createMany({
          data: listing.reviewSnippets.map((snippet) => ({
            listingId: merchantListing.id,
            snippet: snippet.text,
            sentiment: snippet.sentiment,
          })),
        });
      }
    }

    await prisma.aiReviewSummary.upsert({
      where: { variantId: variant.id },
      update: { ...aiSummary, fetchedAt: new Date() },
      create: { variantId: variant.id, ...aiSummary },
    });
  } catch (error) {
    console.error("[flex] persistCompareResult failed, continuing without cache:", error);
  }
}

export async function logSearchQuery(queryText: string, matchedSlug: string | null): Promise<void> {
  try {
    await prisma.searchQuery.create({ data: { queryText, matchedSlug } });
  } catch (error) {
    console.error("[flex] logSearchQuery failed:", error);
  }
}
