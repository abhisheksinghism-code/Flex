import type { NormalizedAttributes } from "@/lib/core/types";

// Deterministic, rule-based extraction — no ML, no embeddings. Per-category
// lookup tables so a new brand/model/color is a data change, not a logic
// change. See docs/ARCHITECTURE.md for why this is intentionally simple.

const CATEGORY_BY_BRAND: Record<string, string> = {
  apple: "smartphone",
  samsung: "smartphone",
  nike: "footwear",
  "levi's": "jeans",
  levis: "jeans",
  sony: "headphones",
};

const BRAND_ALIASES: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  nike: "Nike",
  "levi's": "Levi's",
  levis: "Levi's",
  sony: "Sony",
};

const MODEL_PATTERNS: { brand: string; regex: RegExp; model: string }[] = [
  { brand: "Apple", regex: /iphone\s*17\s*pro/i, model: "iPhone 17 Pro" },
  { brand: "Samsung", regex: /galaxy\s*s26\s*ultra/i, model: "Galaxy S26 Ultra" },
  { brand: "Nike", regex: /air\s*max\s*90/i, model: "Air Max 90" },
  { brand: "Levi's", regex: /\b511\b/i, model: "511 Slim Fit Jeans" },
  { brand: "Sony", regex: /wh-?1000xm6/i, model: "WH-1000XM6" },
];

// Longest phrases first so "Titanium Black" wins over a later bare "Black" match.
const COLOR_PHRASES = [
  "Natural Titanium",
  "Titanium Black",
  "White/Black",
  "Black/Red",
  "White",
  "Black",
  "Blue",
];

function detectBrand(text: string): string | null {
  for (const alias of Object.keys(BRAND_ALIASES)) {
    if (new RegExp(`\\b${alias.replace("'", "'?")}\\b`, "i").test(text)) {
      return BRAND_ALIASES[alias];
    }
  }
  return null;
}

function detectModel(text: string, brandHint: string | null) {
  for (const pattern of MODEL_PATTERNS) {
    if (pattern.regex.test(text) && (!brandHint || pattern.brand === brandHint)) {
      return pattern;
    }
  }
  return null;
}

function detectColor(text: string): string | null {
  for (const phrase of COLOR_PHRASES) {
    // Word-boundary match, not a plain substring check — "Bluetooth" must
    // not be mistaken for the colour "Blue". Multi-word colours also need a
    // flexible separator: one platform writes "White/Black", another writes
    // "White Black" — same colourway, different punctuation.
    const words = phrase.split("/").map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = words.join("[/\\s-]+");
    if (new RegExp(`\\b${pattern}\\b`, "i").test(text)) return phrase;
  }
  return null;
}

function detectStorageGb(text: string): number | null {
  const match = text.match(/(\d{2,4})\s?GB\b/i);
  return match ? Number(match[1]) : null;
}

function detectShoeSize(text: string): string | null {
  const match = text.match(/\bUK\s?(\d+(?:\.\d)?)\b/i);
  return match ? `UK ${match[1]}` : null;
}

export function normalizeProductText(text: string): NormalizedAttributes {
  const brand = detectBrand(text);
  const modelMatch = detectModel(text, brand);
  const resolvedBrand = brand ?? modelMatch?.brand ?? null;

  return {
    brand: resolvedBrand,
    model: modelMatch?.model ?? text.trim(),
    category: resolvedBrand ? CATEGORY_BY_BRAND[resolvedBrand.toLowerCase()] ?? "unknown" : "unknown",
    storageGb: detectStorageGb(text),
    colorName: detectColor(text),
    sizeLabel: detectShoeSize(text),
  };
}

export function slugifyAttributes(attrs: NormalizedAttributes): string {
  const parts = [
    attrs.brand,
    attrs.model,
    attrs.storageGb ? `${attrs.storageGb}gb` : null,
    attrs.colorName,
    attrs.sizeLabel,
  ].filter(Boolean);
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
