import { describe, expect, it } from "vitest";
import { mockSummarize } from "@/lib/core/ai/mock-summarizer";

describe("mockSummarize", () => {
  it("flags insufficient data instead of fabricating a summary", () => {
    const summary = mockSummarize([]);
    expect(summary.insufficientData).toBe(true);
    expect(summary.likes).toHaveLength(0);
    expect(summary.complaints).toHaveLength(0);
    expect(summary.verdict).toBeNull();
  });

  it("only surfaces likes/complaints that are literally present in the input snippets", () => {
    const summary = mockSummarize([
      { text: "Great battery life", sentiment: "POSITIVE" },
      { text: "Too expensive", sentiment: "NEGATIVE" },
    ]);
    expect(summary.insufficientData).toBe(false);
    expect(summary.likes).toEqual(["Great battery life"]);
    expect(summary.complaints).toEqual(["Too expensive"]);
  });

  it("caps the number of bullets rather than dumping every snippet", () => {
    const manyPositives = Array.from({ length: 10 }, (_, i) => ({
      text: `Positive point ${i}`,
      sentiment: "POSITIVE" as const,
    }));
    const summary = mockSummarize(manyPositives);
    expect(summary.likes.length).toBeLessThanOrEqual(4);
  });
});
