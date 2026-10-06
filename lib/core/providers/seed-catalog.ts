import type { MerchantId, MerchantListingCandidate } from "@/lib/core/types";

type SeedListing = Omit<MerchantListingCandidate, "isMocked">;

// Demo data only — see docs/ARCHITECTURE.md "What's real vs. mocked". Titles
// deliberately mirror how each platform actually phrases the same product
// differently, so the matching layer has something real to reconcile.
// Samsung's listings intentionally carry no review snippets, to exercise the
// "not enough reliable review data" path in the AI summary. Nike's catalog
// intentionally includes a second, genuinely different colourway/size on
// Flipkart only, to exercise the matching layer's disambiguation path.
export const SEED_CATALOG: SeedListing[] = [
  // --- iPhone 17 Pro 256GB Natural Titanium — Amazon + Flipkart, no Myntra ---
  {
    merchant: "amazon_in",
    title: "Apple iPhone 17 Pro (256 GB) - Natural Titanium",
    category: "smartphone",
    priceInPaise: 149_900_00,
    rating: 4.5,
    reviewCount: 12430,
    inStock: true,
    reviewSnippets: [
      { text: "Camera quality is incredible, best I've used on a phone.", sentiment: "POSITIVE" },
      { text: "Battery easily lasts a full day of heavy use.", sentiment: "POSITIVE" },
      { text: "Build quality feels premium, titanium finish is great.", sentiment: "POSITIVE" },
      { text: "Really expensive for what feels like an incremental upgrade.", sentiment: "NEGATIVE" },
      { text: "Noticeably heavier than my old phone.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "flipkart",
    title: "APPLE iPhone 17 Pro (Natural Titanium, 256 GB)",
    category: "smartphone",
    priceInPaise: 148_900_00,
    rating: 4.4,
    reviewCount: 8201,
    inStock: true,
    reviewSnippets: [
      { text: "Performance is buttery smooth even with heavy apps open.", sentiment: "POSITIVE" },
      { text: "Display looks stunning outdoors, very bright.", sentiment: "POSITIVE" },
      { text: "Charging speed hasn't improved much over last year's model.", sentiment: "NEGATIVE" },
      { text: "Price feels steep compared to competitors.", sentiment: "NEGATIVE" },
    ],
  },

  // --- Samsung Galaxy S26 Ultra 256GB Titanium Black — no review text yet ---
  {
    merchant: "amazon_in",
    title: "Samsung Galaxy S26 Ultra 5G (256GB, Titanium Black)",
    category: "smartphone",
    priceInPaise: 129_999_00,
    rating: 4.3,
    reviewCount: 5400,
    inStock: true,
    reviewSnippets: [],
  },
  {
    merchant: "flipkart",
    title: "SAMSUNG Galaxy S26 Ultra (Titanium Black, 256 GB)",
    category: "smartphone",
    priceInPaise: 127_999_00,
    rating: 4.2,
    reviewCount: 3100,
    inStock: true,
    reviewSnippets: [],
  },

  // --- Nike Air Max 90 — White/Black UK 9 on all three platforms ---
  {
    merchant: "amazon_in",
    title: "Nike Air Max 90 Men's Shoes - White/Black, UK 9",
    category: "footwear",
    priceInPaise: 9_999_00,
    rating: 4.3,
    reviewCount: 2200,
    inStock: true,
    reviewSnippets: [
      { text: "Super comfortable for all-day wear.", sentiment: "POSITIVE" },
      { text: "Classic look, goes with everything.", sentiment: "POSITIVE" },
      { text: "Runs slightly narrow, consider half a size up.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "flipkart",
    title: "NIKE Air Max 90 Running Shoes For Men (White/Black) UK 9",
    category: "footwear",
    priceInPaise: 9_499_00,
    rating: 4.1,
    reviewCount: 1500,
    inStock: true,
    reviewSnippets: [
      { text: "Great cushioning, good for walking long distances.", sentiment: "POSITIVE" },
      { text: "Sole started showing wear within a few months.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "myntra",
    title: "Nike Men Air Max 90 White Black Sneakers UK 9",
    category: "footwear",
    priceInPaise: 9_799_00,
    rating: 4.4,
    reviewCount: 3400,
    inStock: true,
    reviewSnippets: [
      { text: "Looks exactly like the pictures.", sentiment: "POSITIVE" },
      { text: "True to size, fits as expected.", sentiment: "POSITIVE" },
      { text: "A bit pricey for a casual sneaker.", sentiment: "NEGATIVE" },
    ],
  },
  // A genuinely different variant — different colourway and size — only on
  // Flipkart. The matcher must keep this separate from the listing above.
  {
    merchant: "flipkart",
    title: "NIKE Air Max 90 Men (Black/Red) UK 10",
    category: "footwear",
    priceInPaise: 9_999_00,
    rating: 4.0,
    reviewCount: 400,
    inStock: true,
    reviewSnippets: [
      { text: "Bold colourway, stands out from the usual colours.", sentiment: "POSITIVE" },
      { text: "Sizing felt slightly off compared to other Nike shoes.", sentiment: "NEGATIVE" },
    ],
  },

  // --- Levi's 511 Slim Fit Jeans — all three platforms ---
  {
    merchant: "amazon_in",
    title: "Levi's Men's 511 Slim Fit Jeans - Blue",
    category: "jeans",
    priceInPaise: 2_999_00,
    rating: 4.2,
    reviewCount: 900,
    inStock: true,
    reviewSnippets: [
      { text: "Great fit, true slim without being too tight.", sentiment: "POSITIVE" },
      { text: "Fabric feels durable, holding up well after washes.", sentiment: "POSITIVE" },
      { text: "Sizing runs a little long, had to get mine hemmed.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "flipkart",
    title: "LEVIS Slim Men Blue Jeans 511",
    category: "jeans",
    priceInPaise: 2_799_00,
    rating: 4.0,
    reviewCount: 650,
    inStock: true,
    reviewSnippets: [
      { text: "Good value for a Levi's at this price point.", sentiment: "POSITIVE" },
      { text: "Colour faded a bit after a few washes.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "myntra",
    title: "Levis Men 511 Slim Fit Blue Jeans",
    category: "jeans",
    priceInPaise: 2_899_00,
    rating: 4.3,
    reviewCount: 1800,
    inStock: true,
    reviewSnippets: [
      { text: "Comfortable stretch denim, easy to move in.", sentiment: "POSITIVE" },
      { text: "Looks sharp for both casual and semi-formal wear.", sentiment: "POSITIVE" },
      { text: "Runs slightly tight at the waist for me.", sentiment: "NEGATIVE" },
    ],
  },

  // --- Sony WH-1000XM6 — Amazon + Flipkart, no Myntra ---
  {
    merchant: "amazon_in",
    title: "Sony WH-1000XM6 Wireless Noise Cancelling Headphones",
    category: "headphones",
    priceInPaise: 29_990_00,
    rating: 4.6,
    reviewCount: 4300,
    inStock: true,
    reviewSnippets: [
      { text: "Noise cancellation is next level, blocks almost everything.", sentiment: "POSITIVE" },
      { text: "Battery lasts for days of regular use.", sentiment: "POSITIVE" },
      { text: "Call quality is surprisingly clear for a headset.", sentiment: "POSITIVE" },
      { text: "Expensive compared to the older XM5 model.", sentiment: "NEGATIVE" },
      { text: "Carrying case is bulkier than I'd like.", sentiment: "NEGATIVE" },
    ],
  },
  {
    merchant: "flipkart",
    title: "SONY WH-1000XM6 Bluetooth Headset with Noise Cancellation",
    category: "headphones",
    priceInPaise: 28_990_00,
    rating: 4.5,
    reviewCount: 2100,
    inStock: true,
    reviewSnippets: [
      { text: "Sound quality is excellent for the price.", sentiment: "POSITIVE" },
      { text: "App setup was a bit fiddly initially.", sentiment: "NEGATIVE" },
    ],
  },
];

export function listingsForMerchant(merchant: MerchantId): SeedListing[] {
  return SEED_CATALOG.filter((listing) => listing.merchant === merchant);
}
