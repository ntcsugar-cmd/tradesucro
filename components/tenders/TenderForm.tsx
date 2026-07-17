"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, UnitSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { tenderService } from "@/services/tender.service";
import type { TenderDraft } from "@/lib/types/tender";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

const INITIAL: TenderDraft = {
  product: "",
  grade: "M-30",
  quantity: 0,
  unit: "mt",
  reservePrice: 0,
  emdAmount: 0,
  bidDeadline: "",
};

export function TenderForm() {
  const router = useRouter();
  const [data, setData] = useState<TenderDraft>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  function set<K extends keyof TenderDraft>(key: K, value: TenderDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    if (!data.product || !data.quantity || !data.reservePrice || !data.bidDeadline) {
      setError("Fill in product, quantity, reserve price, and bid deadline.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSave(status: "draft" | "published") {
    if (status === "published" && !validate()) return;
    setSaving(status === "draft" ? "draft" : "publish");
    const result = await tenderService.createTender(data, status);
    setSaving(null);

    if (!result.success) {
      setError(result.message);
      return;
    }
    router.push(`/tenders/${result.data!.id}`);
  }

  return (
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
            <Select label="Grade" defaultValue={data.grade} options={GRADE_OPTIONS} onChange={(e) => set("grade", e.target.value as TenderDraft["grade"])} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput label="Quantity" unit="MT" onChange={(e) => set("quantity", Number(e.target.value) || 0)} />
            <UnitSelect label="Unit" defaultValue={data.unit} onChange={(e) => set("unit", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput label="Reserve Price" unit="₹" onChange={(e) => set("reservePrice", Number(e.target.value) || 0)} />
            <NumberInput label="EMD Amount" unit="₹" onChange={(e) => set("emdAmount", Number(e.target.value) || 0)} />
          </div>

          <TextInput label="Bid Deadline" type="date" value={data.bidDeadline} onChange={(e) => set("bidDeadline", e.target.value)} />
        </div>

        <div className="mt-8 pt-6 border-t border-line dark:border-white/10 flex flex-wrap items-center justify-end gap-3">
          <Button variant="ghost" size="md" loading={saving === "draft"} onClick={() => handleSave("draft")}>
            <Save size={15} /> Save Draft
          </Button>
          <Button variant="primary" size="md" loading={saving === "publish"} onClick={() => handleSave("published")}>
            <Send size={15} /> Publish Tender
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
