import { millOfferService } from "./millOffer.service";
import { marketIntelligenceService } from "./marketIntelligence.service";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import { computeLandedCost, computeParity, computeCommercialScore } from "@/lib/types/commercial";
import type {
  LandedCostInputs,
  LandedCostBreakdown,
  ParityInputs,
  ParityAnalysis,
  SupplierComparisonRow,
  CommercialOpportunity,
  ParityDashboardStats,
} from "@/lib/types/commercial";
import type { MillOffer } from "@/lib/types/millOffer";

const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function creditDaysFor(paymentTermsValue: string): number {
  return PAYMENT_TERMS.find((t) => t.value === paymentTermsValue)?.creditDays ?? 0;
}

function estimateCostComponents(offer: MillOffer, rowIndex: number, seed: number) {
  const basePrice = offer.products[rowIndex]?.basePrice ?? 0;
  const freightPerUnit = 35 + ((seed * 7) % 40);
  const insurancePerUnit = Math.round(basePrice * 0.001) || 3;
  const loadingChargesPerUnit = 12 + (seed % 8);
  const brokeragePerUnit = offer.paymentTerms.paymentType ? Math.round(basePrice * 0.004) : 0;
  const handlingChargesPerUnit = 8 + (seed % 6);
  return { freightPerUnit, insurancePerUnit, loadingChargesPerUnit, brokeragePerUnit, handlingChargesPerUnit };
}

function qualityAndTrustFor(seed: number): { qualityRating: number; trustScore: number } {
  const qualityRating = [3.8, 4, 4.2, 4.4, 4.6, 4.8, 5][seed % 7];
  const trustScore = [3.5, 4, 4.3, 4.6, 4.8, 5][seed % 6];
  return { qualityRating, trustScore };
}

interface OfferRow {
  offer: MillOffer;
  rowIndex: number;
  seed: number;
}

async function collectPublishedOfferRows(grade?: string): Promise<OfferRow[]> {
  const offers = await millOfferService.getOffers({ status: "published" });
  const rows: OfferRow[] = [];
  offers.forEach((offer, oi) => {
    offer.products.forEach((row, ri) => {
      if (grade && row.grade !== grade) return;
      rows.push({ offer, rowIndex: ri, seed: oi * 7 + ri * 3 + 1 });
    });
  });
  return rows;
}

/**
 * Commercial Decision Engine Service (mock)
 * ------------------------------------------------------------------
 * No backend, no writes. Every figure is either read from an existing
 * service (millOfferService, marketIntelligenceService, both
 * unmodified) or computed by the pure functions in
 * lib/types/commercial.ts — this file only assembles the two.
 */
export const commercialDecisionService = {
  calculateLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
    return computeLandedCost(inputs);
  },

  async calculateParity(inputs: ParityInputs, thresholdPercent = 8): Promise<{ analysis: ParityAnalysis; belowThreshold: boolean }> {
    const analysis = computeParity(inputs);
    return delay({ analysis, belowThreshold: analysis.marginPercent < thresholdPercent });
  },

  async getOffersForPicker(): Promise<MillOffer[]> {
    return delay(await millOfferService.getOffers({ status: "published" }));
  },

  async getMarketAverageFreight(): Promise<number> {
    return delay(45);
  },

  async getSupplierComparison(grade?: string, requiredQuantity = 100): Promise<SupplierComparisonRow[]> {
    const rows = await collectPublishedOfferRows(grade);
    if (rows.length === 0) return delay([]);

    const prices = rows.map((r) => r.offer.products[r.rowIndex].basePrice);
    const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
    const freightEstimates = rows.map((r) => estimateCostComponents(r.offer, r.rowIndex, r.seed).freightPerUnit);
    const freightRange = { min: Math.min(...freightEstimates), max: Math.max(...freightEstimates) };

    const comparisonRows: SupplierComparisonRow[] = rows.map(({ offer, rowIndex, seed }) => {
      const product = offer.products[rowIndex];
      const costs = estimateCostComponents(offer, rowIndex, seed);
      const landedCost = computeLandedCost({
        exMillPrice: product.basePrice,
        quantity: product.availableQuantity,
        freightPerUnit: costs.freightPerUnit,
        insurancePerUnit: costs.insurancePerUnit,
        loadingChargesPerUnit: costs.loadingChargesPerUnit,
        brokeragePerUnit: costs.brokeragePerUnit,
        handlingChargesPerUnit: costs.handlingChargesPerUnit,
        taxesPerUnit: 0,
      });
      const { qualityRating, trustScore } = qualityAndTrustFor(seed);
      const dispatchDays = offer.dispatch.liftingPeriodDays || 7;
      const creditDays = creditDaysFor(offer.paymentTerms.paymentType);

      const { score, breakdown } = computeCommercialScore({
        exMillPrice: product.basePrice,
        priceRange,
        freightPerUnit: costs.freightPerUnit,
        freightRange,
        qualityRating,
        trustScore,
        dispatchDays,
        creditDays,
        quantityAvailable: product.availableQuantity,
        requiredQuantity,
      });

      const marketReferencePrice = priceRange.max;
      const expectedMargin = (marketReferencePrice - landedCost.totalLandedCostPerUnit) * Math.min(product.availableQuantity, requiredQuantity);

      return {
        id: `cmp-${offer.id}-${rowIndex}`,
        offerId: offer.id,
        supplierName: offer.millName,
        millName: offer.millName,
        state: offer.state,
        city: offer.city,
        grade: product.grade,
        product: product.product,
        exMillPrice: product.basePrice,
        freight: costs.freightPerUnit,
        insurance: costs.insurancePerUnit,
        brokerage: costs.brokeragePerUnit,
        totalLandedCost: landedCost.totalLandedCostPerUnit,
        dispatchDays,
        qualityRating,
        trustScore,
        paymentTerms: offer.paymentTerms.paymentType,
        quantityAvailable: product.availableQuantity,
        expectedMargin,
        commercialScore: score,
        scoreBreakdown: breakdown,
        overallRank: 0,
      };
    });

    const ranked = comparisonRows.sort((a, b) => b.commercialScore - a.commercialScore || a.totalLandedCost - b.totalLandedCost);
    ranked.forEach((row, i) => (row.overallRank = i + 1));

    return delay(ranked);
  },

  async getParityDashboardStats(): Promise<ParityDashboardStats> {
    const [comparison, marketStats] = await Promise.all([commercialDecisionService.getSupplierComparison(), marketIntelligenceService.getDashboardStats()]);
    if (comparison.length === 0) {
      return delay({ todaysAverageParity: 0, highestMargin: 0, lowestMargin: 0, topBuyingOpportunity: "—", topSellingOpportunity: "—", nearbySuppliers: 0 });
    }

    const margins = comparison.map((r) => r.expectedMargin);
    const bestBuy = [...comparison].sort((a, b) => a.totalLandedCost - b.totalLandedCost)[0];

    return delay({
      todaysAverageParity: Math.round(comparison.reduce((s, r) => s + r.totalLandedCost, 0) / comparison.length),
      highestMargin: Math.max(...margins),
      lowestMargin: Math.min(...margins),
      topBuyingOpportunity: `${bestBuy.millName} — ${getProductLabel(bestBuy.product)} ${bestBuy.grade}`,
      topSellingOpportunity: `${formatINR(marketStats.todaysHighest)} in ${marketStats.mostActiveState}`,
      nearbySuppliers: comparison.filter((r) => r.freight <= 50).length,
    });
  },

  async getOpportunities(): Promise<CommercialOpportunity[]> {
    const comparison = await commercialDecisionService.getSupplierComparison();
    if (comparison.length === 0) return delay([]);

    const opportunities: CommercialOpportunity[] = [];

    const bestBuy = [...comparison].sort((a, b) => a.exMillPrice - b.exMillPrice)[0];
    opportunities.push({
      id: "opp-best-buy",
      category: "best_buy",
      title: `${bestBuy.millName} — ${getProductLabel(bestBuy.product)} ${bestBuy.grade}`,
      description: `Lowest ex-mill price today at ${formatPricePerUnit(bestBuy.exMillPrice)}.`,
      value: bestBuy.exMillPrice,
      meta: formatQuantityMt(bestBuy.quantityAvailable),
      href: `/mill-offers/${bestBuy.offerId}`,
    });

    const bestMargin = [...comparison].sort((a, b) => b.expectedMargin - a.expectedMargin)[0];
    opportunities.push({
      id: "opp-best-margin",
      category: "best_margin",
      title: `${bestMargin.millName} — ${getProductLabel(bestMargin.product)} ${bestMargin.grade}`,
      description: `Highest expected margin at today's market reference price.`,
      value: bestMargin.expectedMargin,
      meta: `Score ${bestMargin.commercialScore}/100`,
      href: `/mill-offers/${bestMargin.offerId}`,
    });

    const cheapestLanded = [...comparison].sort((a, b) => a.totalLandedCost - b.totalLandedCost)[0];
    opportunities.push({
      id: "opp-cheapest-landed",
      category: "cheapest_landed_cost",
      title: `${cheapestLanded.millName} — ${getProductLabel(cheapestLanded.product)} ${cheapestLanded.grade}`,
      description: `Lowest all-in landed cost per quintal across every published offer.`,
      value: cheapestLanded.totalLandedCost,
      meta: formatQuantityMt(cheapestLanded.quantityAvailable),
      href: `/mill-offers/${cheapestLanded.offerId}`,
    });

    const fastestDispatch = [...comparison].sort((a, b) => a.dispatchDays - b.dispatchDays)[0];
    opportunities.push({
      id: "opp-fastest-dispatch",
      category: "fastest_dispatch",
      title: `${fastestDispatch.millName} — ${getProductLabel(fastestDispatch.product)} ${fastestDispatch.grade}`,
      description: `Lifting period of just ${fastestDispatch.dispatchDays} days.`,
      value: fastestDispatch.dispatchDays,
      meta: `${formatPricePerUnit(fastestDispatch.exMillPrice)}`,
      href: `/mill-offers/${fastestDispatch.offerId}`,
    });

    const lowestFreight = [...comparison].sort((a, b) => a.freight - b.freight)[0];
    opportunities.push({
      id: "opp-lowest-freight",
      category: "lowest_freight",
      title: `${lowestFreight.millName} — ${getProductLabel(lowestFreight.product)} ${lowestFreight.grade}`,
      description: `Cheapest freight per quintal among comparable offers.`,
      value: lowestFreight.freight,
      meta: `${formatPricePerUnit(lowestFreight.exMillPrice)} ex-mill`,
      href: `/mill-offers/${lowestFreight.offerId}`,
    });

    const highestProfit = [...comparison].sort((a, b) => b.expectedMargin - a.expectedMargin)[0];
    opportunities.push({
      id: "opp-highest-profit",
      category: "highest_profit",
      title: `${highestProfit.millName} — ${getProductLabel(highestProfit.product)} ${highestProfit.grade}`,
      description: `Highest total profit opportunity at current required quantity.`,
      value: highestProfit.expectedMargin,
      meta: formatQuantityMt(highestProfit.quantityAvailable),
      href: `/mill-offers/${highestProfit.offerId}`,
    });

    return delay(opportunities);
  },
};
