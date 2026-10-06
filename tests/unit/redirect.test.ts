import { describe, expect, it } from "vitest";
import { assertAllowedRedirect } from "@/lib/security/redirect";

describe("assertAllowedRedirect", () => {
  it("allows a real merchant search URL", () => {
    expect(() => assertAllowedRedirect("https://www.amazon.in/s?k=iphone")).not.toThrow();
  });

  it("rejects an arbitrary external host", () => {
    expect(() => assertAllowedRedirect("https://evil.example.com/phish")).toThrow();
  });

  it("rejects a non-https URL", () => {
    expect(() => assertAllowedRedirect("http://www.amazon.in/s?k=iphone")).toThrow();
  });

  it("rejects a malformed URL", () => {
    expect(() => assertAllowedRedirect("not a url")).toThrow();
  });
});
