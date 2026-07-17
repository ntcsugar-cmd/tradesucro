"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Checkbox } from "@/components/forms/Checkbox";
import { Alert } from "@/components/ui/Alert";
import { productMasterService } from "@/services/productMaster.service";
import type { MasterGrade, MasterGradeDraft, GradeMarketClassification, MasterProduct } from "@/lib/types/masterDataAdmin";

const CLASSIFICATION_OPTIONS: { value: GradeMarketClassification; label: string }[] = [
  { value: "both", label: "Domestic & Export" },
  { value: "domestic", label: "Domestic Only" },
  { value: "export", label: "Export Only" },
];

interface GradeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: MasterGradeDraft) => Promise<void>;
  editing: MasterGrade | null;
}

export function GradeFormModal({ open, onClose, onSubmit, editing }: GradeFormModalProps) {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [classification, setClassification] = useState<GradeMarketClassification>("both");
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    productMasterService.getActive().then(setProducts);
  }, []);

  useEffect(() => {
    if (open) {
      setCode(editing?.code ?? "");
      setDisplayName(editing?.displayName ?? "");
      setClassification(editing?.classification ?? "both");
      setApplicableProducts(editing?.applicableProducts ?? []);
      setError("");
    }
  }, [open, editing]);

  function toggleProduct(code: string) {
    setApplicableProducts((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  async function handleSubmit() {
    if (!code.trim()) {
      setError("Grade code is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ code, displayName: displayName || code, applicableProducts, classification });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit Grade" : "Add Grade"} size="md">
      <div className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput label="Grade Code" placeholder="e.g. M1-30" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
          <TextInput label="Display Name (optional)" placeholder="Defaults to the code" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <Select
          label="Market Classification"
          defaultValue={classification}
          options={CLASSIFICATION_OPTIONS}
          onChange={(e) => setClassification(e.target.value as GradeMarketClassification)}
        />

        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-2">Applicable Products</p>
          <p className="text-xs text-ink-faint dark:text-white/40 mb-3">Leave all unchecked to make this grade available for every product.</p>
          <div className="grid sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {products.map((p) => (
              <Checkbox key={p.id} label={p.displayName} checked={applicableProducts.includes(p.code)} onChange={() => toggleProduct(p.code)} />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
            {editing ? "Save Changes" : "Add Grade"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
