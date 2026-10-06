import { describe, expect, it } from "vitest";
import { normalizeProductText } from "@/lib/core/matching/normalize";

describe("normalizeProductText", () => {
  it("extracts brand, model, storage, and color from an Amazon-style title", () => {
    const attrs = normalizeProductText("Apple iPhone 17 Pro (256 GB) - Natural Titanium");
    expect(attrs.brand).toBe("Apple");
    expect(attrs.model).toBe("iPhone 17 Pro");
    expect(attrs.storageGb).toBe(256);
    expect(attrs.colorName).toBe("Natural Titanium");
    expect(attrs.category).toBe("smartphone");
  });

  it("extracts the same attributes from Flipkart's differently-ordered title", () => {
    const attrs = normalizeProductText("APPLE iPhone 17 Pro (Natural Titanium, 256 GB)");
    expect(attrs.brand).toBe("Apple");
    expect(attrs.model).toBe("iPhone 17 Pro");
    expect(attrs.storageGb).toBe(256);
    expect(attrs.colorName).toBe("Natural Titanium");
  });

  it("extracts shoe size and footwear category", () => {
    const attrs = normalizeProductText("Nike Air Max 90 Men's Shoes - White/Black, UK 9");
    expect(attrs.sizeLabel).toBe("UK 9");
    expect(attrs.category).toBe("footwear");
  });

  it("treats a space-separated colourway the same as a slash-separated one", () => {
    const slash = normalizeProductText("Nike Air Max 90 Men's Shoes - White/Black, UK 9");
    const spaced = normalizeProductText("Nike Men Air Max 90 White Black Sneakers UK 9");
    expect(spaced.colorName).toBe(slash.colorName);
  });

  it("falls back to null attributes for unrecognized brands", () => {
    const attrs = normalizeProductText("Some Unknown Gadget 999");
    expect(attrs.brand).toBeNull();
    expect(attrs.category).toBe("unknown");
  });
});
