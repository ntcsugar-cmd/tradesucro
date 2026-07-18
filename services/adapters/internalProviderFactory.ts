import { runProviderFetch, providerHistoryStore } from "../providerRuntime";
import { priceHistoryStore } from "../priceHistoryStore";
import type { MarketDataProvider, ProviderStatus, SourcedValue } from "@/lib/types/marketDataProvider";

interface InternalAdapterConfig<T> {
  id: string;
  name: string;
  coverage: string;
  fetchFn: () => Promise<T>;
  countRecords: (data: T) => number;
}

/** Every TradeSucro-internal provider (India Spot Market, Mill Live Offers, TradeSucro Live Market) is built from this — same retry/history/status behavior, different underlying real data source. */
export function createInternalProvider<T>(config: InternalAdapterConfig<T>): MarketDataProvider<T> {
  return {
    id: config.id,
    name: config.name,
    sourceType: "tradesucro_internal",

    async fetch(): Promise<SourcedValue<T>[]> {
      const result = await runProviderFetch(config.id, config.fetchFn, config.countRecords);

      // Never "Not Connected": if this attempt failed, fall back to the last snapshot that genuinely succeeded, clearly marked stale rather than fresh.
      const lastVerified = priceHistoryStore.getLastVerified<T>(config.id);
      const value = result.succeeded ? result.data : lastVerified?.data ?? null;
      const effectiveLastUpdated = result.succeeded ? new Date().toISOString() : lastVerified?.capturedAt ?? null;

      return [
        {
          value,
          meta: {
            sourceType: "tradesucro_internal",
            sourceName: config.name,
            lastUpdated: effectiveLastUpdated,
            confidenceLevel: result.succeeded ? "high" : value !== null ? "medium" : "low",
            verificationStatus: result.succeeded ? "verified" : value !== null ? "stale" : "unverified",
          },
        },
      ];
    },

    getStatus(): ProviderStatus {
      const lastAttempt = providerHistoryStore.getLastAttempt(config.id);
      const lastSuccess = providerHistoryStore.getLastSuccess(config.id);
      const consecutiveFailures = providerHistoryStore.getConsecutiveFailures(config.id);
      return {
        id: config.id,
        name: config.name,
        sourceType: "tradesucro_internal",
        connectionStatus: consecutiveFailures > 0 && !lastSuccess ? "error" : "connected",
        coverage: config.coverage,
        lastSyncedAt: lastSuccess?.attemptedAt ?? null,
        lastAttemptAt: lastAttempt?.attemptedAt ?? null,
        consecutiveFailures,
        lastError: consecutiveFailures > 0 ? lastAttempt?.errorMessage ?? null : null,
      };
    },
  };
}
