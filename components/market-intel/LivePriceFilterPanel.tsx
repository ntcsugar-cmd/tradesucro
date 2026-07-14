"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { StateSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { LivePriceFilters } from "@/lib/types/marketIntelligence";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const SORT_OPTIONS: { value: NonNullable<LivePriceFilters["sort"]>; label: string }[] = [
  { value: "latest", label: "Latest Updated" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
];

interface LivePriceFilterPanelProps {
  onApply: (filters: LivePriceFilters) => void;
}

export function LivePriceFilterPanel({ onApply }: LivePriceFilterPanelProps) {
  const [draft, setDraft] = useState<LivePriceFilters>({ sort: "latest" });
  const [resetKey, setResetKey] = useState(0);

  function set<K extends keyof LivePriceFilters>(key: K, value: LivePriceFilters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    const cleared: LivePriceFilters = { sort: "latest" };
    setDraft(cleared);
    setResetKey((k) => k + 1);
    onApply(cleared);
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold text-charcoal">Filters</p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw size={13} /> Clear
          </Button>
        </div>

        <div key={resetKey} className="space-y-4">
          <StateSelect label="State" size="sm" onChange={(e) => set("state", e.target.value || undefined)} />
          <Select label="Grade" size="sm" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => set("grade", (e.target.value || undefined) as LivePriceFilters["grade"])} />

          <div>
            <p className="text-[13px] font-medium text-charcoal mb-1.5">Price Range (₹)</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput size="sm" placeholder="Min" onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)} />
              <NumberInput size="sm" placeholder="Max" onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </div>

          <Select label="Sort By" size="sm" defaultValue="latest" options={SORT_OPTIONS} onChange={(e) => set("sort", e.target.value as LivePriceFilters["sort"])} />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
