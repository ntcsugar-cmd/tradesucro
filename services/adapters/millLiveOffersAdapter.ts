import { createInternalProvider } from "./internalProviderFactory";
import { millOfferService } from "../millOffer.service";
import type { MillOffer } from "@/lib/types/millOffer";

/** Mill Live Offers Adapter (Priority 2) — real, live from the Mill Offer Board. No external network required. */
export const millLiveOffersAdapter = createInternalProvider<MillOffer[]>({
  id: "tradesucro-mill-offers",
  name: "Mill Live Offers (TradeSucro Mill Offer Board)",
  coverage: "Every active mill offer posted on TradeSucro",
  fetchFn: () => millOfferService.getOffers({ status: "published" }),
  countRecords: (data) => data.length,
});
