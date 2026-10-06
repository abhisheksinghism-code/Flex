import { describe, expect, it } from "vitest";
import { MERCHANT_PROVIDERS } from "@/lib/core/providers/registry";

describe("merchant providers", () => {
  it("every provider implements the common MerchantProvider contract", () => {
    for (const provider of MERCHANT_PROVIDERS) {
      expect(typeof provider.id).toBe("string");
      expect(typeof provider.displayName).toBe("string");
      expect(typeof provider.searchProducts).toBe("function");
      expect(typeof provider.buildRedirectUrl).toBe("function");
    }
  });

  it("every returned listing is explicitly marked as mocked", async () => {
    for (const provider of MERCHANT_PROVIDERS) {
      const results = await provider.searchProducts("iPhone 17 Pro 256GB");
      for (const result of results) {
        expect(result.isMocked).toBe(true);
      }
    }
  });

  it("builds a real https link on the provider's own host", () => {
    const amazon = MERCHANT_PROVIDERS.find((p) => p.id === "amazon_in")!;
    const url = new URL(amazon.buildRedirectUrl("iPhone 17 Pro"));
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("www.amazon.in");
  });

  it("Myntra realistically has no smartphone listings", async () => {
    const myntra = MERCHANT_PROVIDERS.find((p) => p.id === "myntra")!;
    const results = await myntra.searchProducts("iPhone 17 Pro 256GB");
    expect(results).toHaveLength(0);
  });

  it("an irrelevant query returns no listings from any provider", async () => {
    for (const provider of MERCHANT_PROVIDERS) {
      const results = await provider.searchProducts("something completely unrelated xyz");
      expect(results).toHaveLength(0);
    }
  });
});
