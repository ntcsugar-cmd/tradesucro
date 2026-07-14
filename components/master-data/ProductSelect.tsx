"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { Product } from "@/types/master-data";

type ProductSelectProps = Omit<MasterSelectProps<Product>, "fetcher" | "getOption">;

/** ProductSelect — sugar product/grade dropdown, sourced from masterDataService.getProducts(). */
export function ProductSelect(props: ProductSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getProducts} placeholder={props.placeholder ?? "Select a product"} />;
}
