import { PRODUCTS } from "@/lib/master-data/products";
import { UNITS } from "@/lib/master-data/units";
import { PACKAGING } from "@/lib/master-data/packaging";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { STATES } from "@/lib/master-data/states";

/**
 * Marketplace label resolvers — every place a listing renders a stored
 * master-data value (e.g. offer.product === "m30") as a human label goes
 * through one of these, instead of each component writing its own
 * `PRODUCTS.find(p => p.value === x)?.label`.
 */

export function getProductLabel(value: string): string {
  return PRODUCTS.find((p) => p.value === value)?.label ?? value;
}

export function getUnitLabel(value: string): string {
  return UNITS.find((u) => u.value === value)?.label ?? value;
}

export function getPackagingLabel(value: string): string {
  return PACKAGING.find((p) => p.value === value)?.label ?? value;
}

export function getPaymentTermLabel(value: string): string {
  return PAYMENT_TERMS.find((p) => p.value === value)?.label ?? value;
}

export function getDispatchTermLabel(value: string): string {
  return DISPATCH_TERMS.find((d) => d.value === value)?.label ?? value;
}

export function getMasterStateLabel(value: string): string {
  return STATES.find((s) => s.value === value)?.label ?? value;
}
