import type { StateOption } from "@/types/master-data";

/**
 * All 28 states + 8 union territories. This is the complete master
 * reference for the new StateSelect/CitySelect/MillSelect components.
 *
 * Note: lib/constants/states.ts already has a *curated* shortlist of
 * sugar-producing/relevant states used by onboarding and the company
 * profile — that's intentionally a shorter, purpose-built list for
 * those existing forms (which this module doesn't touch). This file is
 * the separate, complete reference the master data module calls for.
 */
export const STATES: StateOption[] = [
  { value: "andhra-pradesh", label: "Andhra Pradesh", countryCode: "india", isUnionTerritory: false },
  { value: "arunachal-pradesh", label: "Arunachal Pradesh", countryCode: "india", isUnionTerritory: false },
  { value: "assam", label: "Assam", countryCode: "india", isUnionTerritory: false },
  { value: "bihar", label: "Bihar", countryCode: "india", isUnionTerritory: false },
  { value: "chhattisgarh", label: "Chhattisgarh", countryCode: "india", isUnionTerritory: false },
  { value: "goa", label: "Goa", countryCode: "india", isUnionTerritory: false },
  { value: "gujarat", label: "Gujarat", countryCode: "india", isUnionTerritory: false },
  { value: "haryana", label: "Haryana", countryCode: "india", isUnionTerritory: false },
  { value: "himachal-pradesh", label: "Himachal Pradesh", countryCode: "india", isUnionTerritory: false },
  { value: "jharkhand", label: "Jharkhand", countryCode: "india", isUnionTerritory: false },
  { value: "karnataka", label: "Karnataka", countryCode: "india", isUnionTerritory: false },
  { value: "kerala", label: "Kerala", countryCode: "india", isUnionTerritory: false },
  { value: "madhya-pradesh", label: "Madhya Pradesh", countryCode: "india", isUnionTerritory: false },
  { value: "maharashtra", label: "Maharashtra", countryCode: "india", isUnionTerritory: false },
  { value: "manipur", label: "Manipur", countryCode: "india", isUnionTerritory: false },
  { value: "meghalaya", label: "Meghalaya", countryCode: "india", isUnionTerritory: false },
  { value: "mizoram", label: "Mizoram", countryCode: "india", isUnionTerritory: false },
  { value: "nagaland", label: "Nagaland", countryCode: "india", isUnionTerritory: false },
  { value: "odisha", label: "Odisha", countryCode: "india", isUnionTerritory: false },
  { value: "punjab", label: "Punjab", countryCode: "india", isUnionTerritory: false },
  { value: "rajasthan", label: "Rajasthan", countryCode: "india", isUnionTerritory: false },
  { value: "sikkim", label: "Sikkim", countryCode: "india", isUnionTerritory: false },
  { value: "tamil-nadu", label: "Tamil Nadu", countryCode: "india", isUnionTerritory: false },
  { value: "telangana", label: "Telangana", countryCode: "india", isUnionTerritory: false },
  { value: "tripura", label: "Tripura", countryCode: "india", isUnionTerritory: false },
  { value: "uttar-pradesh", label: "Uttar Pradesh", countryCode: "india", isUnionTerritory: false },
  { value: "uttarakhand", label: "Uttarakhand", countryCode: "india", isUnionTerritory: false },
  { value: "west-bengal", label: "West Bengal", countryCode: "india", isUnionTerritory: false },

  { value: "andaman-nicobar", label: "Andaman and Nicobar Islands", countryCode: "india", isUnionTerritory: true },
  { value: "chandigarh", label: "Chandigarh", countryCode: "india", isUnionTerritory: true },
  { value: "dnh-dd", label: "Dadra and Nagar Haveli and Daman and Diu", countryCode: "india", isUnionTerritory: true },
  { value: "delhi", label: "Delhi (NCT)", countryCode: "india", isUnionTerritory: true },
  { value: "jammu-kashmir", label: "Jammu and Kashmir", countryCode: "india", isUnionTerritory: true },
  { value: "ladakh", label: "Ladakh", countryCode: "india", isUnionTerritory: true },
  { value: "lakshadweep", label: "Lakshadweep", countryCode: "india", isUnionTerritory: true },
  { value: "puducherry", label: "Puducherry", countryCode: "india", isUnionTerritory: true },
];
