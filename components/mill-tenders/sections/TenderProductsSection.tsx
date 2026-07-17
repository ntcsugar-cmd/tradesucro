"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Checkbox } from "@/components/forms/Checkbox";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, PackagingSelect, UnitSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { TenderProductRow } from "@/lib/types/millTender";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface TenderProductsSectionProps {
  rows: TenderProductRow[];
  onChange: (rows: TenderProductRow[]) => void;
  readOnly?: boolean;
}

function emptyRow(): TenderProductRow {
  return {
    id: `tp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
  };
}

export function TenderProductsSection({ rows, onChange, readOnly = false }: TenderProductsSectionProps) {
  function updateRow(id: string, patch: Partial<TenderProductRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    onChange([...rows, emptyRow()]);
  }
  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Products</h2>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus size={14} /> Add product
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-sm border border-line dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40">Row {i + 1}</p>
              {!readOnly && rows.length > 1 && (
                <IconButton variant="ghost" size="sm" aria-label={`Remove row ${i + 1}`} onClick={() => removeRow(row.id)}>
                  <Trash2 size={14} />
                </IconButton>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ProductSelect label="Product" defaultValue={row.product} disabled={readOnly} onChange={(e) => updateRow(row.id, { product: e.target.value })} />
              <Select label="Sugar Grade" defaultValue={row.grade} disabled={readOnly} options={GRADE_OPTIONS} onChange={(e) => updateRow(row.id, { grade: e.target.value as TenderProductRow["grade"] })} />
              <PackagingSelect label="Packaging" defaultValue={row.packaging} disabled={readOnly} onChange={(e) => updateRow(row.id, { packaging: e.target.value })} />
              <NumberInput label="Quantity" value={row.quantity || ""} disabled={readOnly} onChange={(e) => updateRow(row.id, { quantity: Number(e.target.value) || 0 })} />
              <UnitSelect label="Unit" defaultValue={row.unit} disabled={readOnly} onChange={(e) => updateRow(row.id, { unit: e.target.value })} />
              <NumberInput label="Minimum Bid Price" unit="₹" value={row.minimumBidPrice || ""} disabled={readOnly} onChange={(e) => updateRow(row.id, { minimumBidPrice: Number(e.target.value) || 0 })} />
              <NumberInput label="Reserve Price" unit="₹" value={row.reservePrice || ""} disabled={readOnly} onChange={(e) => updateRow(row.id, { reservePrice: Number(e.target.value) || 0 })} />
              <TextInput label="Lifting Schedule" value={row.liftingSchedule} disabled={readOnly} onChange={(e) => updateRow(row.id, { liftingSchedule: e.target.value })} className="lg:col-span-2" />
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-5 items-end">
              <Checkbox label="EMD required" checked={row.emdRequired} disabled={readOnly} onChange={(e) => updateRow(row.id, { emdRequired: e.target.checked })} />
              {row.emdRequired && (
                <NumberInput label="EMD Amount" unit="₹" value={row.emdAmount || ""} disabled={readOnly} onChange={(e) => updateRow(row.id, { emdAmount: Number(e.target.value) || 0 })} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
