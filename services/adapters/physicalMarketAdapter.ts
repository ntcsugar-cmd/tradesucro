import { runProviderFetch, providerHistoryStore } from "../providerRuntime";
import { priceHistoryStore } from "../priceHistoryStore";
import type { MarketDataProvider, ProviderStatus, SourcedValue } from "@/lib/types/marketDataProvider";
import type { InternationalPhysicalQuote } from "@/lib/types/marketIntelligence";

const PROVIDER_ID = "physical-fob-cif";

const COUNTRIES: { country: string; basis: "FOB" | "CIF" }[] = [
  { country: "Brazil", basis: "FOB" },
  { country: "Thailand", basis: "FOB" },
  { country: "India", basis: "FOB" },
  { country: "Australia", basis: "FOB" },
  { country: "Guatemala", basis: "FOB" },
  { country: "Pakistan", basis: "FOB" },
  { country: "Dubai", basis: "CIF" },
  { country: "Sri Lanka", basis: "CIF" },
  { country: "Indonesia", basis: "CIF" },
  { country: "Malaysia", basis: "CIF" },
  { country: "East Africa", basis: "CIF" },
];

/** Real fetch implementation. Requires PHYSICAL_MARKET_API_KEY plus the provider host allowlisted in network egress settings — a licensed trade-data subscription in production, neither of which exists in this environment. */
async function fetchFromPhysicalMarketFeed(): Promise<InternationalPhysicalQuote[]> {
  const apiKey = process.env.NEXT_PUBLIC_PHYSICAL_MARKET_API_KEY;
  if (!apiKey) throw new Error("PHYSICAL_MARKET_API_KEY is not configured.");

  const response = await fetch(`https://api.tradingeconomics.com/markets/commodity/sugar?c=${apiKey}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Physical market feed responded ${response.status}`);
  const json = await response.json();

  return COUNTRIES.map((c, i) => ({
    id: `intl-${i}`,
    country: c.country,
    basis: c.basis,
    currency: "USD",
    price: Array.isArray(json) ? json.find((row: { Country?: string }) => row.Country === c.country)?.Last ?? null : null,
    change: null,
    lastUpdated: null,
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

export const physicalMarketAdapter: MarketDataProvider<InternationalPhysicalQuote[]> = {
  id: PROVIDER_ID,
  name: "International Physical Market (FOB/CIF)",
  sourceType: "licensed_feed",

  async fetch(): Promise<SourcedValue<InternationalPhysicalQuote[]>[]> {
    const result = await runProviderFetch(PROVIDER_ID, fetchFromPhysicalMarketFeed, (data) => data.length);
    const lastVerified = priceHistoryStore.getLastVerified<InternationalPhysicalQuote[]>(PROVIDER_ID);
    const value = result.succeeded ? result.data : lastVerified?.data ?? null;
    return [
      {
        value,
        meta: {
          sourceType: "licensed_feed",
          sourceName: "Physical trade data feed (export/import FOB & CIF)",
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
      name: "International Physical Market (FOB/CIF)",
      sourceType: "licensed_feed",
      connectionStatus: lastSuccess ? "connected" : classifyError(lastAttempt?.errorMessage ?? null),
      coverage: "FOB/CIF export-import quotes: Brazil, Thailand, India, Australia, Guatemala, Pakistan, Dubai, Sri Lanka, Indonesia, Malaysia, East Africa",
      lastSyncedAt: lastSuccess?.attemptedAt ?? null,
      lastAttemptAt: lastAttempt?.attemptedAt ?? null,
      consecutiveFailures,
      lastError: lastAttempt?.errorMessage ?? null,
    };
  },
};
