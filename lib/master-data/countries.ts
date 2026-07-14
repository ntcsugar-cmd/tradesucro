import { COUNTRIES as EXISTING_COUNTRIES } from "@/lib/constants/countries";
import type { CountryOption } from "@/types/master-data";

/**
 * Master data scopes countries to India only (mills, warehouses, and
 * dispatch locations are domestic). Derived from the existing country
 * list (lib/constants/countries.ts, which also serves onboarding's
 * broader international address field) by filtering to India, rather
 * than hardcoding the string "India" again here.
 */
export const COUNTRIES: CountryOption[] = EXISTING_COUNTRIES.filter((c) => c.value === "india").map((c) => ({
  value: c.value,
  label: c.label,
}));
