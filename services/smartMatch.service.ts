import { marketplaceService } from "./marketplace.service";
import { millOfferService } from "./millOffer.service";
import { traderResaleService } from "./traderResale.service";
import { millTenderService } from "./millTender.service";
import { getProductLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import type { MatchCandidate, MatchCriteria, MatchSourceType } from "@/lib/types/smartMatch";
import type { MarketplaceRequirement } from "@/lib/types/marketplace";

const NETWORK_DELAY_MS = 400;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Deterministic mock distance — same state as the criteria reads as "local," otherwise a stable pseudo-random spread, matching the same proxy approach used by Trader Workspace's Buying Opportunities panel. */
function estimateDistanceKm(candidateState: string, criteriaState: string | undefined, seed: number): number {
  if (criteriaState && candidateState === criteriaState) return 40 + (seed % 60);
  return 180 + ((seed * 37) % 900);
}

function creditDaysFor(paymentTermsValue: string): number {
  return PAYMENT_TERMS.find((t) => t.value === paymentTermsValue)?.creditDays ?? 0;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

interface RawCandidate {
  sourceType: MatchSourceType;
  sourceId: string;
  sourceLabel: string;
  supplierName: string;
  verified: boolean;
  rating: number;
  product: string;
  grade: string;
  state: string;
  city: string;
  price: number;
  quantityAvailable: number;
  paymentTerms: string;
  dispatchDate: string;
}

async function collectCandidates(): Promise<RawCandidate[]> {
  const [allMarketplaceOffers, millOffers, resaleOffers, tenders] = await Promise.all([
    marketplaceService.getOffers(),
    millOfferService.getOffers({ status: "published" }),
    traderResaleService.getResaleOffers({ status: "active" }),
    millTenderService.getTenders(),
  ]);

  const candidates: RawCandidate[] = [];

  allMarketplaceOffers
    .filter((o) => o.status === "active")
    .forEach((o) => {
      candidates.push({
        sourceType: "marketplace_offer",
        sourceId: o.id,
        sourceLabel: "Marketplace Offer",
        supplierName: o.company.name,
        verified: o.company.verified === "verified",
        rating: o.company.rating,
        product: o.product,
        grade: o.grade,
        state: o.dispatchFrom.state,
        city: o.dispatchFrom.city,
        price: o.price,
        quantityAvailable: o.quantity,
        paymentTerms: o.paymentTerms,
        dispatchDate: o.dispatchDate,
      });
    });

  millOffers.forEach((o) => {
    o.products.forEach((row) => {
      candidates.push({
        sourceType: "mill_offer",
        sourceId: o.id,
        sourceLabel: "Mill Offer",
        supplierName: o.millName,
        verified: true,
        rating: 4.2,
        product: row.product,
        grade: row.grade,
        state: o.state,
        city: o.city,
        price: row.basePrice,
        quantityAvailable: row.availableQuantity,
        paymentTerms: o.paymentTerms.paymentType,
        dispatchDate: o.dispatch.dispatchStartDate || o.validTill,
      });
    });
  });

  resaleOffers.forEach((o) => {
    candidates.push({
      sourceType: "resale_offer",
      sourceId: o.id,
      sourceLabel: "Trader Resale",
      supplierName: o.warehouse.replace(" Warehouse", ""),
      verified: true,
      rating: 4.4,
      product: o.product,
      grade: o.grade,
      state: "",
      city: o.warehouse,
      price: o.sellingPrice,
      quantityAvailable: o.offeredQuantity,
      paymentTerms: o.paymentTerms,
      dispatchDate: o.validTill,
    });
  });

  const awardedTenders = tenders.filter((t) => t.status === "awarded");
  for (const tender of awardedTenders) {
    const bids = await millTenderService.getBidsForTender(tender.id);
    const winner = bids.find((b) => b.status === "awarded");
    if (!winner) continue;
    tender.products.forEach((row) => {
      candidates.push({
        sourceType: "tender_award",
        sourceId: tender.id,
        sourceLabel: "Recent Tender Award (price reference)",
        supplierName: `Tender ${tender.tenderNumber}`,
        verified: winner.verified,
        rating: 4,
        product: row.product,
        grade: row.grade,
        state: "",
        city: "",
        price: winner.price,
        quantityAvailable: 0,
        paymentTerms: "",
        dispatchDate: tender.awardDate,
      });
    });
  }

  return candidates;
}

function scoreCandidate(c: RawCandidate, criteria: MatchCriteria, priceRange: { min: number; max: number }, seedIndex: number) {
  const distanceKm = estimateDistanceKm(c.state, criteria.state, seedIndex);
  const dispatchDays = Math.max(0, Math.round((new Date(c.dispatchDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const priceSpread = priceRange.max - priceRange.min || 1;
  const priceScore = c.price > 0 ? clamp(100 - ((c.price - priceRange.min) / priceSpread) * 100) : 0;
  const quantityScore = c.quantityAvailable >= criteria.quantity ? 100 : clamp((c.quantityAvailable / (criteria.quantity || 1)) * 100);
  const distanceScore = clamp(100 - (distanceKm / 1000) * 100);
  const dispatchScore = clamp(100 - dispatchDays * 4);
  const paymentScore = clamp(50 + creditDaysFor(c.paymentTerms) * 2);
  const ratingScore = clamp((c.rating / 5) * 100);
  const verificationScore = c.verified ? 100 : 40;

  const matchScore = Math.round(
    priceScore * 0.25 + quantityScore * 0.15 + distanceScore * 0.15 + dispatchScore * 0.15 + paymentScore * 0.1 + ratingScore * 0.1 + verificationScore * 0.1
  );

  const reasons: string[] = [];
  if (priceScore >= 70) reasons.push("Competitively priced");
  if (quantityScore >= 95) reasons.push("Covers full required quantity");
  if (distanceScore >= 70) reasons.push("Nearby / low freight risk");
  if (dispatchScore >= 70) reasons.push("Fast dispatch");
  if (creditDaysFor(c.paymentTerms) > 0) reasons.push(`${creditDaysFor(c.paymentTerms)}-day credit available`);
  if (c.verified) reasons.push("Verified supplier");
  if (c.rating >= 4.5) reasons.push("Highly rated supplier");
  if (c.sourceType === "tender_award") reasons.push("Recent market clearing price");
  if (reasons.length === 0) reasons.push("Matches your grade and state criteria");

  const estimatedProfitPotential = criteria.targetSellPrice
    ? (criteria.targetSellPrice - c.price) * Math.min(c.quantityAvailable || criteria.quantity, criteria.quantity)
    : 0;

  return { distanceKm, dispatchDays, matchScore, reasons, estimatedProfitPotential };
}

function matchesCriteria(c: RawCandidate, criteria: MatchCriteria): boolean {
  if (criteria.grade && c.grade !== criteria.grade) return false;
  if (criteria.state && c.state && c.state !== criteria.state) return false;
  if (criteria.maxPrice && c.price > criteria.maxPrice) return false;
  return true;
}

/**
 * Smart Match Engine Service (mock)
 * ------------------------------------------------------------------
 * No backend, no writes. Every candidate is read from an existing,
 * unmodified service (Marketplace, Mill Offer Management, Trader
 * Resale, Mill Tender Management) and scored the same way every time
 * matchCandidates() runs — the ranking is a pure function of the data,
 * never a stored value that could drift.
 */
export const smartMatchService = {
  async matchCandidates(criteria: MatchCriteria): Promise<MatchCandidate[]> {
    const raw = await collectCandidates();
    const filtered = raw.filter((c) => matchesCriteria(c, criteria));
    const prices = filtered.map((c) => c.price).filter((p) => p > 0);
    const priceRange = { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 1 };

    const scored: MatchCandidate[] = filtered.map((c, i) => {
      const { distanceKm, dispatchDays, matchScore, reasons, estimatedProfitPotential } = scoreCandidate(c, criteria, priceRange, i);
      return {
        id: `match-${c.sourceType}-${c.sourceId}-${i}`,
        sourceType: c.sourceType,
        sourceId: c.sourceId,
        sourceLabel: c.sourceLabel,
        supplierName: c.supplierName,
        verified: c.verified,
        rating: c.rating,
        product: c.product,
        grade: c.grade,
        state: c.state,
        city: c.city,
        price: c.price,
        quantityAvailable: c.quantityAvailable,
        paymentTerms: c.paymentTerms,
        dispatchDate: c.dispatchDate,
        distanceKm,
        expectedDispatchDays: dispatchDays,
        matchScore,
        matchReasons: reasons,
        estimatedProfitPotential,
      };
    });

    return delay(scored.sort((a, b) => b.matchScore - a.matchScore));
  },

  async getOpenRequirements(): Promise<MarketplaceRequirement[]> {
    const requirements = await marketplaceService.getRequirements();
    return requirements.filter((r) => r.status === "active");
  },

  labelFor(product: string): string {
    return getProductLabel(product);
  },
  paymentLabelFor(term: string): string {
    return term ? getPaymentTermLabel(term) : "—";
  },
};
