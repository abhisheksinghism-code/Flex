import type { ReviewSnippet, ReviewSummary } from "@/lib/core/types";

export interface AIReviewProvider {
  /** Summarizes only the review snippets it's given — never invents content. */
  summarize(snippets: ReviewSnippet[]): Promise<ReviewSummary>;
}
