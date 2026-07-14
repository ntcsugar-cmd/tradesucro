/**
 * Price Unit master list + conversion — the Indian sugar market quotes
 * prices per Quintal (QTL) as a four-digit figure (e.g. ₹3,800/QTL),
 * not per Metric Tonne. QTL is the default and mandatory unit for every
 * price display; MT and KG are available via an explicit unit selector,
 * with automatic conversion so the same underlying value is always
 * shown correctly regardless of which unit is selected.
 *
 * Conversion facts (fixed, not configurable):
 *   1 MT = 10 QTL
 *   1 QTL = 100 KG
 *   therefore 1 MT = 1,000 KG
 */
export type PriceUnit = "QTL" | "MT" | "KG";

export const PRICE_UNITS: PriceUnit[] = ["QTL", "MT", "KG"];

export const DEFAULT_PRICE_UNIT: PriceUnit = "QTL";

export const PRICE_UNIT_OPTIONS = PRICE_UNITS.map((u) => ({ value: u, label: u }));

const QUINTALS_PER_UNIT: Record<PriceUnit, number> = {
  QTL: 1,
  MT: 10,
  KG: 0.01,
};

/** Converts a price quoted in `fromUnit` to its equivalent in `toUnit`. Price scales inversely to quantity-per-unit: a price per MT (10 QTL) is 10x a price per QTL. */
export function convertPrice(price: number, fromUnit: PriceUnit, toUnit: PriceUnit): number {
  if (fromUnit === toUnit) return price;
  const pricePerQuintal = price / QUINTALS_PER_UNIT[fromUnit];
  return pricePerQuintal * QUINTALS_PER_UNIT[toUnit];
}

/** Converts a physical quantity (e.g. stock, order size) from `fromUnit` to `toUnit` — the direct inverse relationship of convertPrice. */
export function convertQuantity(quantity: number, fromUnit: PriceUnit, toUnit: PriceUnit): number {
  if (fromUnit === toUnit) return quantity;
  const quantityInQuintals = quantity * QUINTALS_PER_UNIT[fromUnit];
  return quantityInQuintals / QUINTALS_PER_UNIT[toUnit];
}
