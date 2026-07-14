"use client";

import { FormEvent, useState } from "react";
import { SearchInput } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";

interface MarketplaceSearchBarProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

/** MarketplaceSearchBar — searches company name, product, grade, state, and city (see marketplaceService's matchesFilters). */
export function MarketplaceSearchBar({ defaultValue = "", onSearch, placeholder }: MarketplaceSearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
      <div className="flex-1">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? "Search by company, product, grade, state, or city…"}
        />
      </div>
      <Button type="submit" variant="primary" size="md">
        Search
      </Button>
    </form>
  );
}
