-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Merchant" AS ENUM ('AMAZON_IN', 'FLIPKART', 'MYNTRA');

-- CreateEnum
CREATE TYPE "ReviewSentiment" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageGb" INTEGER,
    "colorName" TEXT,
    "sizeLabel" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantListing" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "merchant" "Merchant" NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "isMocked" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "priceInPaise" INTEGER NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingSnapshot" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RatingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSource" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "sentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiReviewSummary" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "likes" TEXT[],
    "complaints" TEXT[],
    "verdict" TEXT,
    "bestFor" TEXT,
    "thinkTwiceIf" TEXT,
    "insufficientData" BOOLEAN NOT NULL DEFAULT false,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" TEXT NOT NULL,
    "queryText" TEXT NOT NULL,
    "matchedSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_canonicalName_idx" ON "Product"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_slug_key" ON "ProductVariant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_storageGb_colorName_sizeLabel_key" ON "ProductVariant"("productId", "storageGb", "colorName", "sizeLabel");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantListing_variantId_merchant_key" ON "MerchantListing"("variantId", "merchant");

-- CreateIndex
CREATE INDEX "PriceSnapshot_listingId_fetchedAt_idx" ON "PriceSnapshot"("listingId", "fetchedAt");

-- CreateIndex
CREATE INDEX "RatingSnapshot_listingId_fetchedAt_idx" ON "RatingSnapshot"("listingId", "fetchedAt");

-- CreateIndex
CREATE INDEX "ReviewSource_listingId_idx" ON "ReviewSource"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "AiReviewSummary_variantId_key" ON "AiReviewSummary"("variantId");

-- CreateIndex
CREATE INDEX "SearchQuery_createdAt_idx" ON "SearchQuery"("createdAt");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantListing" ADD CONSTRAINT "MerchantListing_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MerchantListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingSnapshot" ADD CONSTRAINT "RatingSnapshot_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MerchantListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSource" ADD CONSTRAINT "ReviewSource_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MerchantListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiReviewSummary" ADD CONSTRAINT "AiReviewSummary_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

