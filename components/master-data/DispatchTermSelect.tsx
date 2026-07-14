"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { DispatchTermOption } from "@/types/master-data";

type DispatchTermSelectProps = Omit<MasterSelectProps<DispatchTermOption>, "fetcher" | "getOption">;

/** DispatchTermSelect — dispatch terms dropdown, sourced from masterDataService.getDispatchTerms(). */
export function DispatchTermSelect(props: DispatchTermSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getDispatchTerms} placeholder={props.placeholder ?? "Select dispatch term"} />;
}
