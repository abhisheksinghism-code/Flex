import { Footprints, Headphones, Shirt, Smartphone, Package } from "lucide-react";

const ICON_BY_CATEGORY: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  footwear: Footprints,
  jeans: Shirt,
  headphones: Headphones,
};

/** A generic category glyph — Flex has no product photos, so this stands in
 * for one rather than showing a fake/stock image. */
export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = ICON_BY_CATEGORY[category] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}
