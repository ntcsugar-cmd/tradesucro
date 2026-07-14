import { MILLS } from "@/lib/master-data/mills";
import { PRODUCTS } from "@/lib/master-data/products";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { dealService } from "./deal.service";
import { workspaceService } from "./workspace.service";
import type { Purchase, PurchaseDraft, PurchaseFilters, Supplier, PurchaseAnalyticsSummary } from "@/lib/types/traderWorkspace";
import { computePurchaseFinancials } from "@/lib/types/traderWorkspace";
import type { DealDraft, Deal } from "@/lib/types/deal";

const PURCHASES_KEY = "tradesucro-trader-purchases";
const SUPPLIERS_KEY = "tradesucro-trader-suppliers";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const BROKER_NAMES = ["Kaveri Brokerage Partners", "", "", "Al Manar Trading LLC", ""];
const SOURCES: Purchase["source"][] = ["mill_offer", "tender_award", "direct_purchase", "marketplace_offer"];
const PURCHASE_STATUSES: Purchase["status"][] = ["confirmed", "deal_created", "confirmed", "deal_created", "draft", "cancelled"];

function generatePurchases(count: number): Purchase[] {
  const purchases: Purchase[] = [];

  for (let i = 0; i < count; i++) {
    const mill = MILLS[i % 15];
    const product = PRODUCTS[i % PRODUCTS.length];
    const grade = QUALITY_GRADES[i % QUALITY_GRADES.length];
    const quantity = 80 + ((i * 41) % 700);
    const rate = 3400 + ((i * 53) % 900);
    const taxes = Math.round(quantity * rate * 0.05);
    const freight = 50 * quantity;
    const insurance = Math.round(quantity * rate * 0.001);
    const brokerage = BROKER_NAMES[i % BROKER_NAMES.length] ? Math.round(quantity * rate * 0.005) : 0;
    const expectedSellingPrice = rate + 60 + (i % 5) * 15;
    const { totalCost, expectedMargin } = computePurchaseFinancials({ quantity, rate, taxes, freight, insurance, brokerage, expectedSellingPrice });
    const status = PURCHASE_STATUSES[i % PURCHASE_STATUSES.length];
    const purchaseDate = daysFromNow(-(i % 30));

    purchases.push({
      id: `pur-${String(i + 1).padStart(4, "0")}`,
      purchaseNumber: `PUR-2026-${String(1000 + i).slice(1)}`,
      purchaseDate,
      source: SOURCES[i % SOURCES.length],
      supplier: mill.name,
      mill: mill.name,
      broker: BROKER_NAMES[i % BROKER_NAMES.length],
      grade,
      product: product.value,
      quantity,
      unit: "mt",
      rate,
      taxes,
      freight,
      insurance,
      brokerage,
      totalCost,
      expectedSellingPrice,
      expectedMargin,
      dealReference: status === "deal_created" ? `deal-${String((i % 30) + 1).padStart(4, "0")}` : null,
      status,
      createdAt: purchaseDate,
      updatedAt: purchaseDate,
    });
  }

  return purchases;
}

function generateSuppliers(): Supplier[] {
  return MILLS.slice(0, 15).map((mill, i) => ({
    id: `sup-${mill.id}`,
    millId: mill.id,
    name: mill.name,
    state: mill.state,
    verified: i % 4 !== 0,
    preferred: i % 3 === 0,
    rating: [3.5, 4, 4.2, 4.5, 4.8, 5][i % 6],
    lastPurchaseDate: i % 5 === 0 ? null : daysFromNow(-(i % 25)),
    outstanding: i % 3 === 0 ? 0 : 40000 + ((i % 6) * 25000),
    purchaseVolume: 500 + ((i * 173) % 4000),
  }));
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

function readPurchases(): Purchase[] {
  return readJSON(PURCHASES_KEY, () => generatePurchases(28));
}
function readSuppliers(): Supplier[] {
  return readJSON(SUPPLIERS_KEY, generateSuppliers);
}

function nextPurchaseNumber(): string {
  const year = new Date().getFullYear();
  return `PUR-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

function matchesFilters(purchase: Purchase, filters: PurchaseFilters): boolean {
  if (filters.status && purchase.status !== filters.status) return false;
  if (filters.supplier && purchase.supplier !== filters.supplier) return false;
  if (filters.mill && purchase.mill !== filters.mill) return false;
  if (filters.broker && purchase.broker !== filters.broker) return false;
  if (filters.grade && purchase.grade !== filters.grade) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${purchase.purchaseNumber} ${purchase.mill} ${purchase.supplier} ${purchase.broker} ${purchase.grade}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

async function buildDealDraftFromPurchase(purchase: Purchase): Promise<DealDraft> {
  const activeWorkspace = workspaceService.getActiveWorkspace();
  const buyerName = activeWorkspace?.companyName ?? "Trading Desk";
  const paymentTerm = PAYMENT_TERMS[0];

  return {
    dealDate: purchase.purchaseDate,
    originType:
      purchase.source === "mill_offer"
        ? "mill_offer"
        : purchase.source === "tender_award"
          ? "tender_award"
          : purchase.source === "marketplace_offer"
            ? "marketplace_offer"
            : "direct_negotiation",
    originReference: purchase.purchaseNumber,
    mill: purchase.mill,
    seller: purchase.supplier,
    buyer: buyerName,
    broker: purchase.broker,
    trader: buyerName,
    grade: purchase.grade,
    product: purchase.product,
    quantity: purchase.quantity,
    unit: purchase.unit,
    rate: purchase.rate,
    currency: "inr",
    commercialTerms: {
      paymentType: paymentTerm.value,
      advancePercent: 25,
      creditDays: paymentTerm.creditDays,
      emdAmount: 0,
      balancePayment: "Balance before dispatch",
      brokerage: purchase.brokerage,
      commission: 0,
      gstPercent: 5,
      insurance: purchase.insurance,
      freight: purchase.freight,
      loadingCharges: 0,
    },
    dispatch: {
      dispatchStart: daysFromNow(3),
      dispatchEnd: daysFromNow(20),
      dailyDispatchQuantity: Math.max(25, Math.round(purchase.quantity / 10)),
      loadingPoint: `${purchase.mill} Godown`,
      destinationState: "",
      destinationCity: "",
      transporter: "",
      vehicleDetails: "",
      lrNumber: "",
      ewayBill: "",
      deliveryStatus: "pending",
    },
    documents: {
      purchaseOrder: { fileName: null, uploadedAt: null },
      saleConfirmation: { fileName: null, uploadedAt: null },
      invoice: { fileName: null, uploadedAt: null },
      taxInvoice: { fileName: null, uploadedAt: null },
      deliveryOrder: { fileName: null, uploadedAt: null },
      ewayBill: { fileName: null, uploadedAt: null },
      lrGr: { fileName: null, uploadedAt: null },
      paymentReceipt: { fileName: null, uploadedAt: null },
      qualityCertificate: { fileName: null, uploadedAt: null },
    },
  };
}

/**
 * Trader Purchase Service (mock)
 * ------------------------------------------------------------------
 * No backend. Business Rule: "Every Purchase can create a Deal" —
 * confirmAndCreateDeal() calls dealService.createDeal() (unmodified,
 * reused as-is) and stores the resulting deal's number as
 * dealReference. Business Rule: "Every Purchase generates an Audit
 * Trail" — a confirmed purchase's Deal then carries its own full
 * timeline via Deal Management's own (unmodified) audit trail; the
 * purchase itself keeps createdAt/updatedAt like every other module.
 */
export const traderPurchaseService = {
  async getPurchases(filters: PurchaseFilters = {}): Promise<Purchase[]> {
    return delay(readPurchases().filter((p) => matchesFilters(p, filters)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getPurchaseById(id: string): Promise<Purchase | undefined> {
    return delay(readPurchases().find((p) => p.id === id));
  },

  async createPurchase(draft: PurchaseDraft, status: "draft" | "confirmed"): Promise<Purchase> {
    const { totalCost, expectedMargin } = computePurchaseFinancials(draft);
    const now = new Date().toISOString();
    const purchase: Purchase = {
      ...draft,
      id: `pur-user-${Date.now()}`,
      purchaseNumber: nextPurchaseNumber(),
      totalCost,
      expectedMargin,
      dealReference: null,
      status,
      createdAt: now,
      updatedAt: now,
    };
    writeJSON(PURCHASES_KEY, [purchase, ...readPurchases()]);

    if (status === "confirmed") {
      return (await traderPurchaseService.confirmAndCreateDeal(purchase.id)) ?? purchase;
    }
    return purchase;
  },

  /** Business Rule: "Every Purchase can create a Deal." Creates a real Deal via the unmodified dealService.createDeal. */
  async confirmAndCreateDeal(purchaseId: string): Promise<Purchase | undefined> {
    const purchases = readPurchases();
    const purchase = purchases.find((p) => p.id === purchaseId);
    if (!purchase) return delay(undefined);

    const draft = await buildDealDraftFromPurchase(purchase);
    const result = await dealService.createDeal(draft);

    const updated: Purchase = {
      ...purchase,
      status: result.success ? "deal_created" : "confirmed",
      dealReference: result.success && result.data ? (result.data as Deal).id : null,
      updatedAt: new Date().toISOString(),
    };
    writeJSON(PURCHASES_KEY, purchases.map((p) => (p.id === purchaseId ? updated : p)));
    return delay(updated, 500);
  },

  async cancelPurchase(id: string): Promise<Purchase | undefined> {
    const purchases = readPurchases();
    const existing = purchases.find((p) => p.id === id);
    if (!existing) return delay(undefined);
    const updated: Purchase = { ...existing, status: "cancelled", updatedAt: new Date().toISOString() };
    writeJSON(PURCHASES_KEY, purchases.map((p) => (p.id === id ? updated : p)));
    return delay(updated, 400);
  },

  getPartyOptions() {
    const purchases = readPurchases();
    return {
      suppliers: [...new Set(purchases.map((p) => p.supplier))],
      mills: [...new Set(purchases.map((p) => p.mill))],
      brokers: [...new Set(purchases.map((p) => p.broker).filter(Boolean))],
    };
  },

  async getSuppliers(): Promise<Supplier[]> {
    return delay(readSuppliers().sort((a, b) => b.rating - a.rating));
  },

  async togglePreferred(id: string): Promise<Supplier | undefined> {
    const suppliers = readSuppliers();
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier) return delay(undefined);
    const updated = { ...supplier, preferred: !supplier.preferred };
    writeJSON(SUPPLIERS_KEY, suppliers.map((s) => (s.id === id ? updated : s)));
    return delay(updated, 300);
  },

  async getAnalytics(): Promise<PurchaseAnalyticsSummary> {
    const purchases = readPurchases().filter((p) => p.status !== "cancelled" && p.status !== "draft");

    const monthMap = new Map<string, { totalValue: number; totalQuantity: number }>();
    const supplierMap = new Map<string, { totalValue: number; totalQuantity: number }>();
    const gradeMap = new Map<string, { totalValue: number; totalQuantity: number }>();

    purchases.forEach((p) => {
      const month = new Date(p.purchaseDate).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      const mAgg = monthMap.get(month) ?? { totalValue: 0, totalQuantity: 0 };
      monthMap.set(month, { totalValue: mAgg.totalValue + p.totalCost, totalQuantity: mAgg.totalQuantity + p.quantity });

      const sAgg = supplierMap.get(p.supplier) ?? { totalValue: 0, totalQuantity: 0 };
      supplierMap.set(p.supplier, { totalValue: sAgg.totalValue + p.totalCost, totalQuantity: sAgg.totalQuantity + p.quantity });

      const gAgg = gradeMap.get(p.grade) ?? { totalValue: 0, totalQuantity: 0 };
      gradeMap.set(p.grade, { totalValue: gAgg.totalValue + p.totalCost, totalQuantity: gAgg.totalQuantity + p.quantity });
    });

    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalValueExRate = purchases.reduce((sum, p) => sum + p.quantity * p.rate, 0);
    const supplierWise = [...supplierMap.entries()].map(([supplier, v]) => ({ supplier, ...v })).sort((a, b) => b.totalValue - a.totalValue);

    return delay({
      monthly: [...monthMap.entries()].map(([month, v]) => ({ month, ...v })),
      supplierWise,
      gradeWise: [...gradeMap.entries()].map(([grade, v]) => ({ grade: grade as Purchase["grade"], ...v })),
      averagePurchasePrice: totalQuantity > 0 ? Math.round(totalValueExRate / totalQuantity) : 0,
      topSuppliers: supplierWise.slice(0, 5),
    });
  },
};
