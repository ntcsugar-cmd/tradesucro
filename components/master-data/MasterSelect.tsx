"use client";

import { SelectHTMLAttributes } from "react";
import { Select, type SelectOption } from "@/components/forms/Select";
import { useMasterData } from "@/hooks/useMasterData";

export interface MasterSelectProps<T> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  /** The masterDataService function (or a closure around one, e.g. for CitySelect's per-state fetch) to call. */
  fetcher: () => Promise<T[]>;
  /** Extra values the fetcher closes over — re-fetches when these change (see CitySelect). */
  deps?: unknown[];
  /** Maps a master data record to a dropdown option. Defaults to assuming T already has value/label. */
  getOption?: (item: T) => SelectOption;
}

/**
 * MasterSelect — the shared implementation behind every reusable
 * <ProductSelect />, <StateSelect />, <MillSelect />, etc. It wraps the
 * existing design-system Select (components/forms/Select.tsx, untouched)
 * and sources its options from masterDataService via useMasterData,
 * rather than any component hardcoding a dropdown list.
 */
export function MasterSelect<T>({
  fetcher,
  deps = [],
  getOption,
  placeholder,
  ...selectProps
}: MasterSelectProps<T>) {
  const { data, loading } = useMasterData(fetcher, deps);

  const options: SelectOption[] = getOption
    ? data.map(getOption)
    : (data as unknown as SelectOption[]);

  return (
    <Select
      {...selectProps}
      placeholder={loading ? "Loading…" : placeholder}
      options={options}
      disabled={loading || selectProps.disabled}
    />
  );
}
