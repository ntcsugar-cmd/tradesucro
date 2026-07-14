import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { MillPriceQuote, PriceRevision, PriceHistoryPoint } from "@/lib/types/millPricing";

const QUOTES_KEY = "tradesucro-mill-price-quotes";
const REVISIONS_KEY = "tradesucro-mill-price-revisions";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function seedQuotes(): MillPriceQuote[] {
  return PRODUCTS.slice(0, 6).map((product, i) => {
    const yesterday = 3400 + i * 45;
    const today = yesterday + [20, -15, 0, 35, -10, 5][i % 6];
    return {
      id: `pq-${i + 1}`,
      product: product.value,
      grade: QUALITY_GRADES[i % QUALITY_GRADES.length],
      todaysPrice: today,
      yesterdayPrice: yesterday,
      quantityAvailable: 200 + i * 75,
      unit: "mt",
      status: "active",
      updatedAt: new Date().toISOString(),
    };
  });
}

function seedRevisions(quotes: MillPriceQuote[]): PriceRevision[] {
  const revisions: PriceRevision[] = [];
  quotes.forEach((q, qi) => {
    for (let r = 0; r < 3; r++) {
      const old = q.yesterdayPrice - (2 - r) * 15;
      const next = old + 15;
      revisions.push({
        id: `prev-${qi}-${r}`,
        quoteId: q.id,
        product: q.product,
        revisionNo: r + 1,
        oldPrice: old,
        newPrice: next,
        difference: next - old,
        changedAt: new Date(Date.now() - (3 - r) * 3 * 60 * 60 * 1000).toISOString(),
        updatedBy: "Mill Sales Executive",
        reason: r === 2 ? "Aligning with market rate" : "Routine revision",
      });
    }
  });
  return revisions;
}

function readQuotes(): MillPriceQuote[] {
  if (typeof window === "undefined") return seedQuotes();
  try {
    const raw = window.localStorage.getItem(QUOTES_KEY);
    if (raw) return JSON.parse(raw) as MillPriceQuote[];
  } catch {
    // fall through
  }
  const seeded = seedQuotes();
  window.localStorage.setItem(QUOTES_KEY, JSON.stringify(seeded));
  window.localStorage.setItem(REVISIONS_KEY, JSON.stringify(seedRevisions(seeded)));
  return seeded;
}

function writeQuotes(quotes: MillPriceQuote[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

function readRevisions(): PriceRevision[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVISIONS_KEY);
    return raw ? (JSON.parse(raw) as PriceRevision[]) : [];
  } catch {
    return [];
  }
}

function writeRevisions(revisions: PriceRevision[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVISIONS_KEY, JSON.stringify(revisions));
}

/**
 * Mill Pricing Service (mock)
 * ------------------------------------------------------------------
 * Business Rule: "Price revision automatically creates history" —
 * updatePrice() is the only way to change todaysPrice, and it always
 * appends a PriceRevision in the same call. There is no code path that
 * changes a quote's price without a matching revision entry.
 */
export const millPricingService = {
  async getTodaysPrices(): Promise<MillPriceQuote[]> {
    return delay(readQuotes());
  },

  async updatePrice(quoteId: string, newPrice: number, reason: string): Promise<MillPriceQuote | undefined> {
    const quotes = readQuotes();
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return delay(undefined);

    const oldPrice = quote.todaysPrice;
    const updatedQuote: MillPriceQuote = {
      ...quote,
      yesterdayPrice: oldPrice,
      todaysPrice: newPrice,
      updatedAt: new Date().toISOString(),
    };
    writeQuotes(quotes.map((q) => (q.id === quoteId ? updatedQuote : q)));

    const revisions = readRevisions();
    const revisionNo = revisions.filter((r) => r.quoteId === quoteId).length + 1;
    revisions.push({
      id: `prev-${quoteId}-${Date.now()}`,
      quoteId,
      product: quote.product,
      revisionNo,
      oldPrice,
      newPrice,
      difference: newPrice - oldPrice,
      changedAt: new Date().toISOString(),
      updatedBy: "Mill Sales Executive",
      reason: reason || "Price update",
    });
    writeRevisions(revisions);

    return delay(updatedQuote, 500);
  },

  async getRevisionHistory(quoteId?: string): Promise<PriceRevision[]> {
    const all = readRevisions();
    const filtered = quoteId ? all.filter((r) => r.quoteId === quoteId) : all;
    return delay(filtered.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()));
  },

  /** Graph-ready series for a given quote — chronological, chart-library-agnostic. */
  async getPriceHistorySeries(quoteId: string): Promise<PriceHistoryPoint[]> {
    const revisions = readRevisions()
      .filter((r) => r.quoteId === quoteId)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());
    const points: PriceHistoryPoint[] = revisions.map((r) => ({ timestamp: r.changedAt, price: r.newPrice }));
    return delay(points);
  },
};
