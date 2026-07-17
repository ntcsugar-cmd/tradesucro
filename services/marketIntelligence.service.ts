import { MILLS } from "@/lib/master-data/mills";
import { STATES } from "@/lib/master-data/states";
import { PRODUCTS } from "@/lib/master-data/products";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type {
  MillPriceEntry,
  LivePriceFilters,
  MarketDashboardStats,
  TrendWindow,
  TrendPoint,
  GradeTrend,
  MarketFeedEvent,
  MarketFeedEventType,
  StateHeatMapEntry,
  AlertRule,
  AlertNotification,
  MarketNewsItem,
  MarketNewsCategory,
  MarketSearchResults,
} from "@/lib/types/marketIntelligence";

const ALERTS_KEY = "tradesucro-market-alert-rules";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Live prices — one entry per mill, across all 50 mills               */
/* ------------------------------------------------------------------ */

function generateLivePrices(): MillPriceEntry[] {
  const entries: MillPriceEntry[] = [];

  MILLS.forEach((mill, mi) => {
    const grade = QUALITY_GRADES[mi % QUALITY_GRADES.length];
    const product = PRODUCTS[mi % PRODUCTS.length];
    const paymentTerm = PAYMENT_TERMS[mi % PAYMENT_TERMS.length];
    const basePrice = 3400 + ((mi * 47) % 900);
    const change = [-40, -20, -10, 0, 10, 20, 35, 50][mi % 8];
    const previousPrice = basePrice - change;

    entries.push({
      id: `mp-${mill.id}`,
      millId: mill.id,
      millName: mill.name,
      state: mill.state,
      grade,
      product: product.value,
      todaysPrice: basePrice,
      previousPrice,
      timeUpdated: hoursAgo(mi % 12),
      offerAvailable: mi % 3 !== 0,
      tenderOpen: mi % 5 === 0,
      quantityAvailable: 100 + ((mi * 37) % 900),
      dispatchDate: daysFromNow(2 + (mi % 15)),
      paymentTerms: paymentTerm.value,
    });
  });

  return entries;
}

const LIVE_PRICES: MillPriceEntry[] = generateLivePrices();

/* ------------------------------------------------------------------ */
/* Trends — synthetic but stable per-day series                        */
/* ------------------------------------------------------------------ */

function generateTrendSeries(days: number, baseline: number, volatility: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const wobble = Math.sin(i * 0.6) * volatility + ((i * 13) % volatility) - volatility / 2;
    const price = Math.max(3000, baseline + wobble);
    const d = new Date();
    d.setDate(d.getDate() - i);
    points.push({ date: d.toISOString(), averagePrice: Math.round(price) });
  }
  return points;
}

/* ------------------------------------------------------------------ */
/* Market feed                                                         */
/* ------------------------------------------------------------------ */

const FEED_TEMPLATES: { type: MarketFeedEventType; describe: (mill: string) => string }[] = [
  { type: "price_revised", describe: (m) => `${m} revised their price` },
  { type: "new_offer", describe: (m) => `${m} posted a new sell offer` },
  { type: "tender_published", describe: (m) => `${m} published a new tender` },
  { type: "tender_closed", describe: (m) => `${m}'s tender closed for bidding` },
  { type: "tender_awarded", describe: (m) => `${m} awarded their tender` },
  { type: "dispatch_update", describe: (m) => `${m} logged a dispatch update` },
];

function generateFeed(count: number): MarketFeedEvent[] {
  return Array.from({ length: count }).map((_, i) => {
    const mill = MILLS[i % MILLS.length];
    const template = FEED_TEMPLATES[i % FEED_TEMPLATES.length];
    return {
      id: `mf-${i}`,
      type: template.type,
      millName: mill.name,
      state: mill.state,
      description: template.describe(mill.name),
      timestamp: hoursAgo(i * 2),
    };
  });
}

const MARKET_FEED: MarketFeedEvent[] = generateFeed(40);

/* ------------------------------------------------------------------ */
/* News                                                                 */
/* ------------------------------------------------------------------ */

const MARKET_NEWS: MarketNewsItem[] = [
  { id: "news-1", category: "government", headline: "Food ministry reviews sugar export quota ahead of new season", summary: "A revised export ceiling is under discussion as mills report stronger cane yields across Maharashtra and Karnataka.", date: "9 Jul 2026" },
  { id: "news-2", category: "export_policy", headline: "Export-grade demand strengthens from West Asia", summary: "ICUMSA 45 shipments from Gujarat ports rose for a third straight month, led by UAE and Saudi buyers.", date: "8 Jul 2026" },
  { id: "news-3", category: "import_policy", headline: "Import duty structure under review for refined sugar", summary: "A parliamentary committee is examining the current duty slab ahead of the next trade policy cycle.", date: "7 Jul 2026" },
  { id: "news-4", category: "industry", headline: "Domestic prices firm up on festive-season demand", summary: "S30 and M30 grades gained through the week as bulk buyers front-loaded orders.", date: "6 Jul 2026" },
  { id: "news-5", category: "weather", headline: "Above-average rainfall lifts yield outlook for 2026–27", summary: "Meteorological data points to a stronger cane crop across UP and Maharashtra this season.", date: "5 Jul 2026" },
  { id: "news-6", category: "production", headline: "Crushing capacity utilisation up 6% year-on-year", summary: "Mills across the top five producing states report higher daily crushing throughput.", date: "4 Jul 2026" },
  { id: "news-7", category: "ethanol", headline: "Ethanol blending target revision could reshape cane allocation", summary: "A higher blending target may shift more cane toward ethanol, tightening sugar supply projections.", date: "3 Jul 2026" },
  { id: "news-8", category: "government", headline: "State advises mills on cane price arrears clearance", summary: "A fresh directive asks mills to clear pending cane price arrears before the new crushing season opens.", date: "2 Jul 2026" },
];

/* ------------------------------------------------------------------ */
/* Alerts (localStorage-backed — the only mutable part of this module) */
/* ------------------------------------------------------------------ */

function readAlertRules(): AlertRule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ALERTS_KEY);
    return raw ? (JSON.parse(raw) as AlertRule[]) : [];
  } catch {
    return [];
  }
}

function writeAlertRules(rules: AlertRule[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ALERTS_KEY, JSON.stringify(rules));
}

const MOCK_ALERT_NOTIFICATIONS: AlertNotification[] = [
  { id: "an-1", ruleId: "seed", title: "Price target reached", description: "S-30 in Maharashtra crossed your target of ₹3,800/QTL.", timestamp: "15 min ago", read: false },
  { id: "an-2", ruleId: "seed", title: "New tender published", description: "Godavari Sugarcane Co. published a new tender in Karnataka.", timestamp: "1 hr ago", read: false },
  { id: "an-3", ruleId: "seed", title: "Offer closing soon", description: "An offer you're watching in Uttar Pradesh closes in 3 hours.", timestamp: "2 hr ago", read: true },
];

/* ------------------------------------------------------------------ */

function matchesFilters(entry: MillPriceEntry, filters: LivePriceFilters): boolean {
  if (filters.state && entry.state !== filters.state) return false;
  if (filters.millId && entry.millId !== filters.millId) return false;
  if (filters.grade && entry.grade !== filters.grade) return false;
  if (filters.minPrice != null && entry.todaysPrice < filters.minPrice) return false;
  if (filters.maxPrice != null && entry.todaysPrice > filters.maxPrice) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!`${entry.millName} ${entry.state} ${entry.grade}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

function sortEntries(entries: MillPriceEntry[], sort: LivePriceFilters["sort"]): MillPriceEntry[] {
  const copy = [...entries];
  switch (sort) {
    case "price-low":
      return copy.sort((a, b) => a.todaysPrice - b.todaysPrice);
    case "price-high":
      return copy.sort((a, b) => b.todaysPrice - a.todaysPrice);
    case "latest":
    default:
      return copy.sort((a, b) => new Date(b.timeUpdated).getTime() - new Date(a.timeUpdated).getTime());
  }
}

/**
 * Market Intelligence Service (mock)
 * ------------------------------------------------------------------
 * No backend. Fully self-contained — generated from Master Data only,
 * with zero imports from Marketplace, Mill Portal, or Tender
 * Management services, per the "do not modify" list on this module.
 */
export const marketIntelligenceService = {
  async getLivePrices(filters: LivePriceFilters = {}): Promise<MillPriceEntry[]> {
    const filtered = LIVE_PRICES.filter((e) => matchesFilters(e, filters));
    return delay(sortEntries(filtered, filters.sort ?? "latest"));
  },

  async getDashboardStats(): Promise<MarketDashboardStats> {
    const prices = LIVE_PRICES.map((e) => e.todaysPrice);
    const average = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);

    const stateCounts = new Map<string, number>();
    const millActivity = new Map<string, number>();
    LIVE_PRICES.forEach((e) => {
      stateCounts.set(e.state, (stateCounts.get(e.state) ?? 0) + 1);
      millActivity.set(e.millName, (millActivity.get(e.millName) ?? 0) + (e.offerAvailable ? 1 : 0) + (e.tenderOpen ? 1 : 0));
    });
    const mostActiveState = [...stateCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    const mostActiveMill = [...millActivity.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

    return delay({
      averageIndiaPrice: average,
      todaysHighest: Math.max(...prices),
      todaysLowest: Math.min(...prices),
      mostActiveState: STATES.find((s) => s.value === mostActiveState)?.label ?? mostActiveState,
      mostActiveMill,
      offersToday: LIVE_PRICES.filter((e) => e.offerAvailable).length,
      tendersToday: LIVE_PRICES.filter((e) => e.tenderOpen).length,
      priceUpCount: LIVE_PRICES.filter((e) => e.todaysPrice > e.previousPrice).length,
      priceDownCount: LIVE_PRICES.filter((e) => e.todaysPrice < e.previousPrice).length,
    });
  },

  async getTrend(window: TrendWindow): Promise<TrendPoint[]> {
    return delay(generateTrendSeries(window, 3750, 60));
  },

  async getGradeTrends(window: TrendWindow): Promise<GradeTrend[]> {
    const trends = QUALITY_GRADES.map((grade, i) => ({
      grade,
      points: generateTrendSeries(window, 3650 + i * 90, 50 + i * 10),
    }));
    return delay(trends);
  },

  async compareMills(millIds: string[]): Promise<MillPriceEntry[]> {
    return delay(LIVE_PRICES.filter((e) => millIds.includes(e.millId)));
  },

  async getMarketFeed(limit = 40): Promise<MarketFeedEvent[]> {
    return delay(MARKET_FEED.slice(0, limit));
  },

  async getHeatMap(): Promise<StateHeatMapEntry[]> {
    const grouped = new Map<string, MillPriceEntry[]>();
    LIVE_PRICES.forEach((e) => {
      grouped.set(e.state, [...(grouped.get(e.state) ?? []), e]);
    });

    const entries: StateHeatMapEntry[] = [...grouped.entries()].map(([state, list]) => {
      const prices = list.map((e) => e.todaysPrice);
      return {
        state: STATES.find((s) => s.value === state)?.label ?? state,
        averagePrice: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
        highest: Math.max(...prices),
        lowest: Math.min(...prices),
        millCount: list.length,
        offers: list.filter((e) => e.offerAvailable).length,
        tenders: list.filter((e) => e.tenderOpen).length,
      };
    });

    return delay(entries.sort((a, b) => b.millCount - a.millCount));
  },

  async getNews(category?: MarketNewsCategory): Promise<MarketNewsItem[]> {
    return delay(category ? MARKET_NEWS.filter((n) => n.category === category) : MARKET_NEWS);
  },

  async getAlertRules(): Promise<AlertRule[]> {
    return delay(readAlertRules());
  },

  async createAlertRule(rule: Omit<AlertRule, "id" | "createdAt" | "active">): Promise<AlertRule> {
    const created: AlertRule = { channels: ["push"], ...rule, id: `alert-${Date.now()}`, active: true, createdAt: new Date().toISOString() };
    writeAlertRules([created, ...readAlertRules()]);
    return delay(created, 400);
  },

  async toggleAlertRule(id: string, active: boolean): Promise<AlertRule | undefined> {
    const rules = readAlertRules();
    const rule = rules.find((r) => r.id === id);
    if (!rule) return delay(undefined);
    const updated = { ...rule, active };
    writeAlertRules(rules.map((r) => (r.id === id ? updated : r)));
    return delay(updated, 300);
  },

  async deleteAlertRule(id: string): Promise<void> {
    writeAlertRules(readAlertRules().filter((r) => r.id !== id));
    return delay(undefined, 300);
  },

  async getAlertNotifications(): Promise<AlertNotification[]> {
    return delay(MOCK_ALERT_NOTIFICATIONS);
  },

  async search(query: string): Promise<MarketSearchResults> {
    const q = query.toLowerCase().trim();
    if (!q) return delay({ mills: [], states: [], grades: [], tenders: [], offers: [] });

    const mills = MILLS.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 5).map((m) => ({ id: m.id, label: m.name }));
    const states = STATES.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 5).map((s) => ({ value: s.value, label: s.label }));
    const grades = QUALITY_GRADES.filter((g) => g.toLowerCase().includes(q));
    const tenders = LIVE_PRICES.filter((e) => e.tenderOpen && e.millName.toLowerCase().includes(q))
      .slice(0, 5)
      .map((e) => ({ number: `TND-${e.millId.toUpperCase()}`, millName: e.millName }));
    const offers = LIVE_PRICES.filter((e) => e.offerAvailable && e.millName.toLowerCase().includes(q))
      .slice(0, 5)
      .map((e) => ({ number: `OFF-${e.millId.toUpperCase()}`, millName: e.millName }));

    return delay({ mills, states, grades, tenders, offers });
  },

  async getAllMills() {
    return delay(MILLS);
  },
};
