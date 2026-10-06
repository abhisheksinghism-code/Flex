import { z } from "zod";

// Generous enough for real product names, short enough to block abuse
// (log-flooding, oversized payloads used as a denial-of-service vector).
export const MAX_QUERY_LENGTH = 120;

export const searchQuerySchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(MAX_QUERY_LENGTH, "That search is too long.")
  // Strips characters with no legitimate use in a product name, closing off
  // markup/script injection attempts without rejecting real-world queries
  // (accented letters, currency symbols, apostrophes, etc. all pass through).
  .transform((value) => value.replace(/[<>$`]/g, ""));

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, "Invalid product identifier.");

export function parseSearchQuery(input: unknown) {
  return searchQuerySchema.safeParse(input);
}

export function parseSlug(input: unknown) {
  return slugSchema.safeParse(input);
}
