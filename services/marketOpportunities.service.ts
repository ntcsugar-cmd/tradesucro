import { marketplaceService } from "./marketplace.service";
import { millOfferService } from "./millOffer.service";
import { millTenderService } from "./millTender.service";
import { traderResaleService } from "./traderResale.service";
import { marketIntelligenceService } from "./marketIntelligence.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { Opportunity } from "@/lib/types/smartMatch";

const NETWORK_DELAY_MS = 400;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysUntil(dateStr: string): number {
  return (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
}

/**
 * Market Opportunities Service (mock)
 * ------------------------------------------------------------------
 * No backend, no writes. Every opportunity is derived from existing,
 * unmodified services — this module only ranks and reframes data that
 * already exists elsewhere in the platform.
 */
export const marketOpportunitiesService = {
  async getOpportunities(): Promise<Opportunity[]> {
    const [millOffers, marketplaceOffers, tenders, resaleOffers, inventoryLots, livePrices] = await Promise.all([
      millOfferService.getOffers({ status: "published" }),
      marketplaceService.getOffers(),
      millTenderService.getTenders(),
      traderResaleService.getResaleOffers({ status: "active" }),
      traderResaleService.getInventoryLots(),
      marketIntelligenceService.getLivePrices(),
    ]);

    const opportunities: Opportunity[] = [];
    const activeMarketplaceOffers = marketplaceOffers.filter((o) => o.status === "active");

    const cheapestMillRow = millOffers
      .flatMap((o) => o.products.map((row) => ({ offer: o, row })))
      .sort((a, b) => a.row.basePrice - b.row.basePrice)[0];
    if (cheapestMillRow) {
      opportunities.push({
        id: "opp-best-buy",
        category: "best_buy",
        title: `${getProductLabel(cheapestMillRow.row.product)} ${cheapestMillRow.row.grade} from ${cheapestMillRow.offer.millName}`,
        description: `Lowest published mill price today at ${formatPricePerUnit(cheapestMillRow.row.basePrice)}.`,
        value: cheapestMillRow.row.basePrice,
        meta: formatQuantityMt(cheapestMillRow.row.availableQuantity),
        actionLabel: "View Offer",
        actionHref: `/mill-offers/${cheapestMillRow.offer.id}`,
      });
    }

    const bestRequirement = [...activeMarketplaceOffers].sort((a, b) => b.price - a.price)[0];
    if (bestRequirement) {
      opportunities.push({
        id: "opp-best-sell",
        category: "best_sell",
        title: `${getProductLabel(bestRequirement.product)} ${bestRequirement.grade} — ${bestRequirement.company.name}`,
        description: `Highest active asking price in the open marketplace today.`,
        value: bestRequirement.price,
        meta: formatQuantityMt(bestRequirement.quantity),
        actionLabel: "View Offer",
        actionHref: `/marketplace/offer/${bestRequirement.id}`,
      });
    }

    const bestMarginOffer = [...resaleOffers].sort(
      (a, b) => (b.sellingPrice - b.averageCost) / b.sellingPrice - (a.sellingPrice - a.averageCost) / a.sellingPrice
    )[0];
    if (bestMarginOffer) {
      const marginPct = ((bestMarginOffer.sellingPrice - bestMarginOffer.averageCost) / bestMarginOffer.sellingPrice) * 100;
      opportunities.push({
        id: "opp-high-margin",
        category: "high_margin",
        title: `${getProductLabel(bestMarginOffer.product)} ${bestMarginOffer.grade} · ${bestMarginOffer.offerNumber}`,
        description: `${marginPct.toFixed(1)}% margin on lot ${bestMarginOffer.lotNumber}.`,
        value: marginPct,
        meta: formatPricePerUnit(bestMarginOffer.sellingPrice - bestMarginOffer.averageCost),
        actionLabel: "View Offer",
        actionHref: `/trader/resale/${bestMarginOffer.id}`,
      });
    }

    millOffers
      .filter((o) => daysUntil(o.validTill) <= 3 && daysUntil(o.validTill) >= 0)
      .slice(0, 3)
      .forEach((o) => {
        opportunities.push({
          id: `opp-urgent-${o.id}`,
          category: "urgent_offer",
          title: `${o.millName} — Offer closing in ${Math.max(0, Math.round(daysUntil(o.validTill)))}d`,
          description: `${o.products.length} product line${o.products.length === 1 ? "" : "s"} still available.`,
          value: o.products[0]?.basePrice ?? 0,
          meta: formatQuantityMt(o.products.reduce((s, p) => s + p.availableQuantity, 0)),
          actionLabel: "View Offer",
          actionHref: `/mill-offers/${o.id}`,
        });
      });

    tenders
      .filter((t) => t.status === "published" && daysUntil(t.closingDateTime) <= 2 && daysUntil(t.closingDateTime) >= 0)
      .slice(0, 3)
      .forEach((t) => {
        opportunities.push({
          id: `opp-tender-${t.id}`,
          category: "tender_closing",
          title: `${t.tenderNumber} closing in ${Math.max(0, Math.round(daysUntil(t.closingDateTime) * 24))}h`,
          description: t.title,
          value: t.products[0]?.reservePrice ?? 0,
          meta: formatQuantityMt(t.products.reduce((s, p) => s + p.quantity, 0)),
          actionLabel: "View Tender",
          actionHref: `/mill/tenders/${t.id}`,
        });
      });

    const lotsWithOffers = new Set(resaleOffers.map((o) => o.purchaseId));
    inventoryLots
      .filter((l) => l.availableQuantity > 0 && !lotsWithOffers.has(l.purchaseId))
      .slice(0, 3)
      .forEach((l) => {
        opportunities.push({
          id: `opp-inventory-${l.purchaseId}`,
          category: "inventory_ready",
          title: `${getProductLabel(l.product)} ${l.grade} · Lot ${l.lotNumber}`,
          description: `${formatQuantityMt(l.availableQuantity)} sitting unlisted at ${l.warehouse}.`,
          value: l.averageCost,
          meta: "No active resale offer yet",
          actionLabel: "Create Resale Offer",
          actionHref: "/trader/resale/create",
        });
      });

    [...livePrices]
      .sort((a, b) => a.todaysPrice - a.previousPrice - (b.todaysPrice - b.previousPrice))
      .filter((p) => p.todaysPrice < p.previousPrice)
      .slice(0, 3)
      .forEach((p) => {
        opportunities.push({
          id: `opp-pricedrop-${p.id}`,
          category: "price_drop",
          title: `${p.millName} — ${getProductLabel(p.product)} down ${formatINR(p.previousPrice - p.todaysPrice)}`,
          description: `Now ${formatPricePerUnit(p.todaysPrice)}, was ${formatPricePerUnit(p.previousPrice)}.`,
          value: p.todaysPrice,
          meta: formatQuantityMt(p.quantityAvailable),
          actionLabel: "View Market",
          actionHref: "/market/live",
        });
      });

    return delay(opportunities);
  },
};
