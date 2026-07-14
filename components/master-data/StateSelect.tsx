"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { StateOption } from "@/types/master-data";

type StateSelectProps = Omit<MasterSelectProps<StateOption>, "fetcher" | "getOption">;

/** StateSelect — all 28 states + 8 union territories, sourced from masterDataService.getStates(). */
export function StateSelect(props: StateSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getStates} placeholder={props.placeholder ?? "Select a state"} />;
}
