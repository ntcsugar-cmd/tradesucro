"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/forms/Select";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { PaymentTermSelect } from "@/components/master-data";
import { traderCustomerService } from "@/services/traderCustomer.service";
import { traderResaleService } from "@/services/traderResale.service";
import { computeOrderEconomics } from "@/lib/types/traderResale";
import { getProductLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { Customer, ResaleOffer, CustomerOrderDraft } from "@/lib/types/traderResale";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="font-mono text-[13px] text-charcoal">{value}</span>
    </div>
  );
}

export function CustomerOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [offers, setOffers] = useState<ResaleOffer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [resaleOfferId, setResaleOfferId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [freight, setFreight] = useState(0);
  const [brokerage, setBrokerage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "confirm" | null>(null);

  useEffect(() => {
    Promise.all([traderCustomerService.getCustomers(), traderResaleService.getResaleOffers({ status: "active" })]).then(([c, o]) => {
      setCustomers(c);
      setOffers(o);
      const preselect = searchParams.get("offer");
      if (preselect && o.some((offer) => offer.id === preselect)) setResaleOfferId(preselect);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOffer = offers.find((o) => o.id === resaleOfferId) ?? null;
  const sellingPrice = selectedOffer?.sellingPrice ?? 0;
  const averageCost = selectedOffer?.averageCost ?? 0;
  const { totalValue, grossMargin } = selectedOffer
    ? computeOrderEconomics({ quantity, sellingPrice, taxes, freight, brokerage, discount }, averageCost)
    : { totalValue: 0, grossMargin: 0 };
  const marginPositive = grossMargin >= 0;

  function fail(message: string): false {
    setError(message);
    return false;
  }

  function validate(): boolean {
    if (!customerId) return fail("Select a customer.");
    if (!selectedOffer) return fail("Select a resale offer.");
    if (!quantity) return fail("Enter a quantity.");
    setError(null);
    return true;
  }

  async function handleSave(status: "draft" | "confirmed") {
    if (status === "confirmed" && !validate()) return;
    if (!selectedOffer) {
      fail("Select a resale offer.");
      return;
    }

    setSaving(status === "draft" ? "draft" : "confirm");
    const draft: CustomerOrderDraft = {
      customerId,
      resaleOfferId,
      purchaseId: selectedOffer.purchaseId,
      quantity,
      unit: selectedOffer.unit,
      sellingPrice,
      taxes,
      freight,
      brokerage,
      discount,
      deliveryDate,
      paymentTerms,
    };
    const result = await traderResaleService.createOrder(draft, status);
    setSaving(null);
    if (!result.success) {
      setError(result.message);
      return;
    }
    router.push(`/trader/orders/${result.data!.id}`);
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

            <div className="space-y-5">
              <Select
                label="Customer"
                placeholder="Select a customer"
                options={customers.map((c) => ({ value: c.id, label: c.companyName }))}
                onChange={(e) => setCustomerId(e.target.value)}
              />

              <Select
                label="Resale Offer (Inventory Lot)"
                placeholder="Select an active resale offer"
                defaultValue={resaleOfferId}
                options={offers.map((o) => ({ value: o.id, label: `${o.offerNumber} — ${getProductLabel(o.product)} ${o.grade} (${formatPricePerUnit(o.sellingPrice)})` }))}
                onChange={(e) => setResaleOfferId(e.target.value)}
              />

              {selectedOffer && (
                <div className="rounded-sm border border-line bg-charcoal/[0.02] p-4 text-[13px] flex flex-wrap gap-x-8 gap-y-2">
                  <span className="text-ink-faint">Lot <span className="font-mono text-charcoal">{selectedOffer.lotNumber}</span></span>
                  <span className="text-ink-faint">Available <span className="font-mono text-charcoal">{formatQuantityMt(selectedOffer.offeredQuantity)}</span></span>
                  <span className="text-ink-faint">Selling Price <span className="font-mono text-charcoal">{formatINR(sellingPrice)}</span></span>
                </div>
              )}

              <NumberInput label="Quantity" unit="MT" value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value) || 0)} />

              <div className="grid sm:grid-cols-2 gap-5">
                <NumberInput label="Taxes" unit="₹" value={taxes || ""} onChange={(e) => setTaxes(Number(e.target.value) || 0)} />
                <NumberInput label="Freight" unit="₹" value={freight || ""} onChange={(e) => setFreight(Number(e.target.value) || 0)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <NumberInput label="Brokerage" unit="₹" value={brokerage || ""} onChange={(e) => setBrokerage(Number(e.target.value) || 0)} />
                <NumberInput label="Discount" unit="₹" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <TextInput label="Delivery Date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                <PaymentTermSelect label="Payment Terms" onChange={(e) => setPaymentTerms(e.target.value)} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-end gap-3">
              <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
                <Save size={15} /> Save Draft
              </Button>
              <Button variant="primary" size="md" loading={saving === "confirm"} onClick={() => handleSave("confirmed")}>
                <CheckCircle2 size={15} /> Confirm Order
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24">
        <Card padding="lg" className={marginPositive ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-4">Order Summary</p>
            <SummaryRow label="Quantity" value={formatQuantityMt(quantity)} />
            <SummaryRow label="Selling Price" value={formatINR(sellingPrice)} />
            <SummaryRow label="Taxes" value={formatINR(taxes)} />
            <SummaryRow label="Freight" value={formatINR(freight)} />
            <SummaryRow label="Brokerage" value={formatINR(brokerage)} />
            <SummaryRow label="Discount" value={`- ${formatINR(discount)}`} />
            <div className="my-3 border-t border-line" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[13px] font-medium text-charcoal">Total Value</span>
              <span className="font-mono text-[15px] font-semibold text-charcoal">{formatINR(totalValue)}</span>
            </div>
            <div className={`mt-4 rounded-sm border p-3.5 ${marginPositive ? "border-rise/30 bg-rise/[0.05]" : "border-fall/30 bg-fall/[0.05]"}`}>
              <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Gross Margin</p>
              <p className={`font-mono text-lg mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>{formatINR(grossMargin)}</p>
            </div>
            {paymentTerms && <p className="text-[11px] text-ink-faint mt-3">{getPaymentTermLabel(paymentTerms)}</p>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
