"use client";

import { useState } from "react";
import { PRICE_UNITS, DEFAULT_PRICE_UNIT, convertPrice, type PriceUnit } from "@/lib/master-data/priceUnits";
import { formatPricePerUnit } from "@/lib/utils/format";

interface PriceUnitToggleProps {
  /** The underlying price, always stored/passed in QTL — the app's canonical unit. */
  priceInQtl: number;
  /** Optional: lift the selected unit to the parent (e.g. to convert a whole table's column together). */
  onUnitChange?: (unit: PriceUnit) => void;
  className?: string;
}

/**
 * PriceUnitToggle — a small QTL / MT / KG segmented control paired with
 * the live-converted price. This is the single reusable implementation
 * for the Price Unit selector required on every trading screen —
 * conversion always runs through lib/master-data/priceUnits.ts's
 * convertPrice(), so every screen that adopts this component computes
 * the same numbers.
 */
export function PriceUnitToggle({ priceInQtl, onUnitChange, className = "" }: PriceUnitToggleProps) {
  const [unit, setUnit] = useState<PriceUnit>(DEFAULT_PRICE_UNIT);

  function handleSelect(next: PriceUnit) {
    setUnit(next);
    onUnitChange?.(next);
  }

  const displayPrice = convertPrice(priceInQtl, "QTL", unit);

  return (
    <div className={`inline-flex flex-col items-end gap-1.5 ${className}`}>
      <span className="font-mono text-lg text-gold-dim">{formatPricePerUnit(displayPrice, unit)}</span>
      <div className="inline-flex rounded-sm border border-line overflow-hidden">
        {PRICE_UNITS.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => handleSelect(u)}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              unit === u ? "bg-charcoal text-white" : "bg-white text-ink-faint hover:text-charcoal"
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}
