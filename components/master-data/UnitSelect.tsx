"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { UnitOption } from "@/types/master-data";

type UnitSelectProps = Omit<MasterSelectProps<UnitOption>, "fetcher" | "getOption">;

/** UnitSelect — quantity unit dropdown, sourced from masterDataService.getUnits(). */
export function UnitSelect(props: UnitSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getUnits} placeholder={props.placeholder ?? "Select unit"} />;
}
