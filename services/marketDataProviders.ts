import { providerManager } from "./providerManager";
import type { ProviderStatus } from "@/lib/types/marketDataProvider";

/**
 * Provider Registry — now backed by the real provider adapters
 * (services/adapters/*, orchestrated by providerManager) rather than
 * a static hardcoded list. Every status reported here reflects an
 * actual fetch attempt recorded in provider history, not an assumed
 * state.
 */
export const marketDataProviderRegistry = {
  getAll(): ProviderStatus[] {
    return providerManager.getAllStatuses();
  },
  getById(id: string): ProviderStatus | undefined {
    return providerManager.getStatus(id);
  },
  /** Triggers a real refresh across every provider — safe to call repeatedly; each provider handles its own retry/backoff. */
  async refreshAll() {
    return providerManager.refreshAll();
  },
};
