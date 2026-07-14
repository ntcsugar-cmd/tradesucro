/**
 * Mill Operations Types
 * ------------------------------------------------------------------
 * Inventory here mirrors the Stock Position buckets defined in the
 * approved Business Architecture (§13.1) — Opening/Production/
 * Reserved/Available/Dispatched/Closing — scoped to this one mill's
 * grade-wise view rather than the full multi-org ledger.
 */

export interface GradeInventory {
  id: string;
  product: string;
  grade: string;
  unit: string;
  openingStock: number;
  todaysProduction: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  dispatched: number;
  closingStock: number;
}

export type DispatchStatus = "upcoming" | "today" | "completed" | "delayed";

export interface DispatchEntry {
  id: string;
  dispatchNumber: string;
  date: string;
  product: string;
  grade: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  transporter: string;
  buyerName: string;
  status: DispatchStatus;
}

export type NotificationCategory = "offer_expiring" | "tender_closing" | "low_inventory" | "dispatch_delay" | "new_interest";

export interface PortalNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export type ReportType = "daily_offer" | "price_revision" | "inventory" | "dispatch" | "offer_performance";

export interface ReportDefinition {
  type: ReportType;
  label: string;
  description: string;
}

export interface MillDashboardSummary {
  todaysActiveOffers: number;
  draftOffers: number;
  offersExpiringToday: number;
  todaysActiveTenders: number;
  totalAvailableStock: number;
  pendingDispatches: number;
}
