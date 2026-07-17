import { STATES } from "@/lib/master-data/states";
import { marketplaceService } from "./marketplace.service";
import type { GlobalInstrument, GlobalInstrumentCategory, InternationalPhysicalQuote, StateSpotSummary, CitySpotPrice } from "@/lib/types/marketIntelligence";

const NETWORK_DELAY_MS = 300;
function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const GLOBAL_INSTRUMENTS: { id: string; symbol: string; name: string; category: GlobalInstrumentCategory; unit: string }[] = [
  { id: "ice-sugar-11", symbol: "SB1", name: "ICE Sugar No.11", category: "sugar_futures", unit: "¢/lb" },
  { id: "ice-white-5", symbol: "SW1", name: "ICE White Sugar No.5", category: "sugar_futures", unit: "$/MT" },
  { id: "liffe-white", symbol: "LWS", name: "LIFFE London White Sugar", category: "sugar_futures", unit: "$/MT" },
  { id: "white-premium", symbol: "WP", name: "White Premium", category: "sugar_futures", unit: "$/MT" },
  { id: "isa-daily", symbol: "ISA", name: "ISA Daily Price", category: "sugar_futures", unit: "¢/lb" },
  { id: "usd-inr", symbol: "USDINR", name: "USD/INR", category: "fx", unit: "₹" },
  { id: "brl-usd", symbol: "BRLUSD", name: "BRL/USD", category: "fx", unit: "$" },
  { id: "crude-oil", symbol: "WTI", name: "Crude Oil", category: "energy", unit: "$/bbl" },
  { id: "ethanol", symbol: "ETH", name: "Ethanol", category: "energy", unit: "$/gal" },
  { id: "baltic-dry", symbol: "BDI", name: "Baltic Dry Index", category: "freight", unit: "pts" },
  { id: "ocean-freight", symbol: "OFR", name: "Ocean Freight", category: "freight", unit: "$/MT" },
];

const PHYSICAL_MARKET_COUNTRIES = ["Brazil", "Thailand", "India", "Australia", "Guatemala", "Pakistan", "Dubai", "Sri Lanka", "Indonesia", "Malaysia", "East Africa"];

export const marketPhase3Service = {
  // ---- Section 1: Global Market ---------------------------------------
  /** No licensed futures/FX/energy feed is connected — every instrument honestly reports null values rather than inventing prices. See services/marketDataProviders.ts for connection status. */
  async getGlobalInstruments(): Promise<GlobalInstrument[]> {
    return delay(
      GLOBAL_INSTRUMENTS.map((inst) => ({
        ...inst,
        price: null,
        change: null,
        changePercent: null,
        dayHigh: null,
        dayLow: null,
        dailySeries: [],
        weeklySeries: [],
      }))
    );
  },

  // ---- Section 2: International Physical Market ------------------------
  /** Same honesty rule — no licensed export/import quote feed connected yet. */
  async getInternationalPhysicalQuotes(): Promise<InternationalPhysicalQuote[]> {
    return delay(
      PHYSICAL_MARKET_COUNTRIES.map((country, i) => ({
        id: `intl-${i}`,
        country,
        basis: i % 2 === 0 ? "FOB" : ("CIF" as const),
        currency: "USD",
        price: null,
        change: null,
        lastUpdated: null,
      }))
    );
  },

  // ---- Section 3: India Spot Market (REAL — derived from live platform data) ----
  /** Aggregates actual live marketplace offers/requirements by state and city into a spot-price view — TradeSucro's own verified activity, not a licensed feed. */
  async getIndiaSpotMarket(): Promise<StateSpotSummary[]> {
    const offers = await marketplaceService.getOffers({ sort: "newest" });
    const requirements = await marketplaceService.getRequirements({ sort: "newest" });

    const byStateCity = new Map<string, { state: string; city: string; prices: number[]; volume: number; buyers: Set<string>; sellers: Set<string> }>();

    offers.forEach((o) => {
      const key = `${o.dispatchFrom.state}__${o.dispatchFrom.city}`;
      const entry = byStateCity.get(key) ?? { state: o.dispatchFrom.state, city: o.dispatchFrom.city, prices: [], volume: 0, buyers: new Set<string>(), sellers: new Set<string>() };
      entry.prices.push(o.price);
      entry.volume += o.quantity;
      entry.sellers.add(o.company.name);
      byStateCity.set(key, entry);
    });
    requirements.forEach((r) => {
      const key = `${r.destination.state}__${r.destination.city}`;
      const entry = byStateCity.get(key) ?? { state: r.destination.state, city: r.destination.city, prices: [], volume: 0, buyers: new Set<string>(), sellers: new Set<string>() };
      entry.buyers.add(r.company.name);
      byStateCity.set(key, entry);
    });

    const cityEntries: CitySpotPrice[] = [...byStateCity.values()]
      .filter((e) => e.prices.length > 0)
      .map((e) => {
        const spotPrice = Math.round(e.prices.reduce((s, p) => s + p, 0) / e.prices.length);
        // Directional trend from the split between the two halves of the actual posted-price sample — a real signal derived from live data, not a random number.
        const mid = Math.floor(e.prices.length / 2) || 1;
        const recentAvg = e.prices.slice(0, mid).reduce((s, p) => s + p, 0) / mid;
        const olderAvg = e.prices.slice(mid).reduce((s, p) => s + p, 0) / (e.prices.length - mid || 1);
        const priceChange = Math.round(recentAvg - olderAvg);
        return {
          state: e.state,
          city: e.city,
          spotPrice,
          priceChange,
          volumeMt: Math.round(e.volume),
          activeBuyers: e.buyers.size,
          activeSellers: e.sellers.size,
          trend: (priceChange > 15 ? "up" : priceChange < -15 ? "down" : "flat") as CitySpotPrice["trend"],
        };
      });

    const byState = new Map<string, CitySpotPrice[]>();
    cityEntries.forEach((c) => {
      const list = byState.get(c.state) ?? [];
      list.push(c);
      byState.set(c.state, list);
    });

    return delay(
      STATES.map((s) => s.value)
        .filter((state) => byState.has(state))
        .map((state) => {
          const cities = (byState.get(state) ?? []).sort((a, b) => b.volumeMt - a.volumeMt);
          const averagePrice = Math.round(cities.reduce((sum, c) => sum + c.spotPrice, 0) / cities.length);
          const priceChange = Math.round(cities.reduce((sum, c) => sum + c.priceChange, 0) / cities.length);
          return { state, averagePrice, priceChange, totalVolumeMt: cities.reduce((sum, c) => sum + c.volumeMt, 0), cities };
        })
        .sort((a, b) => b.totalVolumeMt - a.totalVolumeMt)
    );
  },
};
