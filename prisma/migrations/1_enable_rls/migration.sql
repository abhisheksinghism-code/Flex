-- Block the Supabase anon/public REST API from every table. Prisma connects
-- as the database owner and is unaffected by RLS.
ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MerchantListing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PriceSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."RatingSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ReviewSource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AiReviewSummary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SearchQuery" ENABLE ROW LEVEL SECURITY;
