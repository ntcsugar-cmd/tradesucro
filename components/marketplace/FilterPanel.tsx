"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/forms/Checkbox";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, StateSelect, CitySelect, CompanyTypeSelect, MillSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { SEASON_OPTIONS } from "@/lib/master-data/seasons";
import type { MarketplaceFilters } from "@/lib/types/marketplace";

interface FilterPanelProps {
  onApply: (filters: MarketplaceFilters) => void;
}

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

const EMPTY_FILTERS: MarketplaceFilters = {};

/**
 * FilterPanel — used by both /marketplace/offers and /marketplace/requirements.
 * Owns its own draft state (Select fields here are uncontrolled, per the
 * existing Select component's design — see components/forms/Select.tsx)
 * and reports the resulting filter object up via onApply.
 */
export function FilterPanel({ onApply }: FilterPanelProps) {
  const [draft, setDraft] = useState<MarketplaceFilters>({});
  const [resetKey, setResetKey] = useState(0);

  function set<K extends keyof MarketplaceFilters>(key: K, value: MarketplaceFilters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
  }

  function handleClear() {
    setDraft({});
    setResetKey((k) => k + 1);
    onApply(EMPTY_FILTERS);
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold text-charcoal dark:text-white">Filters</p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw size={13} /> Clear
          </Button>
        </div>

        <div key={resetKey} className="space-y-4">
          <ProductSelect label="Product" size="sm" onChange={(e) => set("product", e.target.value || undefined)} />

          <Select
            label="Grade"
            size="sm"
            placeholder="Any grade"
            options={GRADE_OPTIONS}
            onChange={(e) => set("grade", (e.target.value || undefined) as MarketplaceFilters["grade"])}
          />

          <Select
            label="Season"
            size="sm"
            placeholder="Any season"
            options={SEASON_OPTIONS}
            onChange={(e) => set("season", (e.target.value || undefined) as MarketplaceFilters["season"])}
          />

          <MillSelect label="Sugar Mill" size="sm" placeholder="Any mill" onChange={(e) => set("millId", e.target.value || undefined)} />

          <StateSelect label="State" size="sm" onChange={(e) => set("state", e.target.value || undefined)} />

          <CitySelect
            label="City"
            size="sm"
            state={draft.state ?? ""}
            onChange={(e) => set("city", e.target.value || undefined)}
          />

          <div>
            <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Quantity (MT)</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                size="sm"
                placeholder="Min"
                onChange={(e) => set("minQuantity", e.target.value ? Number(e.target.value) : undefined)}
              />
              <NumberInput
                size="sm"
                placeholder="Max"
                onChange={(e) => set("maxQuantity", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Price range (₹)</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                size="sm"
                placeholder="Min"
                onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              />
              <NumberInput
                size="sm"
                placeholder="Max"
                onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <CompanyTypeSelect
            label="Company type"
            size="sm"
            onChange={(e) => set("companyType", e.target.value || undefined)}
          />

          <NumberInput
            label="Dispatch within (days)"
            size="sm"
            placeholder="e.g. 14"
            onChange={(e) => set("dispatchWithinDays", e.target.value ? Number(e.target.value) : undefined)}
          />

          <Checkbox
            label="Verified companies only"
            checked={!!draft.verifiedOnly}
            onChange={(e) => set("verifiedOnly", e.target.checked || undefined)}
          />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={handleApply}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
