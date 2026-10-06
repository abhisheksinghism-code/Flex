import { describe, expect, it } from "vitest";
import { MAX_QUERY_LENGTH, parseSearchQuery, parseSlug } from "@/lib/validation/search";

describe("parseSearchQuery", () => {
  it("accepts a normal product query", () => {
    expect(parseSearchQuery("iPhone 17 Pro 256GB").success).toBe(true);
  });

  it("rejects an empty or too-short query", () => {
    expect(parseSearchQuery("").success).toBe(false);
    expect(parseSearchQuery("a").success).toBe(false);
  });

  it("rejects an overly long query", () => {
    expect(parseSearchQuery("a".repeat(MAX_QUERY_LENGTH + 1)).success).toBe(false);
  });

  it("strips script-injection-shaped characters without rejecting the query", () => {
    const result = parseSearchQuery("<script>alert(1)</script>");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toContain("<");
      expect(result.data).not.toContain(">");
    }
  });
});

describe("parseSlug", () => {
  it("accepts a normal slug", () => {
    expect(parseSlug("apple-iphone-17-pro-256gb").success).toBe(true);
  });

  it("rejects path traversal attempts", () => {
    expect(parseSlug("../../etc/passwd").success).toBe(false);
  });

  it("rejects slugs with unexpected characters", () => {
    expect(parseSlug("<script>alert(1)</script>").success).toBe(false);
  });
});
