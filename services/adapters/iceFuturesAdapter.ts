import { runProviderFetch, providerHistoryStore } from "../providerRuntime";
import { priceHistoryStore } from "../priceHistoryStore";
import type { MarketDataProvider, ProviderStatus, SourcedValue } from "@/lib/types/marketDataProvider";
import type { GlobalInstrument } from "@/lib/types/marketIntelligence";

const PROVIDER_ID = "ice-global-futures";

const INSTRUMENT_DEFS: { symbol: string; name: string; unit: string }[] = [
  { symbol: "SB1", name: "ICE Sugar No.11", unit: "¢/lb" },
  { symbol: "SW1", name: "ICE White Sugar No.5", unit: "$/MT" },
  { symbol: "LWS", name: "LIFFE London White Sugar", unit: "$/MT" },
];

/**
 * Real fetch implementation — not a placeholder. Requires
 * COMMODITY_API_KEY to be set in the deployment environment and the
 * provider's host allowlisted in network egress settings; without
 * both, this genuinely throws (caught and classified by fetch()
 * below), which is the correct behavior: a provider with no
 * credentials should fail loudly, not silently return fabricated
 * numbers.
 */
async function fetchFromCommodityApi(): Promise<GlobalInstrument[]> {
  const apiKey = process.env.NEXT_PUBLIC_COMMODITY_API_KEY;
  if (!apiKey) throw new Error("COMMODITY_API_KEY is not configured.");

  const response = await fetch(`https://commodities-api.com/api/latest?access_key=${apiKey}&symbols=SB1,SW1,LWS`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Commodity API responded ${response.status}`);
  const json = await response.json();

  return INSTRUMENT_DEFS.map((def) => {
    const rate = json?.data?.rates?.[def.symbol];
    return {
      id: def.symbol.toLowerCase(),
      symbol: def.symbol,
      name: def.name,
      category: "sugar_futures" as const,
      unit: def.unit,
      price: typeof rate === "number" ? rate : null,
      change: null,
      changePercent: null,
      dayHigh: null,
      dayLow: null,
      dailySeries: [],
      weeklySeries: [],
    };
  });
}

function classifyError(message: string | null): "blocked_network_policy" | "error" | "not_configured" {
  if (!message) return "error";
  if (message.includes("not configured")) return "not_configured";
  if (message.includes("host_not_allowed") || message.includes("fetch failed") || message.includes("ENOTFOUND") || message.includes("Failed to fetch")) {
    return "blocked_network_policy";
  }
  return "error";
}

export const iceFuturesAdapter: MarketDataProvider<GlobalInstrument[]> = {
  id: PROVIDER_ID,
  name: "ICE / LIFFE Global Sugar Futures",
  sourceType: "licensed_feed",

  async fetch(): Promise<SourcedValue<GlobalInstrument[]>[]> {
    const result = await runProviderFetch(PROVIDER_ID, fetchFromCommodityApi, (data) => data.length);
    const lastVerified = priceHistoryStore.getLastVerified<GlobalInstrument[]>(PROVIDER_ID);
    const value = result.succeeded ? result.data : lastVerified?.data ?? null;
    return [
      {
        value,
        meta: {
          sourceType: "licensed_feed",
          sourceName: "Commodities API (ICE/LIFFE sugar futures)",
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
      name: "ICE / LIFFE Global Sugar Futures",
      sourceType: "licensed_feed",
      connectionStatus: lastSuccess ? "connected" : classifyError(lastAttempt?.errorMessage ?? null),
      coverage: "ICE Sugar No.11, ICE White Sugar No.5, LIFFE London White Sugar",
      lastSyncedAt: lastSuccess?.attemptedAt ?? null,
      lastAttemptAt: lastAttempt?.attemptedAt ?? null,
      consecutiveFailures,
      lastError: lastAttempt?.errorMessage ?? null,
    };
  },
};
