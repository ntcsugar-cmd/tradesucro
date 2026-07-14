"use client";

import { Select } from "@/components/forms/Select";
import type { SortOption } from "@/lib/types/marketplace";

/**
 * These are display-ordering options, not business reference data —
 * they don't belong in Master Data (which this module doesn't touch).
 */
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
  { value: "quantity", label: "Quantity" },
  { value: "dispatch-date", label: "Dispatch Date" },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="w-44 shrink-0">
      <Select
        size="sm"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        options={SORT_OPTIONS}
      />
    </div>
  );
}
