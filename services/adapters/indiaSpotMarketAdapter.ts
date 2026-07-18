import { createInternalProvider } from "./internalProviderFactory";
import { marketPhase3Service } from "../marketPhase3.service";
import type { StateSpotSummary } from "@/lib/types/marketIntelligence";

/** India Spot Market Adapter (Priority 1) — real, live-aggregated from TradeSucro's own posted offers/requirements. No external network required. */
export const indiaSpotMarketAdapter = createInternalProvider<StateSpotSummary[]>({
  id: "tradesucro-india-spot",
  name: "India Spot Market (TradeSucro Live Data)",
  coverage: "State and city-level sugar spot prices, volume, active buyers/sellers",
  fetchFn: () => marketPhase3Service.getIndiaSpotMarket(),
  countRecords: (data) => data.reduce((sum, s) => sum + s.cities.length, 0),
});
