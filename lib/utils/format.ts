/**
 * Formatting utilities — the single implementation for every number,
 * currency, and quantity string rendered in the app. Previously each
 * component called `value.toLocaleString("en-IN")` (and, for prices,
 * hand-prefixed a "₹") independently; consolidating here means the
 * locale/currency/unit convention only has to be decided once.
 */

import type { PriceUnit } from "@/lib/master-data/priceUnits";
import { DEFAULT_PRICE_UNIT } from "@/lib/master-data/priceUnits";

const INR_LOCALE = "en-IN";

/** Plain grouped number, Indian numbering system (e.g. 12,40,000). */
export function formatNumber(value: number): string {
  return value.toLocaleString(INR_LOCALE);
}

/** Rupee-prefixed price (e.g. ₹3,842). */
export function formatINR(value: number): string {
  return `₹${formatNumber(value)}`;
}

/**
 * Rupee price with its trading unit suffix (e.g. ₹3,842/QTL). The
 * Indian sugar market quotes prices per Quintal by default — this is
 * the single place that convention lives, so every price display in
 * the app stays consistent and unit-aware. Pass a different `unit`
 * (from a Price Unit selector) to display the same underlying price
 * converted into MT or KG instead.
 */
export function formatPricePerUnit(value: number, unit: PriceUnit = DEFAULT_PRICE_UNIT): string {
  return `₹${formatNumber(Math.round(value))}/${unit}`;
}

/** Quantity in metric tonnes (e.g. 1,200 MT). */
export function formatQuantityMt(value: number): string {
  return `${formatNumber(value)} MT`;
}

/** Percentage change, always with one decimal and no sign (e.g. 1.2%). Pair with PriceDelta's own up/down icon for sign context. */
export function formatPercent(value: number): string {
  return `${Math.abs(value).toFixed(1)}%`;
}

/**
 * Compact Indian currency (e.g. ₹91.6 Lakh, ₹2.3 Cr). Large rupee
 * figures (Inventory Value, Today's Profit) overflow fixed-width
 * dashboard cards when shown as a full grouped number — this is the
 * fix, applied at the formatting layer so every card that needs it
 * calls one function rather than each hand-rolling its own threshold
 * logic. Values under 1 Lakh are shown in full (compacting a 4-digit
 * number reads as evasive, not concise).
 */
export function formatCompactINR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(abs >= 10_00_00_000 ? 0 : 1)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(abs >= 10_00_000 ? 0 : 1)} Lakh`;
  return formatINR(value);
}
