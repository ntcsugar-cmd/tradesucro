"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Send } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/forms/Textarea";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, UnitSelect, StateSelect, CitySelect, PaymentTermSelect, MultiMillPicker } from "@/components/master-data";

import { marketplaceService } from "@/services/marketplace.service";
import { getProductLabel, getMasterStateLabel, getUnitLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit } from "@/lib/utils/format";
import { QUALITY_GRADES, type QualityGrade, type RequirementDraft } from "@/lib/types/marketplace";
import { SEASON_OPTIONS, DEFAULT_SEASON, type Season } from "@/lib/master-data/seasons";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface FormState {
  product: string;
  grade: QualityGrade | "";
  season: Season;
  preferredMillIds: string[];
  quantity: string;
  unit: string;
  state: string;
  city: string;
  expectedPrice: string;
  paymentTerms: string;
  deliverBy: string;
  remarks: string;
}

const INITIAL: FormState = {
  product: "",
  grade: "",
  season: DEFAULT_SEASON,
  preferredMillIds: [],
  quantity: "",
  unit: "mt",
  state: "",
  city: "",
  expectedPrice: "",
  paymentTerms: "",
  deliverBy: "",
  remarks: "",
};

/** RequirementForm — the Post Buy Requirement page's form. Save Draft / Preview / Publish, no backend. */
export function RequirementForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    if (!form.product || !form.grade || !form.quantity || !form.state || !form.city || !form.expectedPrice) {
      setError("Fill in product, grade, quantity, destination, and expected price before continuing.");
      return false;
    }
    setError(null);
    return true;
  }

  function toDraft(): RequirementDraft {
    return {
      product: form.product,
      grade: form.grade as QualityGrade,
      preferredMillIds: form.preferredMillIds,
      season: form.season,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      destination: { state: form.state, city: form.city },
      expectedPrice: Number(form.expectedPrice) || 0,
      paymentTerms: form.paymentTerms,
      deliverBy: form.deliverBy,
      remarks: form.remarks,
    };
  }

  async function handleSave(status: "draft" | "active") {
    if (status === "active" && !validate()) return;
    setSaving(status === "draft" ? "draft" : "publish");
    const requirement = await marketplaceService.createRequirement(toDraft(), status);
    setSaving(null);
    router.push(status === "active" ? `/marketplace/requirement/${requirement.id}` : "/marketplace/requirements");
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

            <MultiMillPicker value={form.preferredMillIds} onChange={(millIds) => set("preferredMillIds", millIds)} />

            <div className="grid sm:grid-cols-2 gap-5">
              <NumberInput label="Required quantity" unit="MT" placeholder="300" onChange={(e) => set("quantity", e.target.value)} />
              <UnitSelect label="Unit" defaultValue={form.unit} onChange={(e) => set("unit", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <StateSelect label="Destination state" onChange={(e) => { set("state", e.target.value); set("city", ""); }} />
              <CitySelect label="Destination city" state={form.state} onChange={(e) => set("city", e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <NumberInput label="Expected price" unit="₹/QTL" placeholder="3750" onChange={(e) => set("expectedPrice", e.target.value)} />
              <PaymentTermSelect label="Payment terms" onChange={(e) => set("paymentTerms", e.target.value)} />
            </div>

            <TextInput label="Delivery required by" type="date" value={form.deliverBy} onChange={(e) => set("deliverBy", e.target.value)} />

            <Textarea label="Remarks" placeholder="Any additional details for sellers…" rows={3} value={form.remarks} onChange={(e) => set("remarks", e.target.value)} />
          </div>

          <div className="mt-8 pt-6 border-t border-line dark:border-white/10 flex flex-wrap items-center justify-end gap-3">
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

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview buy requirement" size="lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-charcoal dark:text-white">{getProductLabel(form.product)} · {form.grade} · {form.season}</p>
            <p className="text-xs text-ink-faint dark:text-white/40 mt-1">
              {form.preferredMillIds.length === 0 ? "Open to All Mills" : `Routed to ${form.preferredMillIds.length} selected mill(s)`}
            </p>
            <p className="font-mono text-lg text-gold-dim">{formatPricePerUnit(Number(form.expectedPrice) || 0)}</p>
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] pt-3 border-t border-line dark:border-white/10">
            <div className="flex justify-between"><dt className="text-ink-faint dark:text-white/40">Quantity</dt><dd className="text-charcoal dark:text-white">{form.quantity || "—"} {getUnitLabel(form.unit)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint dark:text-white/40">Destination</dt><dd className="text-charcoal dark:text-white">{form.city}, {getMasterStateLabel(form.state)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint dark:text-white/40">Payment terms</dt><dd className="text-charcoal dark:text-white">{form.paymentTerms ? getPaymentTermLabel(form.paymentTerms) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint dark:text-white/40">Delivery by</dt><dd className="text-charcoal dark:text-white">{form.deliverBy || "—"}</dd></div>
          </dl>
          {form.remarks && <p className="text-[13px] text-ink-soft dark:text-white/50 pt-3 border-t border-line dark:border-white/10">{form.remarks}</p>}
        </div>
      </Modal>
    </>
  );
}
