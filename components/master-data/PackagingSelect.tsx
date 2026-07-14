"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { PackagingOption } from "@/types/master-data";

type PackagingSelectProps = Omit<MasterSelectProps<PackagingOption>, "fetcher" | "getOption">;

/** PackagingSelect — packaging type dropdown, sourced from masterDataService.getPackaging(). */
export function PackagingSelect(props: PackagingSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getPackaging} placeholder={props.placeholder ?? "Select packaging"} />;
}
