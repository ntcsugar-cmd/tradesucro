"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Send } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { Checkbox } from "@/components/forms/Checkbox";
import { Textarea } from "@/components/forms/Textarea";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { FileUpload } from "@/components/forms/FileUpload";
import {
  ProductSelect,
  UnitSelect,
  PackagingSelect,
  StateSelect,
  CitySelect,
  MillSelect,
  PaymentTermSelect,
  DispatchTermSelect,
} from "@/components/master-data";

import { marketplaceService } from "@/services/marketplace.service";
import { getProductLabel, getMasterStateLabel, getUnitLabel, getPackagingLabel, getPaymentTermLabel, getDispatchTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit } from "@/lib/utils/format";
import { QUALITY_GRADES, type QualityGrade, type OfferDraft } from "@/lib/types/marketplace";
import { SEASON_OPTIONS, DEFAULT_SEASON, type Season } from "@/lib/master-data/seasons";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface FormState {
  product: string;
  grade: QualityGrade | "";
  season: Season;
  quantity: string;
  unit: string;
  packaging: string;
  price: string;
  gstIncluded: boolean;
  state: string;
  city: string;
  millId: string;
  readyStock: boolean;
  dispatchDate: string;
  paymentTerms: string;
  dispatchTerms: string;
  validity: string;
  remarks: string;
}

const INITIAL: FormState = {
  product: "",
  grade: "",
  season: DEFAULT_SEASON,
  quantity: "",
  unit: "mt",
  packaging: "",
  price: "",
  gstIncluded: true,
  state: "",
  city: "",
  millId: "",
  readyStock: true,
  dispatchDate: "",
  paymentTerms: "",
  dispatchTerms: "",
  validity: "",
  remarks: "",
};

/** OfferForm — the Post Sell Offer page's form. Save Draft / Preview / Publish, no backend. */
export function OfferForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [logo, setLogo] = useState<{ fileName: string | null; uploadedAt: string | null }>({ fileName: null, uploadedAt: null });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    if (!form.product || !form.grade || !form.quantity || !form.price || !form.state || !form.city || !form.dispatchDate) {
      setError("Fill in product, grade, quantity, price, dispatch location, and dispatch date before continuing.");
      return false;
    }
    setError(null);
    return true;
  }

  function toDraft(): OfferDraft {
    return {
      product: form.product,
      grade: form.grade as QualityGrade,
      season: form.season,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      packaging: form.packaging,
      price: Number(form.price) || 0,
      gstIncluded: form.gstIncluded,
      dispatchFrom: { state: form.state, city: form.city },
      millId: form.millId || null,
      readyStock: form.readyStock,
      dispatchDate: form.dispatchDate,
      paymentTerms: form.paymentTerms,
      dispatchTerms: form.dispatchTerms,
      validity: form.validity,
      remarks: form.remarks,
      images: logo.fileName ? [logo.fileName] : [],
    };
  }

  async function handleSave(status: "draft" | "active") {
    if (status === "active" && !validate()) return;
    setSaving(status === "draft" ? "draft" : "publish");
    const offer = await marketplaceService.createOffer(toDraft(), status);
    setSaving(null);
    router.push(status === "active" ? `/marketplace/offer/${offer.id}` : "/marketplace/offers");
  }

  function handlePreview() {
    if (!validate()) return;
    setPreviewOpen(true);
  }

  return (
    <>
      <Card padding="lg">
        <CardBody>
          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <ProductSelect label="Product" onChange={(e) => set("product", e.target.value)} />
              <Select label="Grade" placeholder="Select a grade" options={GRADE_OPTIONS} onChange={(e) => set("grade", e.target.value as QualityGrade)} />
              <Select label="Season" defaultValue={form.season} options={SEASON_OPTIONS} onChange={(e) => set("season", e.target.value as Season)} />
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <NumberInput label="Quantity" unit="MT" placeholder="500" onChange={(e) => set("quantity", e.target.value)} />
              <UnitSelect label="Unit" defaultValue={form.unit} onChange={(e) => set("unit", e.target.value)} />
              <PackagingSelect label="Packaging" onChange={(e) => set("packaging", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 items-end">
              <NumberInput label="Price" unit="₹/QTL" placeholder="3800" onChange={(e) => set("price", e.target.value)} />
              <Checkbox
                label="GST included"
                checked={form.gstIncluded}
                onChange={(e) => set("gstIncluded", e.target.checked)}
               
              />
            </div>

            <div className="pt-2 border-t border-line" />

            <div className="grid sm:grid-cols-2 gap-5">
              <StateSelect label="Dispatch from — State" onChange={(e) => { set("state", e.target.value); set("city", ""); }} />
              <CitySelect label="Dispatch from — City" state={form.state} onChange={(e) => set("city", e.target.value)} />
            </div>

            <MillSelect label="Sugar mill" helperText="Optional — link this offer to a specific mill" state={form.state} onChange={(e) => set("millId", e.target.value)} />

            <div className="grid sm:grid-cols-2 gap-5 items-end">
              <Checkbox label="Ready stock" checked={form.readyStock} onChange={(e) => set("readyStock", e.target.checked)} />
              <TextInput label="Dispatch date" type="date" value={form.dispatchDate} onChange={(e) => set("dispatchDate", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <PaymentTermSelect label="Payment terms" onChange={(e) => set("paymentTerms", e.target.value)} />
              <DispatchTermSelect label="Dispatch terms" onChange={(e) => set("dispatchTerms", e.target.value)} />
            </div>

            <TextInput label="Validity" type="date" helperText="How long this offer stays open" value={form.validity} onChange={(e) => set("validity", e.target.value)} />

            <Textarea label="Remarks" placeholder="Any additional details for buyers…" rows={3} value={form.remarks} onChange={(e) => set("remarks", e.target.value)} />

            <FileUpload label="Upload images" mockFileName="sugar_stock_photo.jpg" value={logo} onChange={setLogo} helperText="Placeholder only — no real upload" />
          </div>

          <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
              <Save size={15} /> Save Draft
            </Button>
            <Button variant="outline" size="md" onClick={handlePreview}>
              <Eye size={15} /> Preview
            </Button>
            <Button variant="primary" size="md" loading={saving === "publish"} onClick={() => handleSave("active")}>
              <Send size={15} /> Publish
            </Button>
          </div>
        </CardBody>
      </Card>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview sell offer" size="lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-charcoal">{getProductLabel(form.product)} · {form.grade} · {form.season}</p>
            <p className="font-mono text-lg text-gold-dim">{formatPricePerUnit(Number(form.price) || 0)}</p>
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] pt-3 border-t border-line">
            <div className="flex justify-between"><dt className="text-ink-faint">Quantity</dt><dd className="text-charcoal">{form.quantity || "—"} {getUnitLabel(form.unit)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Packaging</dt><dd className="text-charcoal">{form.packaging ? getPackagingLabel(form.packaging) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Dispatch from</dt><dd className="text-charcoal">{form.city}, {getMasterStateLabel(form.state)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Ready stock</dt><dd className="text-charcoal">{form.readyStock ? "Yes" : "No"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Dispatch date</dt><dd className="text-charcoal">{form.dispatchDate || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Payment terms</dt><dd className="text-charcoal">{form.paymentTerms ? getPaymentTermLabel(form.paymentTerms) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Dispatch terms</dt><dd className="text-charcoal">{form.dispatchTerms ? getDispatchTermLabel(form.dispatchTerms) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">GST</dt><dd className="text-charcoal">{form.gstIncluded ? "Included" : "Excluded"}</dd></div>
          </dl>
          {form.remarks && <p className="text-[13px] text-ink-soft pt-3 border-t border-line">{form.remarks}</p>}
        </div>
      </Modal>
    </>
  );
}
