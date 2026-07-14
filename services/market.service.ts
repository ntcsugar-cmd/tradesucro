import {
  tickerItems,
  marketIndices,
  sellOffers,
  buyRequirements,
  mills,
  newsItems,
  stats,
} from "@/lib/data";
import type {
  TickerItem,
  MarketIndex,
  SellOffer,
  BuyRequirement,
  Mill,
  NewsItem,
} from "@/lib/types";

/**
 * Market Service
 * ------------------------------------------------------------------
 * TradeSucro has no backend yet — every function here resolves the same
 * mock data that lib/data.ts already exported, just wrapped in a Promise.
 * The point isn't the async wrapper; it's the seam: components should
 * call `marketService.getSellOffers()`, not `import { sellOffers } from
 * "@/lib/data"` directly. When a real API exists, only this file changes
 * — every caller stays the same.
 */
export const marketService = {
  async getTickerItems(): Promise<TickerItem[]> {
    return tickerItems;
  },

  async getMarketIndices(): Promise<MarketIndex[]> {
    return marketIndices;
  },

  async getSellOffers(): Promise<SellOffer[]> {
    return sellOffers;
  },

  async getBuyRequirements(): Promise<BuyRequirement[]> {
    return buyRequirements;
  },

  async getMills(): Promise<Mill[]> {
    return mills;
  },

  async getMillById(id: string): Promise<Mill | undefined> {
    return mills.find((m) => m.id === id);
  },

  async getNews(): Promise<NewsItem[]> {
    return newsItems;
  },

  async getStats() {
    return stats;
  },
};
