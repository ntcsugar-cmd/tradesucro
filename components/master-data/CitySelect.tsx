"use client";

import { useCallback } from "react";
import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { CityOption } from "@/types/master-data";

interface CitySelectProps extends Omit<MasterSelectProps<CityOption>, "fetcher" | "getOption" | "deps"> {
  /** State code (from StateSelect) to load cities for. Empty until a state is chosen. */
  state: string;
}

/**
 * CitySelect — cities for a given state, sourced from
 * masterDataService.getCities(state). Disabled with a helper prompt
 * until a state is selected; re-fetches whenever `state` changes.
 */
export function CitySelect({ state, ...props }: CitySelectProps) {
  const fetcher = useCallback(() => masterDataService.getCities(state), [state]);

  if (!state) {
    return (
      <MasterSelect
        {...props}
        fetcher={async () => []}
        placeholder="Select a state first"
        disabled
      />
    );
  }

  return <MasterSelect {...props} fetcher={fetcher} deps={[state]} placeholder={props.placeholder ?? "Select a city"} />;
}
