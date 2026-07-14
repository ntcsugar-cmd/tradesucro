"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { TenderInfoSection } from "./sections/TenderInfoSection";
import { TenderProductsSection } from "./sections/TenderProductsSection";
import { BidConditionsSection } from "./sections/BidConditionsSection";
import { PaymentDispatchSection } from "./sections/PaymentDispatchSection";
import { TenderDocumentsSection } from "./sections/TenderDocumentsSection";

import { millTenderService } from "@/services/millTender.service";
import type { MillTender, MillTenderDraft } from "@/lib/types/millTender";

const EMPTY_DRAFT: MillTenderDraft = {
  title: "",
  type: "open",
  tenderDate: new Date().toISOString().slice(0, 10),
  openingDateTime: "",
  closingDateTime: "",
  awardDate: "",
  products: [
    {
      id: `tp-${Date.now()}`,
      grade: "M-30",
      product: "",
      packaging: "",
      quantity: 0,
      unit: "mt",
      minimumBidPrice: 0,
      reservePrice: 0,
      emdRequired: false,
      emdAmount: 0,
      liftingSchedule: "",
    },
  ],
  bidConditions: {
    minimumQuantity: 0,
    maximumQuantity: 0,
    bidIncrement: 5,
    bidRevisionAllowed: false,
    numberOfRevisions: 0,
    autoExtension: false,
    visibility: "public",
  },
  paymentTerms: {
    advancePercent: 0,
    balancePercent: 100,
    paymentDue: "",
    creditDays: 0,
    emdNotes: "",
    bankDetailsSummary: "",
  },
  dispatchTerms: {
    dispatchStart: "",
    dispatchEnd: "",
    loadingCapacity: 0,
    dailyDispatchLimit: 0,
    deliveryTerms: "",
  },
  documents: {
    tenderNotice: { fileName: null, uploadedAt: null },
    termsAndConditions: { fileName: null, uploadedAt: null },
    qualityCertificate: { fileName: null, uploadedAt: null },
    labReport: { fileName: null, uploadedAt: null },
    otherDocuments: [],
  },
};

function toDraft(tender: MillTender): MillTenderDraft {
  const { id: _id, tenderNumber: _tn, status: _s, createdBy: _cb, createdAt: _ca, updatedAt: _ua, ...draft } = tender;
  return draft;
}

interface TenderFormProps {
  mode: "create" | "edit";
  initialTender?: MillTender;
}

/** Business Rule: only Draft tenders may be edited — once Published, the form renders read-only. */
export function TenderForm({ mode, initialTender }: TenderFormProps) {
  const router = useRouter();
  const [data, setData] = useState<MillTenderDraft>(initialTender ? toDraft(initialTender) : EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  const readOnly = mode === "edit" && initialTender !== undefined && initialTender.status !== "draft";

  function patch<K extends keyof MillTenderDraft>(key: K, value: MillTenderDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    if (!data.title || !data.closingDateTime) {
      setError("Enter a tender title and closing date & time.");
      return false;
    }
    if (data.products.some((p) => !p.product || !p.quantity || !p.reservePrice)) {
      setError("Every product row needs a product, quantity, and reserve price.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSave(status: "draft" | "published") {
    if (status === "published" && !validate()) return;
    setSaving(status === "draft" ? "draft" : "publish");

    if (mode === "create") {
      const result = await millTenderService.createTender(data, status);
      setSaving(null);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(`/mill/tenders/${result.data!.id}`);
    } else if (initialTender) {
      await millTenderService.updateTender(initialTender.id, data);
      if (status === "published") {
        const result = await millTenderService.publishTender(initialTender.id);
        setSaving(null);
        if (!result.success) {
          setError(result.message);
          return;
        }
      } else {
        setSaving(null);
      }
      router.push(`/mill/tenders/${initialTender.id}`);
    }
  }

  return (
    <Card padding="lg">
      <CardBody>
        {readOnly && (
          <Alert variant="info" className="mb-6">
            This tender is {initialTender?.status} and is read-only. Only Draft tenders can be edited.
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="space-y-10">
          <TenderInfoSection
            tenderNumber={initialTender?.tenderNumber}
            status={initialTender?.status ?? "draft"}
            title={data.title}
            type={data.type}
            tenderDate={data.tenderDate}
            openingDateTime={data.openingDateTime}
            closingDateTime={data.closingDateTime}
            awardDate={data.awardDate}
            onChange={(p) => setData((prev) => ({ ...prev, ...p }))}
            readOnly={readOnly}
          />

          <TenderProductsSection rows={data.products} onChange={(rows) => patch("products", rows)} readOnly={readOnly} />

          <BidConditionsSection data={data.bidConditions} onChange={(p) => patch("bidConditions", { ...data.bidConditions, ...p })} readOnly={readOnly} />

          <PaymentDispatchSection
            payment={data.paymentTerms}
            dispatch={data.dispatchTerms}
            onChangePayment={(p) => patch("paymentTerms", { ...data.paymentTerms, ...p })}
            onChangeDispatch={(p) => patch("dispatchTerms", { ...data.dispatchTerms, ...p })}
            readOnly={readOnly}
          />

          <TenderDocumentsSection data={data.documents} onChange={(p) => patch("documents", { ...data.documents, ...p })} readOnly={readOnly} />
        </div>

        {!readOnly && (
          <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
              <Save size={15} /> Save Draft
            </Button>
            <Button variant="primary" size="md" loading={saving === "publish"} onClick={() => handleSave("published")}>
              <Send size={15} /> Publish Tender
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
