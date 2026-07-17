"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/forms/Checkbox";
import { TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, StateSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { MILL_OFFER_STATUS_OPTIONS } from "@/lib/types/millOffer";
import type { MillOfferFilters } from "@/lib/types/millOffer";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface OfferFilterPanelProps {
  onApply: (filters: MillOfferFilters) => void;
}

export function OfferFilterPanel({ onApply }: OfferFilterPanelProps) {
  const [draft, setDraft] = useState<MillOfferFilters>({});
  const [resetKey, setResetKey] = useState(0);

  function set<K extends keyof MillOfferFilters>(key: K, value: MillOfferFilters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setDraft({});
    setResetKey((k) => k + 1);
    onApply({});
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
          <StateSelect label="State" size="sm" onChange={(e) => set("state", e.target.value || undefined)} />
          <ProductSelect label="Product" size="sm" onChange={(e) => set("product", e.target.value || undefined)} />
          <Select
            label="Grade"
            size="sm"
            placeholder="Any grade"
            options={GRADE_OPTIONS}
            onChange={(e) => set("grade", (e.target.value || undefined) as MillOfferFilters["grade"])}
          />
          <Select
            label="Offer Status"
            size="sm"
            placeholder="Any status"
            options={MILL_OFFER_STATUS_OPTIONS}
            onChange={(e) => set("status", (e.target.value || undefined) as MillOfferFilters["status"])}
          />
          <TextInput
            label="Offer date from"
            type="date"
            size="sm"
            onChange={(e) => set("dateFrom", e.target.value || undefined)}
          />
          <TextInput
            label="Offer date to"
            type="date"
            size="sm"
            onChange={(e) => set("dateTo", e.target.value || undefined)}
          />
          <Checkbox
            label="EMD required"
            checked={!!draft.emdRequired}
            onChange={(e) => set("emdRequired", e.target.checked || undefined)}
          />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
