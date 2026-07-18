import { indiaSpotMarketAdapter } from "./adapters/indiaSpotMarketAdapter";
import { millLiveOffersAdapter } from "./adapters/millLiveOffersAdapter";
import { tradeSucroLiveMarketAdapter } from "./adapters/tradeSucroLiveMarketAdapter";
import { iceFuturesAdapter } from "./adapters/iceFuturesAdapter";
import { fxEnergyFreightAdapter } from "./adapters/fxEnergyFreightAdapter";
import { physicalMarketAdapter } from "./adapters/physicalMarketAdapter";
import type { ProviderStatus } from "@/lib/types/marketDataProvider";

/**
 * Provider Manager
 * ------------------------------------------------------------------
 * "Never stop updating the market because one source fails" — the
 * only way to guarantee that is to run every provider through
 * Promise.allSettled, never Promise.all. A rejected promise from one
 * adapter (e.g. iceFuturesAdapter's genuine network-policy failure)
 * cannot take down indiaSpotMarketAdapter's real, successful fetch —
 * they're isolated from each other by construction, not by
 * convention.
 */
const ALL_PROVIDERS = [indiaSpotMarketAdapter, millLiveOffersAdapter, tradeSucroLiveMarketAdapter, iceFuturesAdapter, fxEnergyFreightAdapter, physicalMarketAdapter];

export const providerManager = {
  /** Triggers every registered provider's fetch() concurrently. Providers that fail are recorded (see providerRuntime history) but never block the others. */
  async refreshAll(): Promise<{ providerId: string; succeeded: boolean }[]> {
    const results = await Promise.allSettled(ALL_PROVIDERS.map((p) => p.fetch()));
    return results.map((r, i) => ({
      providerId: ALL_PROVIDERS[i].id,
      succeeded: r.status === "fulfilled" && r.value.some((v) => v.value !== null),
    }));
  },

  /** Live status for every registered provider — this is what "display live status" renders. */
  getAllStatuses(): ProviderStatus[] {
    return ALL_PROVIDERS.map((p) => p.getStatus());
  },

  getStatus(providerId: string): ProviderStatus | undefined {
    return ALL_PROVIDERS.find((p) => p.id === providerId)?.getStatus();
  },
};
