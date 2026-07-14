import type { QualityGrade } from "./marketplace";

/**
 * Resale Market & Customer Orders — Types
 * ------------------------------------------------------------------
 * "Inventory" here is not a parallel stock system — it's a read-only
 * derived view over the trader's own Purchase Register (Trader
 * Dashboard, protected — read via traderPurchaseService, unmodified).
 * Every confirmed/deal_created Purchase is one inventory lot; this
 * module never writes back to a Purchase record. Instead, it tracks
 * how much of each lot has been allocated to Resale Offers / Customer
 * Orders in its own ledger, and computes "available quantity" by
 * subtraction at read time — the same non-negative-inventory pattern
 * used by Mill Portal's own inventory module, applied locally instead
 * of by editing that (protected) module.
 */

export type CustomerType = "wholesaler" | "semi_wholesaler" | "industrial_buyer" | "retail_chain" | "exporter";

export interface Customer {
  id: string;
  companyName: string;
  customerType: CustomerType;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  gst: string;
  pan: string;
  address: string;
  state: string;
  creditLimit: number;
  outstanding: number;
  rating: number;
  createdAt: string;
}

export type CustomerDraft = Omit<Customer, "id" | "outstanding" | "createdAt">;

/** A read-only, computed view of one Purchase as a sellable inventory lot — never persisted independently. */
export interface InventoryLot {
  purchaseId: string;
  lotNumber: string;
  grade: QualityGrade;
  product: string;
  warehouse: string;
  purchaseRate: number;
  averageCost: number;
  totalPurchasedQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  purchaseDate: string;
}

export type ResaleOfferStatus = "draft" | "active" | "partially_sold" | "sold_out" | "expired" | "withdrawn";

export interface ResaleOffer {
  id: string;
  offerNumber: string;
  purchaseId: string;
  lotNumber: string;
  grade: QualityGrade;
  product: string;
  warehouse: string;
  purchaseRate: number;
  averageCost: number;
  sellingPrice: number;
  offeredQuantity: number;
  unit: string;
  paymentTerms: string;
  dispatchTerms: string;
  validTill: string;
  remarks: string;
  status: ResaleOfferStatus;
  createdAt: string;
  updatedAt: string;
}

export type ResaleOfferDraft = Omit<ResaleOffer, "id" | "offerNumber" | "status" | "createdAt" | "updatedAt">;

/** expectedProfit/expectedMarginPercent are always derived the same way — computed here so the create form, the offer board, and the service never disagree. */
export function computeResaleEconomics(input: Pick<ResaleOffer, "sellingPrice" | "averageCost" | "offeredQuantity">) {
  const expectedProfit = (input.sellingPrice - input.averageCost) * input.offeredQuantity;
  const expectedMarginPercent = input.sellingPrice > 0 ? ((input.sellingPrice - input.averageCost) / input.sellingPrice) * 100 : 0;
  return { expectedProfit, expectedMarginPercent };
}

export type OrderStatus = "draft" | "confirmed" | "reserved" | "ready_for_dispatch" | "dispatched" | "delivered" | "completed" | "cancelled";

/** Statuses that hold a claim on inventory (Business Rule: "Every confirmed order reserves inventory"). */
export const INVENTORY_HOLDING_STATUSES: OrderStatus[] = ["confirmed", "reserved", "ready_for_dispatch", "dispatched", "delivered", "completed"];

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  resaleOfferId: string;
  purchaseId: string;
  lotNumber: string;
  grade: QualityGrade;
  product: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
  taxes: number;
  freight: number;
  brokerage: number;
  discount: number;
  totalValue: number;
  costOfGoods: number;
  grossMargin: number;
  deliveryDate: string;
  paymentTerms: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type CustomerOrderDraft = Omit<
  CustomerOrder,
  "id" | "orderNumber" | "customerName" | "lotNumber" | "grade" | "product" | "totalValue" | "costOfGoods" | "grossMargin" | "status" | "createdAt" | "updatedAt"
>;

/** totalValue/costOfGoods/grossMargin are always derived the same way — one function, used by the create form and the service alike. */
export function computeOrderEconomics(
  input: Pick<CustomerOrder, "quantity" | "sellingPrice" | "taxes" | "freight" | "brokerage" | "discount">,
  averageCost: number
) {
  const totalValue = input.quantity * input.sellingPrice + input.taxes + input.freight + input.brokerage - input.discount;
  const costOfGoods = input.quantity * averageCost;
  const grossMargin = totalValue - costOfGoods - input.taxes - input.freight - input.brokerage;
  return { totalValue, costOfGoods, grossMargin };
}

export type LedgerEntryType = "sale" | "payment" | "credit_note";

export interface LedgerEntry {
  id: string;
  customerId: string;
  type: LedgerEntryType;
  reference: string;
  description: string;
  amount: number;
  date: string;
  balanceAfter: number;
}

export interface CustomerAgeing {
  current: number;
  days30: number;
  days60: number;
  days90Plus: number;
}

export interface SalesDashboardStats {
  todaysSales: number;
  openOrders: number;
  pendingDispatch: number;
  outstandingAmount: number;
  grossMargin: number;
  netMargin: number;
  bestCustomer: string;
}

export interface CustomerSalesPoint {
  customer: string;
  totalValue: number;
  totalQuantity: number;
}

export interface GradeSalesPoint {
  grade: QualityGrade;
  totalValue: number;
  totalQuantity: number;
}

export interface MonthlySalesPoint {
  month: string;
  totalValue: number;
}

export interface ProfitPoint {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface SalesAnalyticsSummary {
  customerWise: CustomerSalesPoint[];
  gradeWise: GradeSalesPoint[];
  monthly: MonthlySalesPoint[];
  profitAnalysis: ProfitPoint[];
  topCustomers: CustomerSalesPoint[];
}

export interface OrderFilters {
  search?: string;
  customerId?: string;
  grade?: QualityGrade;
  status?: OrderStatus;
}

export interface ResaleOfferFilters {
  search?: string;
  grade?: QualityGrade;
  status?: ResaleOfferStatus;
}
