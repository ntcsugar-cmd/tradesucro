import type { QualityGrade } from "./marketplace";
import type { Season } from "@/lib/master-data/seasons";

/**
 * Mill Offer Management Types
 * ------------------------------------------------------------------
 * This module is intentionally self-contained: it does not import from
 * or modify services/marketplace.service.ts or any Marketplace
 * component. The only shared reference is QualityGrade (FAQ/Superior/
 * Standard) — reused by type-only import to avoid redefining the same
 * concept twice, not a structural dependency on Marketplace.
 *
 * Per the approved Business Architecture (§7 Mill Offer Workflow, §13
 * Inventory & Deal Execution), a Mill Offer is a primary-market, fixed
 * price listing. Tenders, resale, and deals are explicitly out of scope
 * for this module.
 */

export type MillOfferStatus = "draft" | "published" | "closed" | "cancelled" | "expired";

export interface MillOfferProductRow {
  id: string;
  product: string;
  grade: QualityGrade;
  packaging: string;
  availableQuantity: number;
  unit: string;
  basePrice: number;
  gstIncluded: boolean;
}

export interface MillOfferPaymentTerms {
  paymentType: string;
  advancePercent: number;
  balancePayment: string;
  paymentDueDate: string;
  creditDays: number;
  emdRequired: boolean;
  emdAmount: number;
  emdDueDate: string;
}

export interface MillOfferDispatch {
  dispatchStartDate: string;
  dispatchEndDate: string;
  liftingPeriodDays: number;
  minimumLiftingQuantity: number;
  maximumDailyLifting: number;
  dispatchTerms: string;
}

export interface MillOfferConditions {
  specialTerms: string;
  qualityConditions: string;
  penaltyClause: string;
  cancellationPolicy: string;
  remarks: string;
}

export interface OfferDocument {
  fileName: string | null;
  uploadedAt: string | null;
}

export interface MillOfferAttachments {
  offerCircular: OfferDocument;
  qualityCertificate: OfferDocument;
  millLetter: OfferDocument;
  otherDocuments: OfferDocument[];
}

export interface MillOffer {
  id: string;
  offerNumber: string;
  offerDate: string;
  validTill: string;
  season: Season;
  status: MillOfferStatus;

  millId: string;
  millName: string;
  state: string;
  city: string;
  factoryCode: string;

  products: MillOfferProductRow[];
  paymentTerms: MillOfferPaymentTerms;
  dispatch: MillOfferDispatch;
  conditions: MillOfferConditions;
  attachments: MillOfferAttachments;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Draft/editable shape used by the create/edit form before it becomes a full MillOffer. */
export type MillOfferDraft = Omit<
  MillOffer,
  "id" | "offerNumber" | "status" | "createdBy" | "createdAt" | "updatedAt"
>;

export interface MillOfferRevision {
  id: string;
  offerId: string;
  revisionNumber: number;
  changedBy: string;
  changedOn: string;
  fieldsModified: string[];
}

export interface MillOfferFilters {
  search?: string;
  millId?: string;
  state?: string;
  product?: string;
  grade?: QualityGrade;
  season?: Season;
  status?: MillOfferStatus;
  emdRequired?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface MillOfferDashboardStats {
  todaysActiveOffers: number;
  offersExpiringToday: number;
  publishedOffers: number;
  draftOffers: number;
  totalQuantityAvailable: number;
}

export const MILL_OFFER_STATUS_OPTIONS: { value: MillOfferStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];
