"use client";

import { useEffect, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { traderPurchaseService } from "@/services/traderPurchase.service";
import type { PurchaseFilters, PurchaseStatus } from "@/lib/types/traderWorkspace";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const STATUS_OPTIONS: { value: PurchaseStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "confirmed", label: "Confirmed" },
  { value: "deal_created", label: "Deal Created" },
  { value: "cancelled", label: "Cancelled" },
];

interface PurchaseFilterPanelProps {
  onApply: (filters: PurchaseFilters) => void;
}

export function PurchaseFilterPanel({ onApply }: PurchaseFilterPanelProps) {
  const [draft, setDraft] = useState<PurchaseFilters>({});
  const [resetKey, setResetKey] = useState(0);
  const [parties, setParties] = useState<{ suppliers: string[]; mills: string[]; brokers: string[] }>({ suppliers: [], mills: [], brokers: [] });

  useEffect(() => {
    setParties(traderPurchaseService.getPartyOptions());
  }, []);

  function set<K extends keyof PurchaseFilters>(key: K, value: PurchaseFilters[K]) {
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
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-charcoal">
            <SlidersHorizontal size={13} className="text-ink-faint" /> Filters
          </p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw size={13} /> Clear
          </Button>
        </div>

        <div key={resetKey} className="space-y-4">
          <Select label="Supplier" size="sm" placeholder="Any supplier" options={parties.suppliers.map((s) => ({ value: s, label: s }))} onChange={(e) => set("supplier", e.target.value || undefined)} />
          <Select label="Mill" size="sm" placeholder="Any mill" options={parties.mills.map((m) => ({ value: m, label: m }))} onChange={(e) => set("mill", e.target.value || undefined)} />
          <Select label="Broker" size="sm" placeholder="Any broker" options={parties.brokers.map((b) => ({ value: b, label: b }))} onChange={(e) => set("broker", e.target.value || undefined)} />
          <Select label="Grade" size="sm" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => set("grade", (e.target.value || undefined) as PurchaseFilters["grade"])} />
          <Select label="Status" size="sm" placeholder="Any status" options={STATUS_OPTIONS} onChange={(e) => set("status", (e.target.value || undefined) as PurchaseStatus)} />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
