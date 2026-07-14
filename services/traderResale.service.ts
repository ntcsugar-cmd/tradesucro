import { traderPurchaseService } from "./traderPurchase.service";
import { traderCustomerService } from "./traderCustomer.service";
import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { computeOrderEconomics, INVENTORY_HOLDING_STATUSES } from "@/lib/types/traderResale";
import type {
  InventoryLot,
  ResaleOffer,
  ResaleOfferDraft,
  ResaleOfferFilters,
  CustomerOrder,
  CustomerOrderDraft,
  OrderFilters,
  OrderStatus,
  SalesDashboardStats,
  SalesAnalyticsSummary,
} from "@/lib/types/traderResale";
import type { AuthResult } from "@/lib/types/auth";
import type { Purchase } from "@/lib/types/traderWorkspace";

const OFFERS_KEY = "tradesucro-trader-resale-offers";
const ORDERS_KEY = "tradesucro-trader-customer-orders";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function readJSON<T>(key: string, fallback: () => T): T {
  if (typeof window === "undefined") return fallback();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // fall through
  }
  const seeded = fallback();
  window.localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

let seedInFlight: Promise<{ offers: ResaleOffer[]; orders: CustomerOrder[] }> | null = null;

async function seedFromPurchases(): Promise<{ offers: ResaleOffer[]; orders: CustomerOrder[] }> {
  const [purchases, customers] = await Promise.all([traderPurchaseService.getPurchases(), traderCustomerService.getCustomers()]);
  const eligible = purchases.filter((p) => p.status === "confirmed" || p.status === "deal_created").slice(0, 12);

  const offers: ResaleOffer[] = [];
  const orders: CustomerOrder[] = [];
  const offerStatuses: ResaleOffer["status"][] = ["active", "active", "partially_sold", "sold_out", "draft", "expired", "withdrawn"];
  const orderStatuses: OrderStatus[] = ["confirmed", "reserved", "ready_for_dispatch", "dispatched", "delivered", "completed"];

  eligible.forEach((purchase, i) => {
    const averageCost = purchase.totalCost / purchase.quantity;
    const sellingPrice = Math.round(averageCost * (1.06 + (i % 5) * 0.015));
    const offerQuantity = Math.max(20, Math.round(purchase.quantity * (0.6 + (i % 4) * 0.1)));
    const status = offerStatuses[i % offerStatuses.length];
    const createdAt = daysFromNow(-(15 + i));

    const offer: ResaleOffer = {
      id: `roffer-${String(i + 1).padStart(4, "0")}`,
      offerNumber: `RS-2026-${String(1000 + i).slice(1)}`,
      purchaseId: purchase.id,
      lotNumber: purchase.purchaseNumber,
      grade: purchase.grade,
      product: purchase.product,
      warehouse: `${purchase.mill} Warehouse`,
      purchaseRate: purchase.rate,
      averageCost,
      sellingPrice,
      offeredQuantity: offerQuantity,
      unit: purchase.unit,
      paymentTerms: PAYMENT_TERMS[i % PAYMENT_TERMS.length].value,
      dispatchTerms: DISPATCH_TERMS[i % DISPATCH_TERMS.length].value,
      validTill: daysFromNow(10 + (i % 15)),
      remarks: i % 3 === 0 ? "Priority allocation for repeat customers." : "",
      status,
      createdAt,
      updatedAt: createdAt,
    };
    offers.push(offer);

    if (status === "partially_sold" || status === "sold_out" || i % 2 === 0) {
      const customer = customers[i % customers.length];
      const orderQty = status === "sold_out" ? offerQuantity : Math.max(10, Math.round(offerQuantity * 0.4));
      const taxes = Math.round(orderQty * sellingPrice * 0.05);
      const freight = 40 * orderQty;
      const brokerage = 0;
      const discount = i % 5 === 0 ? Math.round(orderQty * sellingPrice * 0.01) : 0;
      const { totalValue, costOfGoods, grossMargin } = computeOrderEconomics({ quantity: orderQty, sellingPrice, taxes, freight, brokerage, discount }, averageCost);
      const orderStatus = orderStatuses[i % orderStatuses.length];

      orders.push({
        id: `sorder-${String(i + 1).padStart(4, "0")}`,
        orderNumber: `SO-2026-${String(1000 + i).slice(1)}`,
        customerId: customer.id,
        customerName: customer.companyName,
        resaleOfferId: offer.id,
        purchaseId: purchase.id,
        lotNumber: purchase.purchaseNumber,
        grade: purchase.grade,
        product: purchase.product,
        quantity: orderQty,
        unit: purchase.unit,
        sellingPrice,
        taxes,
        freight,
        brokerage,
        discount,
        totalValue,
        costOfGoods,
        grossMargin,
        deliveryDate: daysFromNow(5 + (i % 20)),
        paymentTerms: PAYMENT_TERMS[i % PAYMENT_TERMS.length].value,
        status: orderStatus,
        createdAt: daysFromNow(-(10 + i)),
        updatedAt: daysFromNow(-(i % 5)),
      });
    }
  });

  return { offers, orders };
}

async function readOffers(): Promise<ResaleOffer[]> {
  if (typeof window === "undefined") return (await seedFromPurchases()).offers;
  try {
    const raw = window.localStorage.getItem(OFFERS_KEY);
    if (raw) return JSON.parse(raw) as ResaleOffer[];
  } catch {
    // fall through
  }
  if (!seedInFlight) seedInFlight = seedFromPurchases();
  const seeded = await seedInFlight;
  writeJSON(OFFERS_KEY, seeded.offers);
  writeJSON(ORDERS_KEY, seeded.orders);
  return seeded.offers;
}

async function readOrders(): Promise<CustomerOrder[]> {
  if (typeof window === "undefined") return (await seedFromPurchases()).orders;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw) as CustomerOrder[];
  } catch {
    // fall through
  }
  await readOffers();
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as CustomerOrder[]) : [];
  } catch {
    return [];
  }
}

function nextNumber(prefix: string): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

async function computeAllocatedQuantity(purchaseId: string, excludeOrderId?: string): Promise<number> {
  const orders = await readOrders();
  return orders
    .filter((o) => o.purchaseId === purchaseId && o.id !== excludeOrderId && INVENTORY_HOLDING_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + o.quantity, 0);
}

async function buildLotFromPurchase(purchase: Purchase): Promise<InventoryLot> {
  const allocatedQuantity = await computeAllocatedQuantity(purchase.id);
  return {
    purchaseId: purchase.id,
    lotNumber: purchase.purchaseNumber,
    grade: purchase.grade,
    product: purchase.product,
    warehouse: `${purchase.mill} Warehouse`,
    purchaseRate: purchase.rate,
    averageCost: purchase.totalCost / purchase.quantity,
    totalPurchasedQuantity: purchase.quantity,
    allocatedQuantity,
    availableQuantity: Math.max(0, purchase.quantity - allocatedQuantity),
    purchaseDate: purchase.purchaseDate,
  };
}

function matchesOfferFilters(offer: ResaleOffer, filters: ResaleOfferFilters): boolean {
  if (filters.status && offer.status !== filters.status) return false;
  if (filters.grade && offer.grade !== filters.grade) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!`${offer.offerNumber} ${offer.lotNumber} ${offer.grade}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

function matchesOrderFilters(order: CustomerOrder, filters: OrderFilters): boolean {
  if (filters.status && order.status !== filters.status) return false;
  if (filters.customerId && order.customerId !== filters.customerId) return false;
  if (filters.grade && order.grade !== filters.grade) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!`${order.orderNumber} ${order.customerName} ${order.lotNumber} ${order.grade}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

/**
 * Trader Resale Service (mock)
 * ------------------------------------------------------------------
 * No backend. Reads traderPurchaseService (unmodified, Trader
 * Dashboard) to derive inventory lots — never writes back to a
 * Purchase record. All 4 business rules are enforced by
 * computeAllocatedQuantity() being the single source of truth for
 * "how much of this lot is already spoken for."
 */
export const traderResaleService = {
  async getInventoryLots(): Promise<InventoryLot[]> {
    const purchases = await traderPurchaseService.getPurchases();
    const eligible = purchases.filter((p) => p.status === "confirmed" || p.status === "deal_created");
    const lots = await Promise.all(eligible.map(buildLotFromPurchase));
    return delay(lots.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
  },

  async getLotByPurchaseId(purchaseId: string): Promise<InventoryLot | undefined> {
    const purchase = await traderPurchaseService.getPurchaseById(purchaseId);
    if (!purchase) return delay(undefined);
    return delay(await buildLotFromPurchase(purchase));
  },

  async suggestAllocation(requiredQuantity: number, grade?: string) {
    const lots = (await traderResaleService.getInventoryLots()).filter((l) => (grade ? l.grade === grade : true) && l.availableQuantity > 0);
    const totalAvailable = lots.reduce((sum, l) => sum + l.availableQuantity, 0);

    const sortedByCost = [...lots].sort((a, b) => a.averageCost - b.averageCost);
    const sortedByAge = [...lots].sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());
    const sortedByMargin = [...lots].sort((a, b) => b.averageCost - a.averageCost);
    const sortedByFit = [...lots].sort((a, b) => Math.abs(a.availableQuantity - requiredQuantity) - Math.abs(b.availableQuantity - requiredQuantity));

    return delay({
      bestLot: sortedByFit.find((l) => l.availableQuantity >= requiredQuantity) ?? sortedByFit[0] ?? null,
      lowestCostLot: sortedByCost[0] ?? null,
      nearestWarehouseLot: sortedByAge[0] ?? null,
      highestMarginLot: sortedByMargin[0] ?? null,
      insufficientStock: totalAvailable < requiredQuantity,
      totalAvailable,
    });
  },

  async getResaleOffers(filters: ResaleOfferFilters = {}): Promise<ResaleOffer[]> {
    const offers = await readOffers();
    return delay(offers.filter((o) => matchesOfferFilters(o, filters)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getResaleOfferById(id: string): Promise<ResaleOffer | undefined> {
    return delay((await readOffers()).find((o) => o.id === id));
  },

  async createResaleOffer(draft: ResaleOfferDraft, status: "draft" | "active"): Promise<AuthResult<ResaleOffer>> {
    if (status === "active") {
      const lot = await traderResaleService.getLotByPurchaseId(draft.purchaseId);
      if (!lot) return delay({ success: false, message: "Selected inventory lot not found." });
      if (draft.offeredQuantity > lot.availableQuantity) {
        return delay({ success: false, message: `Only ${lot.availableQuantity} ${draft.unit.toUpperCase()} available in this lot.` }, 200);
      }
    }

    const now = new Date().toISOString();
    const offer: ResaleOffer = { ...draft, id: `roffer-user-${Date.now()}`, offerNumber: nextNumber("RS"), status, createdAt: now, updatedAt: now };
    const offers = await readOffers();
    writeJSON(OFFERS_KEY, [offer, ...offers]);
    return delay({ success: true, message: "Resale offer saved.", data: offer }, 600);
  },

  async withdrawResaleOffer(id: string): Promise<ResaleOffer | undefined> {
    const offers = await readOffers();
    const existing = offers.find((o) => o.id === id);
    if (!existing) return delay(undefined);
    const updated: ResaleOffer = { ...existing, status: "withdrawn", updatedAt: new Date().toISOString() };
    writeJSON(OFFERS_KEY, offers.map((o) => (o.id === id ? updated : o)));
    return delay(updated, 400);
  },

  async getOrders(filters: OrderFilters = {}): Promise<CustomerOrder[]> {
    const orders = await readOrders();
    return delay(orders.filter((o) => matchesOrderFilters(o, filters)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getOrderById(id: string): Promise<CustomerOrder | undefined> {
    return delay((await readOrders()).find((o) => o.id === id));
  },

  async checkAvailability(purchaseId: string, quantity: number, excludeOrderId?: string): Promise<{ ok: boolean; available: number }> {
    const purchase = await traderPurchaseService.getPurchaseById(purchaseId);
    if (!purchase) return { ok: false, available: 0 };
    const allocated = await computeAllocatedQuantity(purchaseId, excludeOrderId);
    const available = Math.max(0, purchase.quantity - allocated);
    return { ok: quantity <= available, available };
  },

  async createOrder(draft: CustomerOrderDraft, status: "draft" | "confirmed"): Promise<AuthResult<CustomerOrder>> {
    const [purchase, offer, customer] = await Promise.all([
      traderPurchaseService.getPurchaseById(draft.purchaseId),
      traderResaleService.getResaleOfferById(draft.resaleOfferId),
      traderCustomerService.getCustomerById(draft.customerId),
    ]);
    if (!purchase || !offer || !customer) return delay({ success: false, message: "Select a valid customer and resale offer." });

    if (status === "confirmed") {
      const { ok, available } = await traderResaleService.checkAvailability(draft.purchaseId, draft.quantity);
      if (!ok) return delay({ success: false, message: `Insufficient stock — only ${available} ${draft.unit.toUpperCase()} available in lot ${purchase.purchaseNumber}.` }, 200);
    }

    const averageCost = purchase.totalCost / purchase.quantity;
    const { totalValue, costOfGoods, grossMargin } = computeOrderEconomics(draft, averageCost);
    const now = new Date().toISOString();

    const order: CustomerOrder = {
      ...draft,
      id: `sorder-user-${Date.now()}`,
      orderNumber: nextNumber("SO"),
      customerName: customer.companyName,
      lotNumber: purchase.purchaseNumber,
      grade: purchase.grade,
      product: purchase.product,
      totalValue,
      costOfGoods,
      grossMargin,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const orders = await readOrders();
    writeJSON(ORDERS_KEY, [order, ...orders]);

    if (status === "confirmed") {
      await traderCustomerService.recordSale(order.customerId, order.orderNumber, order.totalValue);
    }

    return delay({ success: true, message: "Order saved.", data: order }, 600);
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<AuthResult<CustomerOrder>> {
    const orders = await readOrders();
    const existing = orders.find((o) => o.id === id);
    if (!existing) return delay({ success: false, message: "Order not found." });

    const wasHolding = INVENTORY_HOLDING_STATUSES.includes(existing.status);
    const willHold = INVENTORY_HOLDING_STATUSES.includes(status);
    if (!wasHolding && willHold) {
      const { ok, available } = await traderResaleService.checkAvailability(existing.purchaseId, existing.quantity, existing.id);
      if (!ok) return delay({ success: false, message: `Insufficient stock — only ${available} ${existing.unit.toUpperCase()} available.` }, 200);
    }

    const updated: CustomerOrder = { ...existing, status, updatedAt: new Date().toISOString() };
    writeJSON(ORDERS_KEY, orders.map((o) => (o.id === id ? updated : o)));

    if (!wasHolding && willHold) {
      await traderCustomerService.recordSale(updated.customerId, updated.orderNumber, updated.totalValue);
    } else if (wasHolding && status === "cancelled") {
      await traderCustomerService.recordPayment(updated.customerId, updated.totalValue, `${updated.orderNumber}-REVERSAL`);
    }

    return delay({ success: true, message: "Order updated.", data: updated }, 400);
  },

  async getDashboardStats(): Promise<SalesDashboardStats> {
    const orders = await readOrders();
    const today = new Date().toDateString();
    const active = orders.filter((o) => o.status !== "cancelled");

    const todaysSales = orders.filter((o) => new Date(o.createdAt).toDateString() === today && o.status !== "cancelled").reduce((sum, o) => sum + o.totalValue, 0);
    const openOrders = active.filter((o) => o.status !== "completed").length;
    const pendingDispatch = active.filter((o) => ["confirmed", "reserved", "ready_for_dispatch"].includes(o.status)).length;

    const customerTotals = new Map<string, number>();
    active.forEach((o) => customerTotals.set(o.customerName, (customerTotals.get(o.customerName) ?? 0) + o.totalValue));
    const bestCustomer = [...customerTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const grossMargin = active.reduce((sum, o) => sum + o.grossMargin, 0);
    const netMargin = grossMargin * 0.85;

    const customers = await traderCustomerService.getCustomers();
    const outstandingAmount = customers.reduce((sum, c) => sum + c.outstanding, 0);

    return delay({ todaysSales, openOrders, pendingDispatch, outstandingAmount, grossMargin, netMargin, bestCustomer });
  },

  async getSalesAnalytics(): Promise<SalesAnalyticsSummary> {
    const orders = (await readOrders()).filter((o) => o.status !== "cancelled");

    const customerMap = new Map<string, { totalValue: number; totalQuantity: number }>();
    const gradeMap = new Map<string, { totalValue: number; totalQuantity: number }>();
    const monthMap = new Map<string, number>();
    const profitMap = new Map<string, { revenue: number; cost: number }>();

    orders.forEach((o) => {
      const cAgg = customerMap.get(o.customerName) ?? { totalValue: 0, totalQuantity: 0 };
      customerMap.set(o.customerName, { totalValue: cAgg.totalValue + o.totalValue, totalQuantity: cAgg.totalQuantity + o.quantity });

      const gAgg = gradeMap.get(o.grade) ?? { totalValue: 0, totalQuantity: 0 };
      gradeMap.set(o.grade, { totalValue: gAgg.totalValue + o.totalValue, totalQuantity: gAgg.totalQuantity + o.quantity });

      const month = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      monthMap.set(month, (monthMap.get(month) ?? 0) + o.totalValue);

      const pAgg = profitMap.get(month) ?? { revenue: 0, cost: 0 };
      profitMap.set(month, { revenue: pAgg.revenue + o.totalValue, cost: pAgg.cost + o.costOfGoods });
    });

    const customerWise = [...customerMap.entries()].map(([customer, v]) => ({ customer, ...v })).sort((a, b) => b.totalValue - a.totalValue);

    return delay({
      customerWise,
      gradeWise: [...gradeMap.entries()].map(([grade, v]) => ({ grade: grade as CustomerOrder["grade"], ...v })),
      monthly: [...monthMap.entries()].map(([month, totalValue]) => ({ month, totalValue })),
      profitAnalysis: [...profitMap.entries()].map(([month, v]) => ({ month, revenue: v.revenue, cost: v.cost, profit: v.revenue - v.cost })),
      topCustomers: customerWise.slice(0, 5),
    });
  },

  getMasterOptions() {
    return { products: PRODUCTS, grades: QUALITY_GRADES };
  },
};
