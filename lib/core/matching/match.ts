import type { MatchedVariantGroup, MerchantListingCandidate } from "@/lib/core/types";
import { normalizeProductText, slugifyAttributes } from "@/lib/core/matching/normalize";

/** Below this, we don't silently merge listings — the UI must let the user disambiguate. */
export const MATCH_CONFIDENCE_THRESHOLD = 0.75;

interface Cluster {
  key: string;
  attributes: ReturnType<typeof normalizeProductText>;
  listings: MerchantListingCandidate[];
}

/**
 * Groups raw merchant listings into one-or-more candidate "same product"
 * groups. Listings only ever land in the same group when brand, model,
 * storage, color, and size all agree after normalization — attribute
 * mismatches (e.g. a different colourway) become a separate, lower-confidence
 * group rather than being silently merged into the wrong comparison.
 */
export function matchCandidates(candidates: MerchantListingCandidate[]): MatchedVariantGroup[] {
  const clusters = new Map<string, Cluster>();

  for (const candidate of candidates) {
    const attributes = normalizeProductText(candidate.title);
    const key = [
      attributes.brand,
      attributes.model,
      attributes.storageGb,
      attributes.colorName,
      attributes.sizeLabel,
    ].join("|");

    const existing = clusters.get(key);
    if (existing) {
      existing.listings.push(candidate);
    } else {
      clusters.set(key, { key, attributes, listings: [candidate] });
    }
  }

  const allClusters = Array.from(clusters.values());

  // Ambiguity = more than one cluster shares the same brand+model but
  // differs on storage/color/size. That's exactly the "materially different
  // variant" case the brief calls out — confidence drops so the UI asks the
  // user to pick, instead of comparing unrelated listings.
  const byBrandModel = new Map<string, number>();
  for (const cluster of allClusters) {
    const bmKey = `${cluster.attributes.brand}|${cluster.attributes.model}`;
    byBrandModel.set(bmKey, (byBrandModel.get(bmKey) ?? 0) + 1);
  }

  return allClusters
    .map((cluster) => {
      const bmKey = `${cluster.attributes.brand}|${cluster.attributes.model}`;
      const siblingVariantCount = byBrandModel.get(bmKey) ?? 1;
      const confidence = siblingVariantCount > 1 ? 0.5 : 0.95;

      return {
        slug: slugifyAttributes(cluster.attributes),
        canonicalName: [
          cluster.attributes.brand,
          cluster.attributes.model,
          cluster.attributes.storageGb ? `${cluster.attributes.storageGb}GB` : null,
          cluster.attributes.colorName,
          cluster.attributes.sizeLabel,
        ]
          .filter(Boolean)
          .join(" "),
        attributes: cluster.attributes,
        confidence,
        listings: cluster.listings,
      } satisfies MatchedVariantGroup;
    })
    .sort((a, b) => b.listings.length - a.listings.length || b.confidence - a.confidence);
}
