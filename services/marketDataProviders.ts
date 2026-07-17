import type { ProviderStatus } from "@/lib/types/marketDataProvider";

/**
 * Provider Registry
 * ------------------------------------------------------------------
 * Every data source TradeSucro's Market Intelligence module is
 * designed to support, with its REAL current connection status. None
 * of the external providers are connected in this build — that
 * requires a licensed subscription (ICE/Reuters-class data) or a
 * paid/public API key, neither of which exists in this environment.
 * They're registered so the architecture, UI, and provider contract
 * (lib/types/marketDataProvider.ts) are all in place — connecting a
 * real feed later means writing one fetch() implementation per
 * provider here, not redesigning anything downstream.
 */
export const PROVIDER_REGISTRY: ProviderStatus[] = [
  { id: "ice-futures", name: "ICE Futures (Sugar No.11 / White Sugar No.5)", sourceType: "licensed_feed", connectionStatus: "not_configured", coverage: "Global sugar futures", lastSyncedAt: null },
  { id: "liffe-london", name: "LIFFE London White Sugar", sourceType: "licensed_feed", connectionStatus: "not_configured", coverage: "London white sugar futures", lastSyncedAt: null },
  { id: "isa-daily", name: "ISA Daily Price", sourceType: "licensed_feed", connectionStatus: "not_configured", coverage: "International Sugar Agreement daily reference price", lastSyncedAt: null },
  { id: "fx-rates", name: "Foreign Exchange Rates", sourceType: "public_api", connectionStatus: "not_configured", coverage: "USD/INR, BRL/USD", lastSyncedAt: null },
  { id: "energy-freight", name: "Energy & Freight Benchmarks", sourceType: "public_api", connectionStatus: "not_configured", coverage: "Crude oil, ethanol, Baltic Dry Index, ocean freight", lastSyncedAt: null },
  { id: "intl-physical", name: "International Physical Market Feed", sourceType: "licensed_feed", connectionStatus: "not_configured", coverage: "Export/import FOB & CIF quotes by origin country", lastSyncedAt: null },
  { id: "market-news", name: "Market News Feed", sourceType: "public_api", connectionStatus: "not_configured", coverage: "Domestic, international, policy, and weather news", lastSyncedAt: null },
  { id: "tradesucro-internal", name: "TradeSucro Platform Activity", sourceType: "tradesucro_internal", connectionStatus: "connected", coverage: "Mill offers, buy requirements, deals, dispatches, freight — India Spot Market and TradeSucro Live Market", lastSyncedAt: new Date().toISOString() },
];

export const marketDataProviderRegistry = {
  getAll(): ProviderStatus[] {
    return PROVIDER_REGISTRY;
  },
  getById(id: string): ProviderStatus | undefined {
    return PROVIDER_REGISTRY.find((p) => p.id === id);
  },
};
