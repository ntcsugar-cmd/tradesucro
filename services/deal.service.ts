import { PRODUCTS } from "@/lib/master-data/products";
import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { CURRENCIES } from "@/lib/master-data/currencies";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { profileService } from "./profile.service";
import type {
  Deal,
  DealDraft,
  DealStatus,
  DealOriginType,
  DealFilters,
  DealTimelineEvent,
  DealTimelineEventType,
  DealDashboardStats,
  DealReportType,
} from "@/lib/types/deal";
import type { AuthResult } from "@/lib/types/auth";

const DEALS_KEY = "tradesucro-deals";
const TIMELINE_KEY = "tradesucro-deals-timeline";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const MILL_NAMES = ["Kaveri Sugar Mills Ltd.", "Triveni Agro Industries", "Godavari Sugarcane Co.", "Shree Renuka Exports", "Bajaj Refineries Pvt. Ltd."];
const BUYER_NAMES = ["Nestlé Confectionery Div.", "Britannia Ingredients", "Haldiram Snacks Pvt. Ltd.", "Parle Products Ltd.", "Al Manar Trading LLC"];
const TRADER_NAMES = ["Triveni Trading Co.", "Godavari Commodities", "Renuka Sweetners & Co.", "", ""];
const BROKER_NAMES = ["Kaveri Brokerage Partners", "", "", "Al Manar Trading LLC", ""];
const ORIGIN_TYPES: DealOriginType[] = ["mill_offer", "tender_award", "direct_negotiation", "marketplace_offer"];
const TRANSPORTERS = ["Shree Logistics", "BharatLine Carriers", "Speedway Transport", "Kaveri Roadways"];

const DEAL_STATUSES: DealStatus[] = [
  "inquiry", "negotiation", "offer_accepted", "deal_confirmed", "emd_pending", "emd_received",
  "purchase_order", "payment_pending", "payment_received", "dispatch_scheduled", "loading",
  "in_transit", "delivered", "closed", "cancelled",
];

function emptyDoc() {
  return { fileName: null, uploadedAt: null };
}

function generateDeals(count: number): Deal[] {
  const deals: Deal[] = [];

  for (let i = 0; i < count; i++) {
    const status = DEAL_STATUSES[i % DEAL_STATUSES.length];
    const product = PRODUCTS[i % PRODUCTS.length];
    const grade = QUALITY_GRADES[i % QUALITY_GRADES.length];
    const paymentTerm = PAYMENT_TERMS[i % PAYMENT_TERMS.length];
    const state = STATES[i % 28];
    const cities = CITIES.filter((c) => c.stateCode === state.value);
    const city = cities[i % (cities.length || 1)];
    const quantity = 100 + ((i * 53) % 900);
    const rate = 3400 + ((i * 47) % 900);
    const dealDate = daysFromNow(-(20 + i));
    const hasDocs = status !== "inquiry" && status !== "negotiation";
    const dispatched = ["dispatch_scheduled", "loading", "in_transit", "delivered", "closed"].includes(status);
    const delivered = ["delivered", "closed"].includes(status);

    deals.push({
      id: `deal-${String(i + 1).padStart(4, "0")}`,
      dealNumber: `DL-2026-${String(1000 + i).slice(1)}`,
      dealDate,
      originType: ORIGIN_TYPES[i % ORIGIN_TYPES.length],
      originReference: `${ORIGIN_TYPES[i % ORIGIN_TYPES.length] === "tender_award" ? "TND" : "OFF"}-${1000 + i}`,
      mill: MILL_NAMES[i % MILL_NAMES.length],
      seller: MILL_NAMES[i % MILL_NAMES.length],
      buyer: BUYER_NAMES[i % BUYER_NAMES.length],
      broker: BROKER_NAMES[i % BROKER_NAMES.length],
      trader: TRADER_NAMES[i % TRADER_NAMES.length],
      grade,
      product: product.value,
      quantity,
      unit: "mt",
      rate,
      totalValue: quantity * rate,
      currency: CURRENCIES[i % CURRENCIES.length].value,
      status,
      commercialTerms: {
        paymentType: paymentTerm.value,
        advancePercent: [10, 25, 50, 100][i % 4],
        creditDays: paymentTerm.creditDays,
        emdAmount: i % 3 === 0 ? 50000 + (i % 8) * 10000 : 0,
        balancePayment: i % 2 === 0 ? "Balance before dispatch" : "Balance against delivery",
        brokerage: BROKER_NAMES[i % BROKER_NAMES.length] ? Math.round(quantity * rate * 0.005) : 0,
        commission: TRADER_NAMES[i % TRADER_NAMES.length] ? Math.round(quantity * rate * 0.003) : 0,
        gstPercent: 5,
        insurance: dispatched ? Math.round(quantity * rate * 0.001) : 0,
        freight: dispatched ? 50 * quantity : 0,
        loadingCharges: dispatched ? 20 * quantity : 0,
      },
      dispatch: {
        dispatchStart: daysFromNow(2 + (i % 10)),
        dispatchEnd: daysFromNow(20 + (i % 15)),
        dailyDispatchQuantity: 50 + (i % 5) * 25,
        loadingPoint: `${MILL_NAMES[i % MILL_NAMES.length]} Godown`,
        destinationState: state.value,
        destinationCity: city?.label ?? "",
        transporter: dispatched ? TRANSPORTERS[i % TRANSPORTERS.length] : "",
        vehicleDetails: dispatched ? `KA-${10 + (i % 20)}-AB-${1000 + i}` : "",
        lrNumber: dispatched ? `LR-${5000 + i}` : "",
        ewayBill: dispatched ? `EWB-${100000 + i}` : "",
        deliveryStatus: delivered ? "delivered" : dispatched ? "in_transit" : "pending",
      },
      documents: {
        purchaseOrder: hasDocs ? { fileName: "purchase_order.pdf", uploadedAt: dealDate } : emptyDoc(),
        saleConfirmation: hasDocs ? { fileName: "sale_confirmation.pdf", uploadedAt: dealDate } : emptyDoc(),
        invoice: delivered ? { fileName: "invoice.pdf", uploadedAt: dealDate } : emptyDoc(),
        taxInvoice: delivered ? { fileName: "tax_invoice.pdf", uploadedAt: dealDate } : emptyDoc(),
        deliveryOrder: dispatched ? { fileName: "delivery_order.pdf", uploadedAt: dealDate } : emptyDoc(),
        ewayBill: dispatched ? { fileName: "eway_bill.pdf", uploadedAt: dealDate } : emptyDoc(),
        lrGr: dispatched ? { fileName: "lr_gr.pdf", uploadedAt: dealDate } : emptyDoc(),
        paymentReceipt: ["payment_received", "dispatch_scheduled", "loading", "in_transit", "delivered", "closed"].includes(status)
          ? { fileName: "payment_receipt.pdf", uploadedAt: dealDate }
          : emptyDoc(),
        qualityCertificate: i % 2 === 0 ? { fileName: "quality_certificate.pdf", uploadedAt: dealDate } : emptyDoc(),
      },
      createdBy: "Trading Desk",
      createdAt: dealDate,
      updatedAt: daysFromNow(-(i % 5)),
    });
  }

  return deals;
}

function generateTimeline(deals: Deal[]): DealTimelineEvent[] {
  const events: DealTimelineEvent[] = [];
  let counter = 0;
  const stageMap: { status: DealStatus; event: DealTimelineEventType; label: string }[] = [
    { status: "inquiry", event: "created", label: "Deal created" },
    { status: "negotiation", event: "negotiated", label: "Negotiation started" },
    { status: "deal_confirmed", event: "confirmed", label: "Deal confirmed" },
    { status: "payment_received", event: "payment", label: "Payment received" },
    { status: "dispatch_scheduled", event: "dispatch", label: "Dispatch scheduled" },
    { status: "delivered", event: "delivered", label: "Delivery completed" },
    { status: "closed", event: "closed", label: "Deal closed" },
  ];

  deals.forEach((deal) => {
    const dealStageIndex = DEAL_STATUSES.indexOf(deal.status);
    events.push({ id: `dt-${counter++}`, dealId: deal.id, event: "created", description: "Deal created", timestamp: deal.createdAt, actor: deal.createdBy });
    stageMap.slice(1).forEach((stage) => {
      const stageIndex = DEAL_STATUSES.indexOf(stage.status);
      if (dealStageIndex >= stageIndex && deal.status !== "cancelled") {
        events.push({ id: `dt-${counter++}`, dealId: deal.id, event: stage.event, description: stage.label, timestamp: deal.updatedAt, actor: "Trading Desk" });
      }
    });
    if (deal.status === "cancelled") {
      events.push({ id: `dt-${counter++}`, dealId: deal.id, event: "cancelled", description: "Deal cancelled", timestamp: deal.updatedAt, actor: "Trading Desk" });
    }
  });

  return events;
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

function readDeals(): Deal[] {
  return readJSON(DEALS_KEY, () => generateDeals(30));
}
function readTimeline(): DealTimelineEvent[] {
  return readJSON(TIMELINE_KEY, () => generateTimeline(readDeals()));
}

function appendTimeline(dealId: string, event: DealTimelineEventType, description: string) {
  const timeline = readTimeline();
  timeline.push({ id: `dt-user-${Date.now()}`, dealId, event, description, timestamp: new Date().toISOString(), actor: "Trading Desk" });
  writeJSON(TIMELINE_KEY, timeline);
}

function nextDealNumber(): string {
  const year = new Date().getFullYear();
  return `DL-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

/** Business Rule: "Only verified users can create deals" — read-only reuse of Company Profile's verification state (not a modification to that module). */
async function isCurrentUserVerified(): Promise<boolean> {
  const profile = await profileService.getProfile();
  if (!profile) return false;
  return profile.verification.gst === "verified" && profile.verification.pan === "verified";
}

function matchesFilters(deal: Deal, filters: DealFilters): boolean {
  if (filters.status && deal.status !== filters.status) return false;
  if (filters.mill && deal.mill !== filters.mill) return false;
  if (filters.buyer && deal.buyer !== filters.buyer) return false;
  if (filters.trader && deal.trader !== filters.trader) return false;
  if (filters.broker && deal.broker !== filters.broker) return false;
  if (filters.grade && deal.grade !== filters.grade) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${deal.dealNumber} ${deal.mill} ${deal.buyer} ${deal.trader} ${deal.broker} ${deal.grade}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

/**
 * Deal Management Service (mock)
 * ------------------------------------------------------------------
 * No backend. Every status change and edit appends a DealTimelineEvent
 * — the audit history the brief requires and the visible Deal Timeline
 * are the same record, not two systems kept in sync by hand.
 */
export const dealService = {
  async getDeals(filters: DealFilters = {}): Promise<Deal[]> {
    return delay(readDeals().filter((d) => matchesFilters(d, filters)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getDealById(id: string): Promise<Deal | undefined> {
    return delay(readDeals().find((d) => d.id === id));
  },

  async createDeal(draft: DealDraft): Promise<AuthResult<Deal>> {
    if (!(await isCurrentUserVerified())) {
      return delay({ success: false, message: "Only verified companies can create deals. Complete GST and PAN verification first." }, 200);
    }

    const now = new Date().toISOString();
    const deal: Deal = {
      ...draft,
      id: `deal-user-${Date.now()}`,
      dealNumber: nextDealNumber(),
      totalValue: draft.quantity * draft.rate,
      status: "inquiry",
      createdBy: "Trading Desk",
      createdAt: now,
      updatedAt: now,
    };
    writeJSON(DEALS_KEY, [deal, ...readDeals()]);
    appendTimeline(deal.id, "created", "Deal created");
    return delay({ success: true, message: "Deal created.", data: deal }, 600);
  },

  async updateDeal(id: string, patch: Partial<DealDraft>): Promise<Deal | undefined> {
    const deals = readDeals();
    const existing = deals.find((d) => d.id === id);
    if (!existing) return delay(undefined);

    const merged = { ...existing, ...patch };
    const updated: Deal = { ...merged, totalValue: merged.quantity * merged.rate, updatedAt: new Date().toISOString() };
    writeJSON(DEALS_KEY, deals.map((d) => (d.id === id ? updated : d)));
    appendTimeline(id, "edited", "Deal details updated");
    return delay(updated, 500);
  },

  async updateDealStatus(id: string, status: DealStatus, note?: string): Promise<Deal | undefined> {
    const deals = readDeals();
    const existing = deals.find((d) => d.id === id);
    if (!existing) return delay(undefined);

    const updated: Deal = { ...existing, status, updatedAt: new Date().toISOString() };
    writeJSON(DEALS_KEY, deals.map((d) => (d.id === id ? updated : d)));

    const eventMap: Partial<Record<DealStatus, DealTimelineEventType>> = {
      negotiation: "negotiated",
      deal_confirmed: "confirmed",
      payment_received: "payment",
      dispatch_scheduled: "dispatch",
      delivered: "delivered",
      closed: "closed",
      cancelled: "cancelled",
    };
    appendTimeline(id, eventMap[status] ?? "edited", `Status changed to ${status.replace(/_/g, " ")}${note ? ` — ${note}` : ""}`);
    return delay(updated, 400);
  },

  async getTimeline(dealId?: string): Promise<DealTimelineEvent[]> {
    const all = readTimeline();
    const filtered = dealId ? all.filter((e) => e.dealId === dealId) : all;
    return delay(filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  async getDashboardStats(): Promise<DealDashboardStats> {
    const deals = readDeals();
    const today = new Date().toDateString();
    const activeStatuses: DealStatus[] = DEAL_STATUSES.filter((s) => s !== "closed" && s !== "cancelled");

    return delay({
      totalActiveDeals: deals.filter((d) => activeStatuses.includes(d.status)).length,
      todaysDispatch: deals.filter((d) => new Date(d.dispatch.dispatchStart).toDateString() === today).length,
      pendingPayments: deals.filter((d) => d.status === "payment_pending").length,
      pendingDeliveries: deals.filter((d) => ["dispatch_scheduled", "loading", "in_transit"].includes(d.status)).length,
      completedDeals: deals.filter((d) => d.status === "closed").length,
      cancelledDeals: deals.filter((d) => d.status === "cancelled").length,
      totalDealValue: deals.reduce((sum, d) => sum + d.totalValue, 0),
      outstandingAmount: deals.filter((d) => d.status === "payment_pending").reduce((sum, d) => sum + d.totalValue, 0),
    });
  },

  async generateReport(type: DealReportType): Promise<{ type: DealReportType; rowCount: number; generatedAt: string }> {
    const deals = readDeals();
    return delay({ type, rowCount: deals.length, generatedAt: new Date().toISOString() }, 700);
  },

  getPartyOptions() {
    return {
      mills: MILL_NAMES,
      buyers: BUYER_NAMES.filter(Boolean),
      traders: [...new Set(TRADER_NAMES.filter(Boolean))],
      brokers: [...new Set(BROKER_NAMES.filter(Boolean))],
    };
  },
};
