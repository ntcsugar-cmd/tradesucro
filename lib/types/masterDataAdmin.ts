import type { QualityGrade } from "./marketplace";

/**
 * Master Data Administration — Types
 * ------------------------------------------------------------------
 * TradeSucro has no real backend yet, so "database-driven" here means
 * what it will mean once one exists: a durable record with an id,
 * status, audit timestamps, and CRUD through a service layer — never
 * a value baked directly into a component. Today that record lives in
 * localStorage (services/productMaster.service.ts,
 * services/gradeMaster.service.ts); swapping that persistence for a
 * real API later requires no change to the types or the Admin Panel
 * that consumes them.
 *
 * lib/master-data/products.ts (PRODUCTS) and lib/types/marketplace.ts
 * (QUALITY_GRADES) remain the fast, synchronous seed/fallback values
 * every existing form and filter already imports — this file's
 * services seed themselves FROM those constants rather than
 * redefining the list a third time. Migrating those 40+ existing
 * consumers to read live from these services is deliberately a
 * separate, later phase (see the sprint summary) rather than bundled
 * into this one.
 */

export type MasterRecordStatus = "active" | "inactive";

export interface MasterProduct {
  id: string;
  code: string;
  displayName: string;
  status: MasterRecordStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type MasterProductDraft = Pick<MasterProduct, "code" | "displayName">;

export type GradeMarketClassification = "domestic" | "export" | "both";

export interface MasterGrade {
  id: string;
  code: string;
  displayName: string;
  /** Product codes (MasterProduct.code) this grade is applicable to. Empty = applicable to all products. */
  applicableProducts: string[];
  classification: GradeMarketClassification;
  status: MasterRecordStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type MasterGradeDraft = Pick<MasterGrade, "code" | "displayName" | "applicableProducts" | "classification">;

/** Legacy QualityGrade codes this Grade Master was seeded from — kept only to type-check the seed step, not used elsewhere. */
export type SeedGradeCode = QualityGrade;
