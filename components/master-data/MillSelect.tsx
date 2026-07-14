"use client";

import { useCallback } from "react";
import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { Mill } from "@/types/master-data";
import type { SelectOption } from "@/components/forms/Select";

interface MillSelectProps extends Omit<MasterSelectProps<Mill>, "fetcher" | "getOption" | "deps"> {
  /** Optional state code to filter mills by (masterDataService.getMillsByState). Omit to list all 50. */
  state?: string;
}

const millToOption = (mill: Mill): SelectOption => ({
  value: mill.id,
  label: `${mill.name} — ${mill.city}`,
});

/** MillSelect — the 50-mill master list, optionally filtered by state. */
export function MillSelect({ state, ...props }: MillSelectProps) {
  const fetcher = useCallback(
    () => (state ? masterDataService.getMillsByState(state) : masterDataService.getMills()),
    [state]
  );

  return (
    <MasterSelect
      {...props}
      fetcher={fetcher}
      deps={[state]}
      getOption={millToOption}
      placeholder={props.placeholder ?? "Select a mill"}
    />
  );
}
