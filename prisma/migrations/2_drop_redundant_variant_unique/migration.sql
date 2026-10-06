-- Redundant with the "slug" unique constraint, which already encodes
-- productId+storage+color+size. Two separate unique constraints on the same
-- insert meant a concurrent upsert could collide on this one, which the
-- upsert's ON CONFLICT(slug) target didn't catch, causing a crash under
-- concurrent requests for the same product.
DROP INDEX "ProductVariant_productId_storageGb_colorName_sizeLabel_key";
