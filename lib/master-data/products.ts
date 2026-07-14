import type { Product } from "@/types/master-data";

/**
 * Product master list — the sugar PRODUCT category (what kind of sugar),
 * as distinct from GRADE (lib/types/marketplace.ts QUALITY_GRADES — the
 * crystal-size/ICUMSA grade within a product). Every offer/requirement
 * carries both a Product and a Grade as separate fields; this file is
 * the single source of truth for Product everywhere in the app.
 */
export const PRODUCTS: Product[] = [
  { value: "cane-sugar", label: "Cane Sugar", category: "cane" },
  { value: "refined-sugar", label: "Refined Sugar", category: "refined" },
  { value: "pharma-sugar", label: "Pharma Sugar", category: "pharma" },
  { value: "packing-sugar", label: "Packing Sugar", category: "packing" },
  { value: "raw-sugar", label: "Raw Sugar", category: "raw" },
  { value: "imported-sugar", label: "Imported Sugar", category: "imported" },
  { value: "beet-sugar", label: "Beet Sugar", category: "beet" },
];
