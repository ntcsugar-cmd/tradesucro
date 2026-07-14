import { COMPANY_TYPES as EXISTING_COMPANY_TYPES } from "@/lib/constants/company-types";
import type { CompanyTypeOption } from "@/types/master-data";

/**
 * Company types — this is the exact same 8-type list already used by
 * onboarding (lib/constants/company-types.ts). Rather than redefine it
 * here, we derive from it, so there is exactly one array of company
 * types in the codebase and the two can't drift apart.
 */
export const COMPANY_TYPES: CompanyTypeOption[] = EXISTING_COMPANY_TYPES.map((c) => ({
  value: c.value,
  label: c.label,
  description: c.description,
}));
