/**
 * Master Data Types
 * ------------------------------------------------------------------
 * Types for the centralized reference data in lib/master-data/. This
 * lives in its own top-level types/ folder (distinct from lib/types/,
 * which holds auth/onboarding/company-profile domain types) — master
 * data is reference/lookup data consumed by many unrelated features,
 * not the shape of a single domain entity.
 */

/** Base shape shared by every simple dropdown option in the master data system. */
export interface MasterDataOption {
  value: string;
  label: string;
}

export interface Product extends MasterDataOption {
  /** Broad classification, useful for grouping/filtering in future UI. */
  category: "cane" | "refined" | "pharma" | "packing" | "raw" | "imported" | "beet";
}

export interface PackagingOption extends MasterDataOption {
  weightKg: number;
}

export type UnitOption = MasterDataOption;

export interface PaymentTermOption extends MasterDataOption {
  /** Days of credit extended; 0 for advance/against-dispatch/against-delivery terms. */
  creditDays: number;
}

export interface DispatchTermOption extends MasterDataOption {
  /** True for terms where a specific location must also be captured (e.g. "Ex Warehouse"). */
  requiresLocation: boolean;
}

export interface CompanyTypeOption extends MasterDataOption {
  description: string;
}

export type CountryOption = MasterDataOption;

export interface StateOption extends MasterDataOption {
  countryCode: string;
  isUnionTerritory: boolean;
}

export interface CityOption extends MasterDataOption {
  stateCode: string;
}

export type MillType = "Private" | "Cooperative" | "Public Sector";

export interface Mill {
  id: string;
  name: string;
  state: string;
  city: string;
  capacityTpd: number;
  type: MillType;
}

export interface CurrencyOption extends MasterDataOption {
  symbol: string;
}
