import { MockAmazonProvider } from "@/lib/core/providers/amazon";
import { MockFlipkartProvider } from "@/lib/core/providers/flipkart";
import { MockMyntraProvider } from "@/lib/core/providers/myntra";
import type { MerchantProvider } from "@/lib/core/providers/types";

// Adding a platform later (Ajio, Croma, ...) means writing one more class
// that implements MerchantProvider and listing it here — nothing else in the
// app knows these are mocks.
export const MERCHANT_PROVIDERS: MerchantProvider[] = [
  new MockAmazonProvider(),
  new MockFlipkartProvider(),
  new MockMyntraProvider(),
];
