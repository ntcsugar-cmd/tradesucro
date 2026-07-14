"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { PaymentTermSelect, DispatchTermSelect } from "@/components/master-data";
import { InventoryLotPicker } from "./InventoryLotPicker";
import { SmartAllocationPanel } from "./SmartAllocationPanel";
import { traderResaleService } from "@/services/traderResale.service";
import { computeResaleEconomics } from "@/lib/types/traderResale";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { InventoryLot, ResaleOfferDraft } from "@/lib/types/traderResale";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="font-mono text-[13px] text-charcoal">{value}</span>
    </div>
  );
}

export function ResaleOfferForm() {
  const router = useRouter();
  const [lot, setLot] = useState<InventoryLot | null>(null);
  const [targetQuantity, setTargetQuantity] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [offeredQuantity, setOfferedQuantity] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [dispatchTerms, setDispatchTerms] = useState("");
  const [validTill, setValidTill] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  const { expectedProfit, expectedMarginPercent } = lot
    ? computeResaleEconomics({ sellingPrice, averageCost: lot.averageCost, offeredQuantity })
    : { expectedProfit: 0, expectedMarginPercent: 0 };
  const marginPositive = expectedMarginPercent >= 0;

  function handleSelectLot(selected: InventoryLot) {
    setLot(selected);
    if (!offeredQuantity) setOfferedQuantity(selected.availableQuantity);
    if (!sellingPrice) setSellingPrice(Math.round(selected.averageCost * 1.08));
  }

  function fail(message: string): false {
    setError(message);
    return false;
  }

  function validate(): boolean {
    if (!lot) return fail("Select an inventory lot to sell from.");
    if (!sellingPrice || !offeredQuantity) return fail("Enter a selling price and quantity.");
    if (offeredQuantity > lot.availableQuantity) return fail(`Only ${formatQuantityMt(lot.availableQuantity)} available in this lot.`);
    setError(null);
    return true;
  }

  async function handleSave(status: "draft" | "active") {
    if (status === "active" && !validate()) return;
    if (!lot) {
      fail("Select an inventory lot to sell from.");
      return;
    }

    setSaving(status === "draft" ? "draft" : "publish");
    const draft: ResaleOfferDraft = {
      purchaseId: lot.purchaseId,
      lotNumber: lot.lotNumber,
      grade: lot.grade,
      product: lot.product,
      warehouse: lot.warehouse,
      purchaseRate: lot.purchaseRate,
      averageCost: lot.averageCost,
      sellingPrice,
      offeredQuantity,
      unit: "mt",
      paymentTerms,
      dispatchTerms,
      validTill,
      remarks,
    };
    const result = await traderResaleService.createResaleOffer(draft, status);
    setSaving(null);
    if (!result.success) {
      setError(result.message);
      return;
    }
    router.push(`/trader/resale/${result.data!.id}`);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="font-display text-lg font-medium text-charcoal mb-4">Select Inventory Lot</h2>

          <div className="mb-5 max-w-xs">
            <NumberInput
              label="Quantity Needed (optional — for smart suggestions)"
              unit="MT"
              value={targetQuantity || ""}
              onChange={(e) => setTargetQuantity(Number(e.target.value) || 0)}
            />
          </div>

          {targetQuantity > 0 && (
            <div className="mb-6">
              <SmartAllocationPanel requiredQuantity={targetQuantity} onSelectLot={handleSelectLot} />
            </div>
          )}

          <InventoryLotPicker selectedPurchaseId={lot?.purchaseId ?? ""} onSelect={handleSelectLot} />
        </div>

        <Card padding="lg">
          <CardBody>
            {error && (
              <Alert variant="danger" className="mb-6">
                {error}
              </Alert>
            )}

            {lot && (
              <div className="mb-6 rounded-sm border border-line bg-charcoal/[0.02] p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Lot Details (Auto-filled)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
                  <div>
                    <p className="text-ink-faint text-xs">Available Qty</p>
                    <p className="font-mono text-charcoal mt-0.5">{formatQuantityMt(lot.availableQuantity)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint text-xs">Purchase Rate</p>
                    <p className="font-mono text-charcoal mt-0.5">{formatINR(lot.purchaseRate)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint text-xs">Average Cost</p>
                    <p className="font-mono text-charcoal mt-0.5">{formatINR(lot.averageCost)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint text-xs">Grade</p>
                    <p className="font-mono text-charcoal mt-0.5">{getProductLabel(lot.product)} · {lot.grade}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <NumberInput label="Selling Price" unit="₹" value={sellingPrice || ""} onChange={(e) => setSellingPrice(Number(e.target.value) || 0)} />
                <NumberInput label="Available Quantity" unit="MT" value={offeredQuantity || ""} onChange={(e) => setOfferedQuantity(Number(e.target.value) || 0)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <PaymentTermSelect label="Payment Terms" onChange={(e) => setPaymentTerms(e.target.value)} />
                <DispatchTermSelect label="Dispatch Terms" onChange={(e) => setDispatchTerms(e.target.value)} />
              </div>

              <TextInput label="Offer Validity" type="date" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
              <Textarea label="Remarks" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-end gap-3">
              <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
                <Save size={15} /> Save Draft
              </Button>
              <Button variant="primary" size="md" loading={saving === "publish"} onClick={() => handleSave("active")}>
                <Send size={15} /> Publish Offer
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24">
        <Card padding="lg" className={marginPositive ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-4">Economics</p>

            <SummaryRow label="Selling Price" value={formatINR(sellingPrice)} />
            <SummaryRow label="Average Cost" value={formatINR(lot?.averageCost ?? 0)} />
            <SummaryRow label="Quantity" value={formatQuantityMt(offeredQuantity)} />

            <div className="my-3 border-t border-line" />

            <div className={`rounded-sm border p-4 ${marginPositive ? "border-rise/30 bg-rise/[0.05]" : "border-fall/30 bg-fall/[0.05]"}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Expected Profit</p>
                {marginPositive ? <TrendingUp size={14} className="text-rise" /> : <TrendingDown size={14} className="text-fall" />}
              </div>
              <p className={`font-mono text-2xl mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>{formatINR(expectedProfit)}</p>
              <p className="text-[11px] text-ink-faint mt-1">{expectedMarginPercent.toFixed(1)}% expected margin</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
