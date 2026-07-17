"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { DealInfoSection } from "./sections/DealInfoSection";
import { CommercialTermsSection } from "./sections/CommercialTermsSection";
import { DispatchSection } from "./sections/DispatchSection";
import { DealDocumentsSection } from "./sections/DealDocumentsSection";

import { dealService } from "@/services/deal.service";
import type { Deal, DealDraft } from "@/lib/types/deal";

const EMPTY_DRAFT: DealDraft = {
  dealDate: new Date().toISOString().slice(0, 10),
  originType: "direct_negotiation",
  originReference: "",
  mill: "",
  seller: "",
  buyer: "",
  broker: "",
  trader: "",
  grade: "M-30",
  product: "",
  quantity: 0,
  unit: "mt",
  rate: 0,
  currency: "inr",
  commercialTerms: {
    paymentType: "",
    advancePercent: 0,
    creditDays: 0,
    emdAmount: 0,
    balancePayment: "",
    brokerage: 0,
    commission: 0,
    gstPercent: 5,
    insurance: 0,
    freight: 0,
    loadingCharges: 0,
  },
  dispatch: {
    dispatchStart: "",
    dispatchEnd: "",
    dailyDispatchQuantity: 0,
    loadingPoint: "",
    destinationState: "",
    destinationCity: "",
    transporter: "",
    vehicleDetails: "",
    lrNumber: "",
    ewayBill: "",
    deliveryStatus: "pending",
  },
  documents: {
    purchaseOrder: { fileName: null, uploadedAt: null },
    saleConfirmation: { fileName: null, uploadedAt: null },
    invoice: { fileName: null, uploadedAt: null },
    taxInvoice: { fileName: null, uploadedAt: null },
    deliveryOrder: { fileName: null, uploadedAt: null },
    ewayBill: { fileName: null, uploadedAt: null },
    lrGr: { fileName: null, uploadedAt: null },
    paymentReceipt: { fileName: null, uploadedAt: null },
    qualityCertificate: { fileName: null, uploadedAt: null },
  },
};

function toDraft(deal: Deal): DealDraft {
  const {
    id: _id,
    dealNumber: _dn,
    status: _s,
    totalValue: _tv,
    createdBy: _cb,
    createdAt: _ca,
    updatedAt: _ua,
    ...draft
  } = deal;
  return draft;
}

interface DealFormProps {
  mode: "create" | "edit";
  initialDeal?: Deal;
}

/** Deals stay editable through most of their lifecycle (unlike Mill Offers/Tenders' draft-only rule) — only Closed and Cancelled deals lock, since a live trade routinely needs terms/dispatch amendments as it progresses. */
export function DealForm({ mode, initialDeal }: DealFormProps) {
  const router = useRouter();
  const [data, setData] = useState<DealDraft>(initialDeal ? toDraft(initialDeal) : EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const readOnly = mode === "edit" && initialDeal !== undefined && (initialDeal.status === "closed" || initialDeal.status === "cancelled");

  function patch<K extends keyof DealDraft>(key: K, value: DealDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    if (!data.mill || !data.buyer) {
      setError("Enter both a Mill and a Buyer.");
      return false;
    }
    if (!data.product || !data.quantity || !data.rate) {
      setError("Select a product and enter quantity and rate.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);

    if (mode === "create") {
      const result = await dealService.createDeal(data);
      setSaving(false);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(`/deals/${result.data!.id}`);
    } else if (initialDeal) {
      await dealService.updateDeal(initialDeal.id, data);
      setSaving(false);
      router.push(`/deals/${initialDeal.id}`);
    }
  }

  return (
    <Card padding="lg">
      <CardBody>
        {readOnly && (
          <Alert variant="info" className="mb-6">
            This deal is {initialDeal?.status} and is read-only.
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="space-y-10">
          <DealInfoSection
            dealNumber={initialDeal?.dealNumber}
            status={initialDeal?.status}
            dealDate={data.dealDate}
            originType={data.originType}
            originReference={data.originReference}
            mill={data.mill}
            seller={data.seller}
            buyer={data.buyer}
            broker={data.broker}
            trader={data.trader}
            grade={data.grade}
            product={data.product}
            quantity={data.quantity}
            rate={data.rate}
            currency={data.currency}
            onChange={(p) => setData((prev) => ({ ...prev, ...p }))}
            readOnly={readOnly}
          />

          <CommercialTermsSection
            data={data.commercialTerms}
            onChange={(p) => patch("commercialTerms", { ...data.commercialTerms, ...p })}
            readOnly={readOnly}
          />

          <DispatchSection data={data.dispatch} onChange={(p) => patch("dispatch", { ...data.dispatch, ...p })} readOnly={readOnly} />

          <DealDocumentsSection data={data.documents} onChange={(p) => patch("documents", { ...data.documents, ...p })} />
        </div>

        {!readOnly && (
          <div className="mt-8 pt-6 border-t border-line dark:border-white/10 flex items-center justify-end gap-3">
            <Button variant="primary" size="md" loading={saving} onClick={handleSave}>
              <Save size={15} /> {mode === "create" ? "Create Deal" : "Save Changes"}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
