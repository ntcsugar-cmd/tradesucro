"use client";

import { useEffect, useState } from "react";
import { Scale, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Alert } from "@/components/ui/Alert";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { commercialDecisionService } from "@/services/commercialDecision.service";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import { computeParity, checkMarginThreshold } from "@/lib/types/commercial";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillOffer } from "@/lib/types/millOffer";
import type { ParityInputs } from "@/lib/types/commercial";

function StatRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className={`font-mono ${emphasis ? "text-[15px] font-semibold text-charcoal dark:text-white" : "text-[13.5px] text-charcoal dark:text-white"}`}>{value}</span>
    </div>
  );
}

export function ParityAnalysisView() {
  const [offers, setOffers] = useState<MillOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [marketAverage, setMarketAverage] = useState(0);
  const [inputs, setInputs] = useState<ParityInputs>({
    purchasePrice: 3700,
    currentMarketPrice: 3750,
    expectedSellingPrice: 3820,
    quantity: 100,
    freightPerUnit: 45,
    marketAverageFreightPerUnit: 45,
    otherCostsPerUnit: 30,
  });
  const [thresholdPercent, setThresholdPercent] = useState(8);

  useEffect(() => {
    Promise.all([commercialDecisionService.getOffersForPicker(), marketIntelligenceService.getDashboardStats()]).then(([o, stats]) => {
      setOffers(o);
      setMarketAverage(stats.averageIndiaPrice);
      setInputs((prev) => ({ ...prev, currentMarketPrice: stats.averageIndiaPrice }));
    });
  }, []);

  function handleSelectOffer(offerId: string) {
    setSelectedOfferId(offerId);
    const offer = offers.find((o) => o.id === offerId);
    const row = offer?.products[0];
    if (row) {
      setInputs((prev) => ({ ...prev, purchasePrice: row.basePrice, expectedSellingPrice: Math.round(row.basePrice * 1.08) }));
    }
  }

  function set<K extends keyof ParityInputs>(key: K, value: ParityInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const analysis = computeParity(inputs);
  const warning = checkMarginThreshold(analysis.marginPercent, thresholdPercent);
  const isProfit = analysis.profitOrLoss >= 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card padding="lg">
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-4">Reference Offer (optional)</p>
            <Select
              label="Mill Offer"
              placeholder="Select an offer to auto-fill purchase price"
              options={offers.map((o) => ({ value: o.id, label: `${o.millName} — ${getProductLabel(o.products[0]?.product ?? "")} (${formatINR(o.products[0]?.basePrice ?? 0)})` }))}
              defaultValue={selectedOfferId}
              onChange={(e) => handleSelectOffer(e.target.value)}
            />
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-5">Parity Inputs</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <NumberInput label="Purchase Price" unit="₹/QTL" value={inputs.purchasePrice || ""} onChange={(e) => set("purchasePrice", Number(e.target.value) || 0)} />
              <NumberInput label="Current Market Price" unit="₹/QTL" helperText={`India average: ${formatINR(marketAverage)}`} value={inputs.currentMarketPrice || ""} onChange={(e) => set("currentMarketPrice", Number(e.target.value) || 0)} />
              <NumberInput label="Expected Selling Price" unit="₹/QTL" value={inputs.expectedSellingPrice || ""} onChange={(e) => set("expectedSellingPrice", Number(e.target.value) || 0)} />
              <NumberInput label="Quantity" unit="MT" value={inputs.quantity || ""} onChange={(e) => set("quantity", Number(e.target.value) || 0)} />
              <NumberInput label="Freight" unit="₹/QTL" value={inputs.freightPerUnit || ""} onChange={(e) => set("freightPerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Market Avg. Freight" unit="₹/QTL" value={inputs.marketAverageFreightPerUnit || ""} onChange={(e) => set("marketAverageFreightPerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Other Costs" unit="₹/QTL" value={inputs.otherCostsPerUnit || ""} onChange={(e) => set("otherCostsPerUnit", Number(e.target.value) || 0)} />
              <NumberInput label="Margin Alert Threshold" unit="%" value={thresholdPercent || ""} onChange={(e) => setThresholdPercent(Number(e.target.value) || 0)} />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 space-y-4">
        {warning.belowThreshold && (
          <Alert variant="danger">
            <span className="flex items-center gap-2">
              <AlertTriangle size={14} /> Margin ({analysis.marginPercent.toFixed(1)}%) is below your {thresholdPercent}% threshold.
            </span>
          </Alert>
        )}

        <Card padding="lg" className={isProfit ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40">Parity Analysis</p>
              {isProfit ? <TrendingUp size={14} className="text-rise" /> : <TrendingDown size={14} className="text-fall" />}
            </div>

            <StatRow label="Purchase Price" value={formatINR(inputs.purchasePrice)} />
            <StatRow label="Current Market Price" value={formatINR(inputs.currentMarketPrice)} />
            <StatRow label="Expected Selling Price" value={formatINR(inputs.expectedSellingPrice)} />
            <StatRow label="Freight Difference" value={`${analysis.freightDifference >= 0 ? "+" : ""}${formatINR(analysis.freightDifference)}`} />
            <StatRow label="Gross Margin" value={formatINR(analysis.estimatedGrossMargin)} />
            <StatRow label="Net Margin" value={formatINR(analysis.estimatedNetMargin)} />
            <StatRow label="Margin %" value={`${analysis.marginPercent.toFixed(1)}%`} emphasis />

            <div className={`mt-4 rounded-sm border p-4 ${isProfit ? "border-rise/30 bg-rise/[0.05]" : "border-fall/30 bg-fall/[0.05]"}`}>
              <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">
                <Scale size={11} /> {isProfit ? "Profit" : "Loss"}
              </p>
              <p className={`font-mono text-2xl mt-1 ${isProfit ? "text-rise" : "text-fall"}`}>{formatINR(Math.abs(analysis.profitOrLoss))}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
