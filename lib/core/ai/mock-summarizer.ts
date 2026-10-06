import type { AIReviewProvider } from "@/lib/core/ai/types";
import type { ReviewSnippet, ReviewSummary } from "@/lib/core/types";

// Deterministic, keyword-based summarizer — zero cost, zero API key, and by
// construction cannot fabricate anything beyond the snippets it's handed.
// A real LLM-backed provider can implement the same AIReviewProvider
// interface later without any caller changing (see docs/ARCHITECTURE.md).

const MIN_SNIPPETS_FOR_SUMMARY = 2;
const MAX_BULLETS = 4;

const THEME_KEYWORDS: Record<string, string[]> = {
  camera: ["camera"],
  battery: ["battery"],
  performance: ["performance", "smooth", "fast", "buttery"],
  display: ["display", "screen", "bright"],
  build: ["build", "premium", "finish"],
  comfort: ["comfortable", "comfort", "cushion"],
  price: ["expensive", "price", "pricey", "value", "steep"],
  durability: ["durable", "wear", "fade", "faded", "holding up"],
  sizing: ["size", "sizing", "fit", "narrow", "tight", "long", "runs"],
  sound: ["sound", "noise", "audio", "call quality"],
  charging: ["charging", "charge"],
};

const THEME_LABELS: Record<string, string> = {
  camera: "Camera quality",
  battery: "Battery life",
  performance: "Performance",
  display: "Display quality",
  build: "Build quality",
  comfort: "Comfort",
  price: "Price/value",
  durability: "Durability",
  sizing: "Sizing/fit",
  sound: "Sound quality",
  charging: "Charging speed",
};

function detectThemes(texts: string[]): string[] {
  const hits = new Set<string>();
  for (const text of texts) {
    const lower = text.toLowerCase();
    for (const [key, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (keywords.some((keyword) => lower.includes(keyword))) hits.add(key);
    }
  }
  return Array.from(hits);
}

function buildVerdict(likesCount: number, complaintsCount: number): string {
  if (likesCount > 0 && complaintsCount === 0) {
    return "Reviewers are consistently positive about this product, with no notable complaints in the available reviews.";
  }
  if (likesCount === 0 && complaintsCount > 0) {
    return "Feedback in the available reviews leans negative — worth reading the complaints carefully before buying.";
  }
  if (likesCount >= complaintsCount) {
    return "Reviewers are generally positive, though a few recurring complaints are worth knowing about before you buy.";
  }
  return "Feedback is mixed — weigh the complaints against the likes based on what matters most to you.";
}

export function mockSummarize(snippets: ReviewSnippet[]): ReviewSummary {
  if (snippets.length < MIN_SNIPPETS_FOR_SUMMARY) {
    return {
      likes: [],
      complaints: [],
      verdict: null,
      bestFor: null,
      thinkTwiceIf: null,
      insufficientData: true,
    };
  }

  const positives = snippets.filter((s) => s.sentiment === "POSITIVE").map((s) => s.text);
  const negatives = snippets.filter((s) => s.sentiment === "NEGATIVE").map((s) => s.text);

  const positiveThemes = detectThemes(positives).map((key) => THEME_LABELS[key]);
  const negativeThemes = detectThemes(negatives).map((key) => THEME_LABELS[key]);

  return {
    likes: positives.slice(0, MAX_BULLETS),
    complaints: negatives.slice(0, MAX_BULLETS),
    verdict: buildVerdict(positives.length, negatives.length),
    bestFor: positiveThemes.length ? positiveThemes.slice(0, 3).join(", ") : null,
    thinkTwiceIf: negativeThemes.length ? negativeThemes.slice(0, 2).join(" or ") : null,
    insufficientData: false,
  };
}

export class MockAIReviewProvider implements AIReviewProvider {
  async summarize(snippets: ReviewSnippet[]): Promise<ReviewSummary> {
    return mockSummarize(snippets);
  }
}
