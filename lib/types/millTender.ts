import type { QualityGrade } from "./marketplace";

/**
 * Mill Tender Management Types
 * ------------------------------------------------------------------
 * Named with a "Mill" prefix (MillTender, MillTenderBid, ...) and kept
 * entirely separate from lib/types/tender.ts — the existing Tender
 * Management built in Mill Portal Phase-1 (v0.7), which this task's
 * brief protects ("do not modify Mill Portal") and explicitly asks for
 * a "completely separate" system alongside. The two are intentionally
 * parallel, not connected.
 */

export type TenderType = "open" | "limited" | "private" | "negotiation" | "spot" | "forward" | "export";

export type MillTenderStatus = "draft" | "published" | "closed" | "cancelled" | "awarded" | "expired";

export type TenderVisibility = "public" | "invited_only" | "private";

export type MillTenderBidStatus = "submitted" | "revised" | "under_review" | "shortlisted" | "awarded" | "rejected";

export type EMDStatus = "not_required" | "pending" | "paid" | "refunded" | "forfeited";

export interface TenderProductRow {
  id: string;
  grade: QualityGrade;
  product: string;
  packaging: string;
  quantity: number;
  unit: string;
  minimumBidPrice: number;
  reservePrice: number;
  emdRequired: boolean;
  emdAmount: number;
  liftingSchedule: string;
}

export interface BidConditions {
  minimumQuantity: number;
  maximumQuantity: number;
  bidIncrement: number;
  bidRevisionAllowed: boolean;
  numberOfRevisions: number;
  autoExtension: boolean;
  visibility: TenderVisibility;
}

export interface MillTenderPaymentTerms {
  advancePercent: number;
  balancePercent: number;
  paymentDue: string;
  creditDays: number;
  emdNotes: string;
  bankDetailsSummary: string;
}

export interface MillTenderDispatchTerms {
  dispatchStart: string;
  dispatchEnd: string;
  loadingCapacity: number;
  dailyDispatchLimit: number;
  deliveryTerms: string;
}

export interface TenderDocument {
  fileName: string | null;
  uploadedAt: string | null;
}

export interface MillTenderDocuments {
  tenderNotice: TenderDocument;
  termsAndConditions: TenderDocument;
  qualityCertificate: TenderDocument;
  labReport: TenderDocument;
  otherDocuments: TenderDocument[];
}

export interface MillTender {
  id: string;
  tenderNumber: string;
  title: string;
  type: TenderType;
  tenderDate: string;
  openingDateTime: string;
  closingDateTime: string;
  awardDate: string;
  status: MillTenderStatus;
  products: TenderProductRow[];
  bidConditions: BidConditions;
  paymentTerms: MillTenderPaymentTerms;
  dispatchTerms: MillTenderDispatchTerms;
  documents: MillTenderDocuments;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MillTenderDraft = Omit<MillTender, "id" | "tenderNumber" | "status" | "createdBy" | "createdAt" | "updatedAt">;

export interface MillTenderBid {
  id: string;
  tenderId: string;
  bidNumber: string;
  companyName: string;
  bidderType: "trader" | "broker";
  verified: boolean;
  quantity: number;
  price: number;
  submittedAt: string;
  revisionCount: number;
  emdStatus: EMDStatus;
  status: MillTenderBidStatus;
  deliveryPreference: string;
  paymentPreference: string;
}

export type TenderTimelineEventType =
  | "created" | "published" | "bid_submitted" | "bid_revised" | "closed" | "awarded" | "completed" | "cancelled" | "edited";

export interface TenderTimelineEvent {
  id: string;
  tenderId: string;
  event: TenderTimelineEventType;
  description: string;
  timestamp: string;
  actor: string;
}

export interface AwardDetails {
  tenderId: string;
  winningBidId: string;
  awardQuantity: number;
  awardPrice: number;
  awardNotes: string;
  awardedAt: string;
}

export type TenderNotificationCategory =
  | "tender_published" | "bid_received" | "tender_closing_soon" | "award_pending" | "tender_closed" | "winner_selected";

export interface TenderNotification {
  id: string;
  tenderId: string;
  category: TenderNotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface TenderDashboardStats {
  activeTenders: number;
  closingToday: number;
  awardPending: number;
  awarded: number;
  cancelled: number;
}

export type TenderReportType = "tender_report" | "bid_analysis" | "award_report" | "emd_report" | "tender_performance";
