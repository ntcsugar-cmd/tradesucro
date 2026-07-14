import { marketIntelligenceService } from "./marketIntelligence.service";
import { traderPurchaseService } from "./traderPurchase.service";
import { dealService } from "./deal.service";
import type { TraderDashboardStats, TraderKPI, BuyingOpportunity, TraderNotification } from "@/lib/types/traderWorkspace";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";

const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const MOCK_NOTIFICATIONS: TraderNotification[] = [
  { id: "trn-1", category: "new_offer", title: "New mill offer", description: "Godavari Sugarcane Co. published a new S-30 offer at ₹3,720/QTL.", timestamp: "12 min ago", read: false },
  { id: "trn-2", category: "tender_closing", title: "Tender closing soon", description: "MTD-2026-1002 closes in 3 hours — you haven't bid yet.", timestamp: "40 min ago", read: false },
  { id: "trn-3", category: "price_drop", title: "Price drop", description: "M-30 in Maharashtra dropped ₹35/QTL since this morning.", timestamp: "1 hr ago", read: false },
  { id: "trn-4", category: "price_increase", title: "Price increase", description: "Export-grade ICUMSA 45 is up ₹50/QTL this week.", timestamp: "3 hr ago", read: true },
  { id: "trn-5", category: "supplier_update", title: "Supplier update", description: "Shree Renuka Exports updated their payment terms.", timestamp: "5 hr ago", read: true },
  { id: "trn-6", category: "deal_update", title: "Deal update", description: "DL-2026-1014 moved to Payment Received.", timestamp: "Yesterday", read: true },
];

/** A simple, illustrative margin heuristic: mills priced below the day's average look more attractive to buy from. */
function estimateMargin(entry: MillPriceEntry, marketAverage: number): number {
  const discount = marketAverage - entry.todaysPrice;
  const baseMargin = Math.round(marketAverage * 0.03);
  return Math.max(20, baseMargin + discount);
}

/**
 * Trader Dashboard Service (mock)
 * ------------------------------------------------------------------
 * No backend. Every market figure here is read from
 * marketIntelligenceService (unmodified) — this service only reshapes
 * that data for the trader's own dashboard/opportunities view and adds
 * the trader-specific KPI figures, which come from traderPurchaseService
 * and dealService (both also unmodified, read-only).
 */
export const traderDashboardService = {
  async getDashboardStats(): Promise<TraderDashboardStats> {
    const [marketStats, deals] = await Promise.all([marketIntelligenceService.getDashboardStats(), dealService.getDeals()]);

    const activeDealStatuses = ["deal_confirmed", "emd_pending", "emd_received", "purchase_order", "payment_pending", "payment_received", "dispatch_scheduled", "loading", "in_transit"];
    const myActiveDeals = deals.filter((d) => activeDealStatuses.includes(d.status)).length;
    const pendingDispatch = deals.filter((d) => d.status === "dispatch_scheduled" || d.status === "loading").length;
    const pendingPayments = deals.filter((d) => d.status === "payment_pending").length;
    const inventoryValue = deals.filter((d) => ["purchase_order", "payment_pending", "payment_received"].includes(d.status)).reduce((sum, d) => sum + d.totalValue, 0);
    const todaysProfitEstimate = Math.round(inventoryValue * 0.025);

    return delay({
      todaysMarketAverage: marketStats.averageIndiaPrice,
      lowestMillPrice: marketStats.todaysLowest,
      highestMillPrice: marketStats.todaysHighest,
      activeTenders: marketStats.tendersToday,
      offersClosingToday: marketStats.offersToday,
      myActiveDeals,
      pendingDispatch,
      pendingPayments,
      inventoryValue,
      todaysProfitEstimate,
    });
  },

  async getTraderKPI(): Promise<TraderKPI> {
    const [purchases, deals] = await Promise.all([traderPurchaseService.getPurchases(), dealService.getDeals()]);
    const today = new Date().toDateString();

    const todaysPurchases = purchases.filter((p) => new Date(p.createdAt).toDateString() === today).length;
    const nonCancelled = purchases.filter((p) => p.status !== "cancelled" && p.status !== "draft");
    const avgPrice = nonCancelled.length > 0 ? Math.round(nonCancelled.reduce((sum, p) => sum + p.rate, 0) / nonCancelled.length) : 0;
    const totalMargin = nonCancelled.reduce((sum, p) => sum + p.expectedMargin, 0);

    const openDeals = deals.filter((d) => d.status !== "closed" && d.status !== "cancelled").length;
    const pendingPayments = deals.filter((d) => d.status === "payment_pending").length;
    const pendingDeliveries = deals.filter((d) => ["dispatch_scheduled", "loading", "in_transit"].includes(d.status)).length;

    return delay({
      todaysPurchases,
      averagePurchasePrice: avgPrice,
      margin: totalMargin,
      openDeals,
      pendingPayments,
      pendingDeliveries,
    });
  },

  async getLatestOffers(limit = 8): Promise<MillPriceEntry[]> {
    const prices = await marketIntelligenceService.getLivePrices({ sort: "latest" });
    return delay(prices.filter((p) => p.offerAvailable).slice(0, limit));
  },

  async getLatestPriceChanges(limit = 6): Promise<MillPriceEntry[]> {
    const prices = await marketIntelligenceService.getLivePrices({ sort: "latest" });
    return delay([...prices].sort((a, b) => Math.abs(b.todaysPrice - b.previousPrice) - Math.abs(a.todaysPrice - a.previousPrice)).slice(0, limit));
  },

  async getNewTenders(limit = 6): Promise<MillPriceEntry[]> {
    const prices = await marketIntelligenceService.getLivePrices({ sort: "latest" });
    return delay(prices.filter((p) => p.tenderOpen).slice(0, limit));
  },

  async getTrendingGrades(): Promise<{ grade: string; priceUp: number; priceDown: number }[]> {
    const prices = await marketIntelligenceService.getLivePrices();
    const grouped = new Map<string, { up: number; down: number }>();
    prices.forEach((p) => {
      const agg = grouped.get(p.grade) ?? { up: 0, down: 0 };
      if (p.todaysPrice > p.previousPrice) agg.up += 1;
      else if (p.todaysPrice < p.previousPrice) agg.down += 1;
      grouped.set(p.grade, agg);
    });
    return delay([...grouped.entries()].map(([grade, v]) => ({ grade, priceUp: v.up, priceDown: v.down })));
  },

  async getPriceMovers(): Promise<{ biggestIncrease: MillPriceEntry | null; biggestDrop: MillPriceEntry | null }> {
    const prices = await marketIntelligenceService.getLivePrices();
    const withChange = prices.map((p) => ({ entry: p, change: p.todaysPrice - p.previousPrice }));
    const biggestIncrease = withChange.sort((a, b) => b.change - a.change)[0]?.entry ?? null;
    const biggestDrop = withChange.sort((a, b) => a.change - b.change)[0]?.entry ?? null;
    return delay({ biggestIncrease, biggestDrop });
  },

  async getBuyingOpportunities(limit = 8): Promise<BuyingOpportunity[]> {
    const [prices, marketStats] = await Promise.all([marketIntelligenceService.getLivePrices({ sort: "price-low" }), marketIntelligenceService.getDashboardStats()]);
    const offering = prices.filter((p) => p.offerAvailable);

    const opportunities: BuyingOpportunity[] = offering.map((p, i) => ({
      id: `opp-${p.millId}`,
      millId: p.millId,
      millName: p.millName,
      state: p.state,
      grade: p.grade,
      quantity: p.quantityAvailable,
      rate: p.todaysPrice,
      distanceKm: 80 + ((i * 47) % 900),
      paymentTerms: p.paymentTerms,
      expectedMargin: estimateMargin(p, marketStats.averageIndiaPrice),
    }));

    return delay(opportunities.sort((a, b) => b.expectedMargin - a.expectedMargin).slice(0, limit));
  },

  async getNotifications(): Promise<TraderNotification[]> {
    return delay([...MOCK_NOTIFICATIONS]);
  },
};
