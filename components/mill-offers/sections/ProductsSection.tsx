"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Checkbox } from "@/components/forms/Checkbox";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect, PackagingSelect, UnitSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { MillOfferProductRow } from "@/lib/types/millOffer";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface ProductsSectionProps {
  rows: MillOfferProductRow[];
  onChange: (rows: MillOfferProductRow[]) => void;
  error?: string;
  readOnly?: boolean;
}

function emptyRow(): MillOfferProductRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    product: "",
    grade: "M-30",
    packaging: "",
    availableQuantity: 0,
    unit: "mt",
    basePrice: 0,
    gstIncluded: true,
  };
}

/** Products section — one or more product rows, each independently Master-Data driven (Product/Packaging/Unit selects). */
export function ProductsSection({ rows, onChange, error, readOnly = false }: ProductsSectionProps) {
  function updateRow(id: string, patch: Partial<MillOfferProductRow>) {
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
        <h2 className="font-display text-lg font-medium text-charcoal">Products</h2>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus size={14} /> Add product
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-sm border border-line p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint">Row {i + 1}</p>
              {!readOnly && rows.length > 1 && (
                <IconButton variant="ghost" size="sm" aria-label={`Remove row ${i + 1}`} onClick={() => removeRow(row.id)}>
                  <Trash2 size={14} />
                </IconButton>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ProductSelect
                label="Product"
                defaultValue={row.product}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { product: e.target.value })}
              />
              <Select
                label="Sugar Grade"
                defaultValue={row.grade}
                disabled={readOnly}
                options={GRADE_OPTIONS}
                onChange={(e) => updateRow(row.id, { grade: e.target.value as MillOfferProductRow["grade"] })}
              />
              <PackagingSelect
                label="Packaging"
                defaultValue={row.packaging}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { packaging: e.target.value })}
              />
              <NumberInput
                label="Available Quantity"
                value={row.availableQuantity || ""}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { availableQuantity: Number(e.target.value) || 0 })}
              />
              <UnitSelect
                label="Unit"
                defaultValue={row.unit}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { unit: e.target.value })}
              />
              <NumberInput
                label="Base Price"
                unit="₹"
                value={row.basePrice || ""}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { basePrice: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="mt-4">
              <Checkbox
                label="GST included"
                checked={row.gstIncluded}
                disabled={readOnly}
                onChange={(e) => updateRow(row.id, { gstIncluded: e.target.checked })}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-danger">{error}</p>}
    </div>
  );
}
