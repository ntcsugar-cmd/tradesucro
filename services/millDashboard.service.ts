import { millOfferService } from "./millOffer.service";
import { tenderService } from "./tender.service";
import { inventoryService } from "./inventory.service";
import { dispatchService } from "./dispatch.service";
import type { MillDashboardSummary } from "@/lib/types/millOperations";

/**
 * Mill Dashboard Service (mock)
 * ------------------------------------------------------------------
 * Pure aggregation — every number here is computed by an existing
 * service (millOfferService is reused as-is, per "do not modify
 * existing Mill Offer Management"; tender/inventory/dispatch are the
 * new services this module adds). No stat is calculated twice.
 */
export const millDashboardService = {
  async getSummary(): Promise<MillDashboardSummary> {
    const [offerStats, todaysActiveTenders, totalAvailableStock, pendingDispatches] = await Promise.all([
      millOfferService.getDashboardStats(),
      tenderService.getActiveTenderCount(),
      inventoryService.getTotalAvailableStock(),
      dispatchService.getPendingDispatchCount(),
    ]);

    return {
      todaysActiveOffers: offerStats.todaysActiveOffers,
      draftOffers: offerStats.draftOffers,
      offersExpiringToday: offerStats.offersExpiringToday,
      todaysActiveTenders,
      totalAvailableStock,
      pendingDispatches,
    };
  },
};
