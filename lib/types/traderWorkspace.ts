import type { QualityGrade } from "./marketplace";

/**
 * Trader Workspace Types
 * ------------------------------------------------------------------
 * The Trader's daily operating environment. Heavily reuses existing
 * services rather than re-modeling their data: Live Market Panel and
 * Buying Opportunities are read from marketIntelligenceService
 * (unmodified), and a confirmed Purchase creates a real Deal via
 * dealService.createDeal (also unmodified) — this module supplies the
 * Purchase Register itself, which neither of those own.
 */

export type PurchaseSource = "mill_offer" | "tender_award" | "direct_purchase" | "marketplace_offer";
export type PurchaseStatus = "draft" | "confirmed" | "deal_created" | "cancelled";

export interface Purchase {
  id: string;
  purchaseNumber: string;
  purchaseDate: string;
  source: PurchaseSource;
  supplier: string;
  mill: string;
  broker: string;
  grade: QualityGrade;
  product: string;
  quantity: number;
  unit: string;
  rate: number;
  taxes: number;
  freight: number;
  insurance: number;
  brokerage: number;
  totalCost: number;
  expectedSellingPrice: number;
  expectedMargin: number;
  dealReference: string | null;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseDraft = Omit<
  Purchase,
  "id" | "purchaseNumber" | "totalCost" | "expectedMargin" | "dealReference" | "status" | "createdAt" | "updatedAt"
>;

/** totalCost and expectedMargin are always derived from the same formula, computed here so create/update/mock-seed never drift apart. */
export function computePurchaseFinancials(input: Pick<PurchaseDraft, "quantity" | "rate" | "taxes" | "freight" | "insurance" | "brokerage" | "expectedSellingPrice">) {
  const totalCost = input.quantity * input.rate + input.taxes + input.freight + input.insurance + input.brokerage;
  const expectedRevenue = input.quantity * input.expectedSellingPrice;
  const expectedMargin = expectedRevenue - totalCost;
  return { totalCost, expectedMargin };
}

export interface Supplier {
  id: string;
  millId: string;
  name: string;
  state: string;
  verified: boolean;
  preferred: boolean;
  rating: number;
  lastPurchaseDate: string | null;
  outstanding: number;
  purchaseVolume: number;
}

export interface BuyingOpportunity {
  id: string;
  millId: string;
  millName: string;
  state: string;
  grade: QualityGrade;
  quantity: number;
  rate: number;
  distanceKm: number;
  paymentTerms: string;
  expectedMargin: number;
}

export interface TraderDashboardStats {
  todaysMarketAverage: number;
  lowestMillPrice: number;
  highestMillPrice: number;
  activeTenders: number;
  offersClosingToday: number;
  myActiveDeals: number;
  pendingDispatch: number;
  pendingPayments: number;
  inventoryValue: number;
  todaysProfitEstimate: number;
}

export interface TraderKPI {
  todaysPurchases: number;
  averagePurchasePrice: number;
  margin: number;
  openDeals: number;
  pendingPayments: number;
  pendingDeliveries: number;
}

export type TraderNotificationCategory = "new_offer" | "tender_closing" | "price_drop" | "price_increase" | "supplier_update" | "deal_update";

export interface TraderNotification {
  id: string;
  category: TraderNotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface PurchaseFilters {
  search?: string;
  supplier?: string;
  mill?: string;
  broker?: string;
  grade?: QualityGrade;
  status?: PurchaseStatus;
}

export interface MonthlyPurchasePoint {
  month: string;
  totalValue: number;
  totalQuantity: number;
}

export interface SupplierPurchasePoint {
  supplier: string;
  totalValue: number;
  totalQuantity: number;
}

export interface GradePurchasePoint {
  grade: QualityGrade;
  totalValue: number;
  totalQuantity: number;
}

export interface PurchaseAnalyticsSummary {
  monthly: MonthlyPurchasePoint[];
  supplierWise: SupplierPurchasePoint[];
  gradeWise: GradePurchasePoint[];
  averagePurchasePrice: number;
  topSuppliers: SupplierPurchasePoint[];
}
