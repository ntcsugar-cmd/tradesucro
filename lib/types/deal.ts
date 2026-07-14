import type { QualityGrade } from "./marketplace";

/**
 * Deal Management Types
 * ------------------------------------------------------------------
 * The core trading engine — a Deal is the transaction itself, distinct
 * from the listing that produced it (Mill Offer, Tender, Marketplace
 * Offer) or a direct negotiation. Deliberately loosely coupled to
 * those origin sources (a type + free-text reference, not a foreign
 * key into their internals) since Mill Offers and Tender Management
 * are protected modules this build doesn't import from.
 */

export type DealStatus =
  | "inquiry"
  | "negotiation"
  | "offer_accepted"
  | "deal_confirmed"
  | "emd_pending"
  | "emd_received"
  | "purchase_order"
  | "payment_pending"
  | "payment_received"
  | "dispatch_scheduled"
  | "loading"
  | "in_transit"
  | "delivered"
  | "closed"
  | "cancelled";

export const DEAL_STATUS_SEQUENCE: DealStatus[] = [
  "inquiry",
  "negotiation",
  "offer_accepted",
  "deal_confirmed",
  "emd_pending",
  "emd_received",
  "purchase_order",
  "payment_pending",
  "payment_received",
  "dispatch_scheduled",
  "loading",
  "in_transit",
  "delivered",
  "closed",
];

export type DealOriginType = "mill_offer" | "tender_award" | "direct_negotiation" | "marketplace_offer";

export interface DealCommercialTerms {
  paymentType: string;
  advancePercent: number;
  creditDays: number;
  emdAmount: number;
  balancePayment: string;
  brokerage: number;
  commission: number;
  gstPercent: number;
  insurance: number;
  freight: number;
  loadingCharges: number;
}

export interface DealDispatch {
  dispatchStart: string;
  dispatchEnd: string;
  dailyDispatchQuantity: number;
  loadingPoint: string;
  destinationState: string;
  destinationCity: string;
  transporter: string;
  vehicleDetails: string;
  lrNumber: string;
  ewayBill: string;
  deliveryStatus: "pending" | "in_transit" | "delivered";
}

export interface DealDocument {
  fileName: string | null;
  uploadedAt: string | null;
}

export interface DealDocuments {
  purchaseOrder: DealDocument;
  saleConfirmation: DealDocument;
  invoice: DealDocument;
  taxInvoice: DealDocument;
  deliveryOrder: DealDocument;
  ewayBill: DealDocument;
  lrGr: DealDocument;
  paymentReceipt: DealDocument;
  qualityCertificate: DealDocument;
}

export interface Deal {
  id: string;
  dealNumber: string;
  dealDate: string;
  originType: DealOriginType;
  originReference: string;

  mill: string;
  seller: string;
  buyer: string;
  broker: string;
  trader: string;

  grade: QualityGrade;
  product: string;
  quantity: number;
  unit: string;
  rate: number;
  totalValue: number;
  currency: string;

  status: DealStatus;
  commercialTerms: DealCommercialTerms;
  dispatch: DealDispatch;
  documents: DealDocuments;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DealDraft = Omit<Deal, "id" | "dealNumber" | "status" | "totalValue" | "createdBy" | "createdAt" | "updatedAt">;

export type DealTimelineEventType = "created" | "negotiated" | "confirmed" | "payment" | "dispatch" | "delivered" | "closed" | "cancelled" | "edited";

export interface DealTimelineEvent {
  id: string;
  dealId: string;
  event: DealTimelineEventType;
  description: string;
  timestamp: string;
  actor: string;
}

export interface DealFilters {
  search?: string;
  status?: DealStatus;
  mill?: string;
  buyer?: string;
  trader?: string;
  broker?: string;
  grade?: QualityGrade;
}

export interface DealDashboardStats {
  totalActiveDeals: number;
  todaysDispatch: number;
  pendingPayments: number;
  pendingDeliveries: number;
  completedDeals: number;
  cancelledDeals: number;
  totalDealValue: number;
  outstandingAmount: number;
}

export type DealReportType =
  | "deal_summary"
  | "mill_wise"
  | "buyer_wise"
  | "trader_wise"
  | "broker_wise"
  | "dispatch_report"
  | "payment_report"
  | "outstanding_report";
