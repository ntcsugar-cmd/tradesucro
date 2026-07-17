"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { NumberInput } from "@/components/forms/Input";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import { commercialDecisionService } from "@/services/commercialDecision.service";
import type { LandedCostInputs } from "@/lib/types/commercial";

const DEFAULT_INPUTS: LandedCostInputs = {
  exMillPrice: 3700,
  quantity: 100,
  freightPerUnit: 45,
  insurancePerUnit: 4,
  loadingChargesPerUnit: 15,
  brokeragePerUnit: 15,
  handlingChargesPerUnit: 10,
  taxesPerUnit: 0,
};

function LineRow({ label, value, isTotal = false }: { label: string; value: number; isTotal?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${isTotal ? "" : "border-b border-line dark:border-white/10"}`}>
      <span className={isTotal ? "text-[13.5px] font-semibold text-charcoal dark:text-white" : "text-[13px] text-ink-soft dark:text-white/50"}>{label}</span>
      <span className={`font-mono ${isTotal ? "text-[16px] font-semibold text-charcoal dark:text-white" : "text-[13.5px] text-charcoal dark:text-white"}`}>{formatINR(value)}</span>
    </div>
  );
}

export function LandedCostCalculator() {
  const [inputs, setInputs] = useState<LandedCostInputs>(DEFAULT_INPUTS);

  function set<K extends keyof LandedCostInputs>(key: K, value: LandedCostInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const breakdown = commercialDecisionService.calculateLandedCost(inputs);

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2">
        <Card padding="lg">
          <CardBody>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-5">
              <Calculator size={13} /> Landed Cost Inputs
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <NumberInput label="Ex-Mill Price" unit="₹/QTL" value={inputs.exMillPrice || ""} onChange={(e) => set("exMillPrice", Number(e.target.value) || 0)} />
              <NumberInput label="Quantity" unit="MT" value={inputs.quantity || ""} onChange={(e) => set("quantity", Number(e.target.value) || 0)} />
              <NumberInput label="Freight" unit="₹/QTL" value={inputs.freightPerUnit || ""} onChange={(e) => set("freightPerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Insurance" unit="₹/QTL" value={inputs.insurancePerUnit || ""} onChange={(e) => set("insurancePerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Loading Charges" unit="₹/QTL" value={inputs.loadingChargesPerUnit || ""} onChange={(e) => set("loadingChargesPerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Brokerage" unit="₹/QTL" value={inputs.brokeragePerUnit || ""} onChange={(e) => set("brokeragePerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Handling Charges" unit="₹/QTL" value={inputs.handlingChargesPerUnit || ""} onChange={(e) => set("handlingChargesPerUnit", Number(e.target.value) || 0)} />
              <NumberInput
                label="Taxes"
                unit="₹/QTL"
                helperText="Future-ready — GST Engine integration will auto-populate this"
                value={inputs.taxesPerUnit || ""}
                onChange={(e) => set("taxesPerUnit", Number(e.target.value) || 0)}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24">
        <Card padding="lg" className="ring-1 ring-gold/25">
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-4">Detailed Calculation</p>
            <LineRow label="Ex-Mill Price" value={breakdown.exMillPrice} />
            <LineRow label="+ Freight" value={breakdown.freightPerUnit} />
            <LineRow label="+ Insurance" value={breakdown.insurancePerUnit} />
            <LineRow label="+ Loading Charges" value={breakdown.loadingChargesPerUnit} />
            <LineRow label="+ Brokerage" value={breakdown.brokeragePerUnit} />
            <LineRow label="+ Handling Charges" value={breakdown.handlingChargesPerUnit} />
            <LineRow label="+ Taxes (Future)" value={breakdown.taxesPerUnit} />
            <div className="mt-2 pt-3 border-t-2 border-charcoal/10">
              <LineRow label="Total Landed Cost / MT" value={breakdown.totalLandedCostPerUnit} isTotal />
            </div>
            <div className="mt-4 rounded-sm border border-gold/25 bg-gold/[0.05] p-4">
              <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">Total for {formatQuantityMt(inputs.quantity)}</p>
              <p className="font-mono text-2xl text-gold-dim mt-1">{formatINR(breakdown.totalLandedCost)}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
