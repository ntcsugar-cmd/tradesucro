"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, CheckCircle2, Calculator, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { traderPurchaseService } from "@/services/traderPurchase.service";
import { computePurchaseFinancials } from "@/lib/types/traderWorkspace";
import { formatINR, formatPricePerUnit } from "@/lib/utils/format";
import type { PurchaseDraft, PurchaseSource } from "@/lib/types/traderWorkspace";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const SOURCE_OPTIONS: { value: PurchaseSource; label: string }[] = [
  { value: "mill_offer", label: "Mill Offer" },
  { value: "tender_award", label: "Tender Award" },
  { value: "direct_purchase", label: "Direct Purchase" },
  { value: "marketplace_offer", label: "Marketplace Offer" },
];

function emptyDraft(): PurchaseDraft {
  return {
    purchaseDate: new Date().toISOString().slice(0, 10),
    source: "direct_purchase",
    supplier: "",
    mill: "",
    broker: "",
    grade: "M-30",
    product: "",
    quantity: 0,
    unit: "mt",
    rate: 0,
    taxes: 0,
    freight: 0,
    insurance: 0,
    brokerage: 0,
    expectedSellingPrice: 0,
  };
}

/** SummaryRow — a compact key/value line for the sticky cost & margin sidebar. */
function SummaryRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className={`font-mono text-[13px] ${muted ? "text-ink-soft" : "text-charcoal"}`}>{value}</span>
    </div>
  );
}

export function PurchaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PurchaseDraft>(emptyDraft());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "confirm" | null>(null);

  useEffect(() => {
    const mill = searchParams.get("mill");
    const grade = searchParams.get("grade");
    const quantity = searchParams.get("quantity");
    const rate = searchParams.get("rate");
    if (mill || grade || quantity || rate) {
      setData((prev) => ({
        ...prev,
        mill: mill ?? prev.mill,
        supplier: mill ?? prev.supplier,
        grade: (grade as PurchaseDraft["grade"]) ?? prev.grade,
        quantity: quantity ? Number(quantity) : prev.quantity,
        rate: rate ? Number(rate) : prev.rate,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof PurchaseDraft>(key: K, value: PurchaseDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const { totalCost, expectedMargin } = computePurchaseFinancials(data);
  const marginPositive = expectedMargin >= 0;
  const landedRate = data.quantity > 0 ? totalCost / data.quantity : 0;

  function validate(): boolean {
    if (!data.mill || !data.supplier) {
      setError("Enter both a Mill and a Supplier.");
      return false;
    }
    if (!data.product || !data.quantity || !data.rate) {
      setError("Select a product and enter quantity and rate.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSave(status: "draft" | "confirmed") {
    if (status === "confirmed" && !validate()) return;
    setSaving(status === "draft" ? "draft" : "confirm");
    const purchase = await traderPurchaseService.createPurchase(data, status);
    setSaving(null);
    router.push(`/trader/purchases/${purchase.id}`);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2">
        <Card padding="lg">
          <CardBody>
            {error && (
              <Alert variant="danger" className="mb-6">
                {error}
              </Alert>
            )}

            <div className="space-y-8">
              <div>
                <h2 className="font-display text-lg font-medium text-charcoal">Purchase Source</h2>
                <div className="mt-5">
                  <Select label="Source" defaultValue={data.source} options={SOURCE_OPTIONS} onChange={(e) => set("source", e.target.value as PurchaseSource)} />
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-medium text-charcoal">Purchase Details</h2>
                <div className="mt-5 grid sm:grid-cols-2 gap-5">
                  <TextInput label="Purchase Date" type="date" value={data.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
                  <TextInput label="Supplier" value={data.supplier} onChange={(e) => set("supplier", e.target.value)} />
                  <TextInput label="Mill" value={data.mill} onChange={(e) => set("mill", e.target.value)} />
                  <TextInput label="Broker" helperText="Optional" value={data.broker} onChange={(e) => set("broker", e.target.value)} />

                  <ProductSelect label="Product" defaultValue={data.product} onChange={(e) => set("product", e.target.value)} />
                  <Select label="Sugar Grade" defaultValue={data.grade} options={GRADE_OPTIONS} onChange={(e) => set("grade", e.target.value as PurchaseDraft["grade"])} />

                  <NumberInput label="Quantity" unit="MT" value={data.quantity || ""} onChange={(e) => set("quantity", Number(e.target.value) || 0)} />
                  <NumberInput label="Rate" unit="₹" value={data.rate || ""} onChange={(e) => set("rate", Number(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-medium text-charcoal">Costs</h2>
                <div className="mt-5 grid sm:grid-cols-2 gap-5">
                  <NumberInput label="Taxes" unit="₹" value={data.taxes || ""} onChange={(e) => set("taxes", Number(e.target.value) || 0)} />
                  <NumberInput label="Freight" unit="₹" value={data.freight || ""} onChange={(e) => set("freight", Number(e.target.value) || 0)} />
                  <NumberInput label="Insurance" unit="₹" value={data.insurance || ""} onChange={(e) => set("insurance", Number(e.target.value) || 0)} />
                  <NumberInput label="Brokerage" unit="₹" value={data.brokerage || ""} onChange={(e) => set("brokerage", Number(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-medium text-charcoal">Margin Projection</h2>
                <div className="mt-5">
                  <NumberInput label="Expected Selling Price" unit="₹" value={data.expectedSellingPrice || ""} onChange={(e) => set("expectedSellingPrice", Number(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-end gap-3">
              <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
                <Save size={15} /> Save Draft
              </Button>
              <Button variant="primary" size="md" loading={saving === "confirm"} onClick={() => handleSave("confirmed")}>
                <CheckCircle2 size={15} /> Confirm Purchase &amp; Create Deal
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sticky live cost & margin summary — mirrors the same computePurchaseFinancials() output shown inline in the form before this refinement, just surfaced as a persistent sidebar instead of a single card at the bottom. */}
      <div className="lg:sticky lg:top-24">
        <Card padding="lg" className={marginPositive ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
          <CardBody>
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-4">
              <Calculator size={12} /> Live Summary
            </p>

            <SummaryRow label="Quantity" value={data.quantity ? `${data.quantity} MT` : "—"} muted />
            <SummaryRow label="Rate" value={formatINR(data.rate)} muted />
            <SummaryRow label="Base Value" value={formatINR(data.quantity * data.rate)} muted />

            <div className="my-3 border-t border-line" />

            <SummaryRow label="Taxes" value={formatINR(data.taxes)} muted />
            <SummaryRow label="Freight" value={formatINR(data.freight)} muted />
            <SummaryRow label="Insurance" value={formatINR(data.insurance)} muted />
            <SummaryRow label="Brokerage" value={formatINR(data.brokerage)} muted />

            <div className="my-3 border-t border-line" />

            <div className="flex items-center justify-between py-1.5">
              <span className="text-[13px] font-medium text-charcoal">Total Cost</span>
              <span className="font-mono text-[15px] font-semibold text-charcoal">{formatINR(totalCost)}</span>
            </div>
            <SummaryRow label="Landed Rate / QTL" value={formatPricePerUnit(landedRate)} />

            <div className={`mt-5 rounded-sm border p-4 ${marginPositive ? "border-rise/30 bg-rise/[0.05]" : "border-fall/30 bg-fall/[0.05]"}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Expected Margin</p>
                {marginPositive ? <ArrowUpRight size={14} className="text-rise" /> : <ArrowDownRight size={14} className="text-fall" />}
              </div>
              <p className={`font-mono text-2xl mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>{formatINR(expectedMargin)}</p>
              <p className="text-[11px] text-ink-faint mt-1">
                at expected sell of {data.expectedSellingPrice ? formatPricePerUnit(data.expectedSellingPrice) : "—"}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
