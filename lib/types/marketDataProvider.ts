/**
 * Market Data Provider Architecture
 * ------------------------------------------------------------------
 * TradeSucro must not depend on one data source. Every market data
 * point — whether from a licensed feed, a public API, or TradeSucro's
 * own verified platform activity — is wrapped in SourcedValue, which
 * carries where it came from, when it was last refreshed, how much to
 * trust it, and whether it's been verified. Providers implement
 * MarketDataProvider and register with the provider registry
 * (services/marketDataProviders.ts); swapping or adding a live feed
 * later means writing one new provider, not touching any UI.
 */

export type DataSourceType =
  | "licensed_feed" // e.g. a paid ICE/Reuters/Bloomberg-style market data subscription
  | "public_api" // e.g. a free/public exchange rate or commodity API
  | "tradesucro_internal" // derived from TradeSucro's own verified platform activity (offers, deals, dispatches)
  | "manual_entry"; // entered/confirmed by TradeSucro staff

export type ConfidenceLevel = "high" | "medium" | "low";
export type VerificationStatus = "verified" | "unverified" | "pending_review" | "stale";

export interface DataSourceMeta {
  sourceType: DataSourceType;
  sourceName: string;
  lastUpdated: string | null;
  confidenceLevel: ConfidenceLevel;
  verificationStatus: VerificationStatus;
}

/** Wraps any market value with its provenance. `value` is null when no provider is connected yet — never a fabricated number standing in for one. */
export interface SourcedValue<T> {
  value: T | null;
  meta: DataSourceMeta;
}

export type ProviderConnectionStatus = "connected" | "not_configured" | "error";

/** What every market data provider (real or not-yet-connected) reports about itself, surfaced in the UI so it's always clear what's live and what isn't. */
export interface ProviderStatus {
  id: string;
  name: string;
  sourceType: DataSourceType;
  connectionStatus: ProviderConnectionStatus;
  coverage: string;
  lastSyncedAt: string | null;
}

/** Implemented by every data source — a real integration, or a registered-but-not-yet-connected placeholder that honestly reports not_configured instead of inventing numbers. */
export interface MarketDataProvider<T> {
  id: string;
  name: string;
  sourceType: DataSourceType;
  getStatus(): ProviderStatus;
  fetch(): Promise<SourcedValue<T>[]>;
}
