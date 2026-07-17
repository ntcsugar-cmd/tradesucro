"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Send, Ban, Copy } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

import { OfferInformationSection } from "./sections/OfferInformationSection";
import { MillInformationSection } from "./sections/MillInformationSection";
import { ProductsSection } from "./sections/ProductsSection";
import { PaymentTermsSection } from "./sections/PaymentTermsSection";
import { DispatchSection } from "./sections/DispatchSection";
import { ConditionsSection } from "./sections/ConditionsSection";
import { AttachmentsSection } from "./sections/AttachmentsSection";
import { OfferPreview } from "./OfferPreview";

import { millOfferService } from "@/services/millOffer.service";
import { toMillOfferDraft } from "@/lib/utils/millOfferDraft";
import { DEFAULT_SEASON } from "@/lib/master-data/seasons";
import type { MillOffer, MillOfferDraft } from "@/lib/types/millOffer";
import type { Mill } from "@/types/master-data";

const EMPTY_DRAFT: MillOfferDraft = {
  offerDate: new Date().toISOString().slice(0, 10),
  validTill: "",
  season: DEFAULT_SEASON,
  millId: "",
  millName: "",
  state: "",
  city: "",
  factoryCode: "",
  products: [
    {
      id: `row-${Date.now()}`,
      product: "",
      grade: "M-30",
      packaging: "",
      availableQuantity: 0,
      unit: "mt",
      basePrice: 0,
      gstIncluded: true,
    },
  ],
  paymentTerms: {
    paymentType: "",
    advancePercent: 0,
    balancePayment: "",
    paymentDueDate: "",
    creditDays: 0,
    emdRequired: false,
    emdAmount: 0,
    emdDueDate: "",
  },
  dispatch: {
    dispatchStartDate: "",
    dispatchEndDate: "",
    liftingPeriodDays: 0,
    minimumLiftingQuantity: 0,
    maximumDailyLifting: 0,
    dispatchTerms: "",
  },
  conditions: {
    specialTerms: "",
    qualityConditions: "",
    penaltyClause: "",
    cancellationPolicy: "",
    remarks: "",
  },
  attachments: {
    offerCircular: { fileName: null, uploadedAt: null },
    qualityCertificate: { fileName: null, uploadedAt: null },
    millLetter: { fileName: null, uploadedAt: null },
    otherDocuments: [],
  },
};

interface MillOfferFormProps {
  mode: "create" | "edit";
  initialOffer?: MillOffer;
}

export function MillOfferForm({ mode, initialOffer }: MillOfferFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<MillOfferDraft>(initialOffer ? toMillOfferDraft(initialOffer) : EMPTY_DRAFT);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | "withdraw" | "duplicate" | null>(null);

  /** Business Rule: Published offers become read-only. */
  const readOnly = mode === "edit" && initialOffer !== undefined && initialOffer.status !== "draft";

  function patch<K extends keyof MillOfferDraft>(key: K, value: MillOfferDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelectMill(mill: Mill, factoryCode: string) {
    setData((prev) => ({ ...prev, millId: mill.id, millName: mill.name, state: mill.state, city: mill.city, factoryCode }));
  }

  function fail(message: string): false {
    setError(message);
    return false;
  }

  /** Business Rule: Offer Valid Till cannot be before Offer Date. */
  function validate(): boolean {
    if (!data.millId) return fail("Select a sugar mill.");
    if (!data.offerDate || !data.validTill) return fail("Set both Offer Date and Offer Valid Till.");
    if (new Date(data.validTill) < new Date(data.offerDate)) return fail("Offer Valid Till cannot be before Offer Date.");
    if (data.products.some((p) => !p.product || !p.availableQuantity || !p.basePrice)) {
      return fail("Every product row needs a product, quantity, and price.");
    }
    if (data.paymentTerms.emdRequired && !data.paymentTerms.emdAmount) {
      return fail("EMD Amount is required when EMD is marked required.");
    }
    setError(null);
    return true;
  }

  async function handleSaveDraft() {
    setSaving("draft");
    if (mode === "create") {
      const offer = await millOfferService.createOffer(data, "draft");
      setSaving(null);
      toast({ variant: "success", title: "Draft saved", description: offer.offerNumber });
      router.push(`/mill-offers/${offer.id}/edit`);
    } else if (initialOffer) {
      await millOfferService.updateOffer(initialOffer.id, data, ["Draft updated"]);
      setSaving(null);
      toast({ variant: "success", title: "Draft saved" });
      router.refresh();
    }
  }

  async function handlePublish() {
    if (!validate()) return;
    setSaving("publish");
    if (mode === "create") {
      const offer = await millOfferService.createOffer(data, "published");
      setSaving(null);
      toast({ variant: "success", title: "Offer published", description: offer.offerNumber });
      router.push(`/mill-offers/${offer.id}`);
    } else if (initialOffer) {
      await millOfferService.updateOffer(initialOffer.id, data, ["Published"]);
      await millOfferService.publishOffer(initialOffer.id);
      setSaving(null);
      toast({ variant: "success", title: "Offer published" });
      router.push(`/mill-offers/${initialOffer.id}`);
    }
  }

  async function handleWithdraw() {
    if (!initialOffer) return;
    setSaving("withdraw");
    await millOfferService.withdrawOffer(initialOffer.id);
    setSaving(null);
    toast({ variant: "info", title: "Offer withdrawn" });
    router.push(`/mill-offers/${initialOffer.id}`);
  }

  async function handleDuplicate() {
    if (!initialOffer) return;
    setSaving("duplicate");
    const copy = await millOfferService.duplicateOffer(initialOffer.id);
    setSaving(null);
    if (copy) {
      toast({ variant: "success", title: "Offer duplicated", description: copy.offerNumber });
      router.push(`/mill-offers/${copy.id}/edit`);
    }
  }

  function handlePreview() {
    setPreviewOpen(true);
  }

  return (
    <>
      {readOnly && (
        <Alert variant="info" className="mb-6">
          This offer is {initialOffer?.status} and is read-only. Use Withdraw or Duplicate below to make changes.
        </Alert>
      )}

      <Card padding="lg">
        <CardBody>
          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="space-y-10">
            <OfferInformationSection
              offerNumber={initialOffer?.offerNumber}
              status={initialOffer?.status ?? "draft"}
              offerDate={data.offerDate}
              validTill={data.validTill}
              season={data.season}
              onChange={(p) => setData((prev) => ({ ...prev, ...p }))}
              readOnly={readOnly}
            />

            <MillInformationSection
              millId={data.millId}
              state={data.state}
              city={data.city}
              factoryCode={data.factoryCode}
              onSelectMill={handleSelectMill}
              readOnly={readOnly}
            />

            <ProductsSection rows={data.products} onChange={(rows) => patch("products", rows)} readOnly={readOnly} />

            <PaymentTermsSection data={data.paymentTerms} onChange={(p) => patch("paymentTerms", { ...data.paymentTerms, ...p })} readOnly={readOnly} />

            <DispatchSection data={data.dispatch} onChange={(p) => patch("dispatch", { ...data.dispatch, ...p })} readOnly={readOnly} />

            <ConditionsSection data={data.conditions} onChange={(p) => patch("conditions", { ...data.conditions, ...p })} readOnly={readOnly} />

            <AttachmentsSection data={data.attachments} onChange={(p) => patch("attachments", { ...data.attachments, ...p })} readOnly={readOnly} />
          </div>

          <div className="mt-8 pt-6 border-t border-line dark:border-white/10 flex flex-wrap items-center justify-end gap-3">
            {mode === "edit" && initialOffer?.status === "published" && (
              <Button variant="danger" size="md" loading={saving === "withdraw"} onClick={handleWithdraw}>
                <Ban size={15} /> Withdraw Offer
              </Button>
            )}
            {mode === "edit" && (
              <Button variant="outline" size="md" loading={saving === "duplicate"} onClick={handleDuplicate}>
                <Copy size={15} /> Duplicate Offer
              </Button>
            )}
            {!readOnly && (
              <>
                <Button variant="ghost" size="md" loading={saving === "draft"} onClick={handleSaveDraft}>
                  <Save size={15} /> Save Draft
                </Button>
                <Button variant="outline" size="md" onClick={handlePreview}>
                  <Eye size={15} /> Preview
                </Button>
                <Button variant="primary" size="md" loading={saving === "publish"} onClick={handlePublish}>
                  <Send size={15} /> Publish
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Offer Preview" size="lg">
        <OfferPreview data={data} offerNumber={initialOffer?.offerNumber} />
      </Modal>
    </>
  );
}
