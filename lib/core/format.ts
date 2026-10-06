import type { MerchantId } from "@/lib/core/types";

export const MERCHANT_DISPLAY_NAMES: Record<MerchantId, string> = {
  amazon_in: "Amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
};

export const MERCHANT_ORDER: MerchantId[] = ["amazon_in", "flipkart", "myntra"];

export function formatInr(priceInPaise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInPaise / 100);
}
