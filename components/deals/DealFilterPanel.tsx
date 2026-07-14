"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { dealService } from "@/services/deal.service";
import { dealStatusLabel } from "./DealStatusBadge";
import type { DealFilters, DealStatus } from "@/lib/types/deal";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const ALL_STATUSES: DealStatus[] = [
  "inquiry", "negotiation", "offer_accepted", "deal_confirmed", "emd_pending", "emd_received",
  "purchase_order", "payment_pending", "payment_received", "dispatch_scheduled", "loading",
  "in_transit", "delivered", "closed", "cancelled",
];
const STATUS_OPTIONS = ALL_STATUSES.map((s) => ({ value: s, label: dealStatusLabel(s) }));

interface DealFilterPanelProps {
  onApply: (filters: DealFilters) => void;
}

export function DealFilterPanel({ onApply }: DealFilterPanelProps) {
  const [draft, setDraft] = useState<DealFilters>({});
  const [resetKey, setResetKey] = useState(0);
  const [parties, setParties] = useState<{ mills: string[]; buyers: string[]; traders: string[]; brokers: string[] }>({ mills: [], buyers: [], traders: [], brokers: [] });

  useEffect(() => {
    setParties(dealService.getPartyOptions());
  }, []);

  function set<K extends keyof DealFilters>(key: K, value: DealFilters[K]) {
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
          <p className="text-[13px] font-semibold text-charcoal">Filters</p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw size={13} /> Clear
          </Button>
        </div>

        <div key={resetKey} className="space-y-4">
          <Select label="Mill" size="sm" placeholder="Any mill" options={parties.mills.map((m) => ({ value: m, label: m }))} onChange={(e) => set("mill", e.target.value || undefined)} />
          <Select label="Buyer" size="sm" placeholder="Any buyer" options={parties.buyers.map((b) => ({ value: b, label: b }))} onChange={(e) => set("buyer", e.target.value || undefined)} />
          <Select label="Trader" size="sm" placeholder="Any trader" options={parties.traders.map((t) => ({ value: t, label: t }))} onChange={(e) => set("trader", e.target.value || undefined)} />
          <Select label="Broker" size="sm" placeholder="Any broker" options={parties.brokers.map((b) => ({ value: b, label: b }))} onChange={(e) => set("broker", e.target.value || undefined)} />
          <Select label="Grade" size="sm" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => set("grade", (e.target.value || undefined) as DealFilters["grade"])} />
          <Select label="Status" size="sm" placeholder="Any status" options={STATUS_OPTIONS} onChange={(e) => set("status", (e.target.value || undefined) as DealStatus)} />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
