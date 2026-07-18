import { createInternalProvider } from "./internalProviderFactory";
import { marketPhase3Service } from "../marketPhase3.service";
import type { LiveMarketFeed } from "@/lib/types/marketIntelligence";

/** TradeSucro Live Market Adapter (Priority 3) — real, aggregated across every platform service (mill offers, requirements, trader offers, freight, deals). Never external data by design. */
export const tradeSucroLiveMarketAdapter = createInternalProvider<LiveMarketFeed>({
  id: "tradesucro-live-market",
  name: "TradeSucro Live Market",
  coverage: "Latest mill offers, buy requirements, trader offers, freight availability, deals, and activity across all Indian states",
  fetchFn: () => marketPhase3Service.getLiveMarketFeed(),
  countRecords: (data) => data.latestMillOffers.length + data.latestRequirements.length + data.latestTraderOffers.length + data.latestDeals.length,
});
