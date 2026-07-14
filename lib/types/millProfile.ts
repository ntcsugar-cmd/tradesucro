import type { VerificationStatus } from "./company-profile";

/**
 * Mill Profile Types
 * ------------------------------------------------------------------
 * Deliberately separate from lib/types/company-profile.ts (protected,
 * not modified) — a Mill Profile carries factory-specific operational
 * data (crushing capacity, warehouse, bank details) that a generic
 * Company Profile doesn't model. Both may exist for the same
 * organization; this one is scoped to the Mill Portal.
 */

export interface FactoryDetails {
  factoryCode: string;
  dailyCrushingCapacityTcd: number;
  sugarProductionCapacityTpd: number;
  storageCapacityMt: number;
  establishedYear: number;
}

export interface WarehouseDetail {
  id: string;
  name: string;
  location: string;
  capacityMt: number;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

export interface MillContactPerson {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
}

export interface FactoryLocation {
  state: string;
  city: string;
  pinCode: string;
  fullAddress: string;
}

export interface MillDocument {
  id: string;
  label: string;
  fileName: string | null;
  uploadedAt: string | null;
}

export interface MillVerification {
  gst: VerificationStatus;
  pan: VerificationStatus;
  iec: VerificationStatus;
  factoryLicense: VerificationStatus;
}

export interface MillProfile {
  id: string;
  companyName: string;
  factory: FactoryDetails;
  warehouses: WarehouseDetail[];
  bankDetails: BankDetails;
  gstin: string;
  pan: string;
  iec: string;
  contactPersons: MillContactPerson[];
  location: FactoryLocation;
  documents: MillDocument[];
  verification: MillVerification;
  updatedAt: string;
}

/** Business Rule: "Only verified mills can publish offers/tenders" — GST and PAN verified is treated as the qualifying bar. */
export function isMillVerified(profile: Pick<MillProfile, "verification">): boolean {
  return profile.verification.gst === "verified" && profile.verification.pan === "verified";
}
