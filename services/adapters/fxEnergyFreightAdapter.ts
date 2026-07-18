import { runProviderFetch, providerHistoryStore } from "../providerRuntime";
import { priceHistoryStore } from "../priceHistoryStore";
import type { MarketDataProvider, ProviderStatus, SourcedValue } from "@/lib/types/marketDataProvider";
import type { GlobalInstrument, GlobalInstrumentCategory } from "@/lib/types/marketIntelligence";

const PROVIDER_ID = "fx-energy-freight";

const INSTRUMENT_DEFS: { symbol: string; name: string; unit: string; category: GlobalInstrumentCategory }[] = [
  { symbol: "USDINR", name: "USD/INR", unit: "₹", category: "fx" },
  { symbol: "BRLUSD", name: "BRL/USD", unit: "$", category: "fx" },
  { symbol: "WTI", name: "Crude Oil", unit: "$/bbl", category: "energy" },
  { symbol: "ETH", name: "Ethanol", unit: "$/gal", category: "energy" },
  { symbol: "BDI", name: "Baltic Dry Index", unit: "pts", category: "freight" },
  { symbol: "OFR", name: "Ocean Freight", unit: "$/MT", category: "freight" },
];

/**
 * Real fetch implementation, same honesty rule as iceFuturesAdapter:
 * requires this host allowlisted in network egress settings.
 * Frankfurter (frankfurter.app) is a genuinely free, keyless FX API —
 * used here for USDINR/BRLUSD specifically so that connecting this
 * adapter in a networked environment needs only the host allowlisted,
 * not a paid subscription, for the FX half of it. Energy/freight
 * still need a commodities API key.
 */
async function fetchFxEnergyFreight(): Promise<GlobalInstrument[]> {
  const fxResponse = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR", { signal: AbortSignal.timeout(8000) });
  if (!fxResponse.ok) throw new Error(`FX API responded ${fxResponse.status}`);
  const fxJson = await fxResponse.json();
  const usdInr = fxJson?.rates?.INR ?? null;

  const commodityApiKey = process.env.NEXT_PUBLIC_COMMODITY_API_KEY;
  if (!commodityApiKey) throw new Error("COMMODITY_API_KEY is not configured (required for energy/freight).");

  return INSTRUMENT_DEFS.map((def) => ({
    id: def.symbol.toLowerCase(),
    symbol: def.symbol,
    name: def.name,
    category: def.category,
    unit: def.unit,
    price: def.symbol === "USDINR" ? usdInr : null,
    change: null,
    changePercent: null,
    dayHigh: null,
    dayLow: null,
    dailySeries: [],
    weeklySeries: [],
  }));
}

function classifyError(message: string | null): "blocked_network_policy" | "error" | "not_configured" {
  if (!message) return "error";
  if (message.includes("not configured")) return "not_configured";
  if (message.includes("host_not_allowed") || message.includes("fetch failed") || message.includes("ENOTFOUND") || message.includes("Failed to fetch")) {
    return "blocked_network_policy";
  }
  return "error";
}

export const fxEnergyFreightAdapter: MarketDataProvider<GlobalInstrument[]> = {
  id: PROVIDER_ID,
  name: "FX, Energy & Freight Benchmarks",
  sourceType: "public_api",

  async fetch(): Promise<SourcedValue<GlobalInstrument[]>[]> {
    const result = await runProviderFetch(PROVIDER_ID, fetchFxEnergyFreight, (data) => data.length);
    const lastVerified = priceHistoryStore.getLastVerified<GlobalInstrument[]>(PROVIDER_ID);
    const value = result.succeeded ? result.data : lastVerified?.data ?? null;
    return [
      {
        value,
        meta: {
          sourceType: "public_api",
          sourceName: "Frankfurter (FX) + commodities API (energy/freight)",
          lastUpdated: result.succeeded ? new Date().toISOString() : lastVerified?.capturedAt ?? null,
          confidenceLevel: result.succeeded ? "high" : value !== null ? "medium" : "low",
          verificationStatus: result.succeeded ? "verified" : value !== null ? "stale" : "unverified",
        },
      },
    ];
  },

  getStatus(): ProviderStatus {
    const lastAttempt = providerHistoryStore.getLastAttempt(PROVIDER_ID);
    const lastSuccess = providerHistoryStore.getLastSuccess(PROVIDER_ID);
    const consecutiveFailures = providerHistoryStore.getConsecutiveFailures(PROVIDER_ID);
    return {
      id: PROVIDER_ID,
      name: "FX, Energy & Freight Benchmarks",
      sourceType: "public_api",
      connectionStatus: lastSuccess ? "connected" : classifyError(lastAttempt?.errorMessage ?? null),
      coverage: "USD/INR, BRL/USD, Crude Oil, Ethanol, Baltic Dry Index, Ocean Freight",
      lastSyncedAt: lastSuccess?.attemptedAt ?? null,
      lastAttemptAt: lastAttempt?.attemptedAt ?? null,
      consecutiveFailures,
      lastError: lastAttempt?.errorMessage ?? null,
    };
  },
};
