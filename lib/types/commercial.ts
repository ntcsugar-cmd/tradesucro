import type { QualityGrade } from "./marketplace";

/**
 * Commercial Decision Engine — Types
 * ------------------------------------------------------------------
 * A pure analytical layer over existing, unmodified services (Mill
 * Offers, Market Intelligence, Trader Resale). It owns no primary
 * business records — every calculation here (landed cost, parity,
 * commercial score) is a computation over data those services already
 * expose, the same "read + compute, never own" pattern used by the
 * Smart Match Engine (v1.6).
 */

export interface LandedCostInputs {
  exMillPrice: number;
  quantity: number;
  freightPerUnit: number;
  insurancePerUnit: number;
  loadingChargesPerUnit: number;
  brokeragePerUnit: number;
  handlingChargesPerUnit: number;
  /** Future-ready: GST Engine integration will populate this; defaults to 0 today. */
  taxesPerUnit: number;
}

export interface LandedCostBreakdown extends LandedCostInputs {
  totalLandedCostPerUnit: number;
  totalLandedCost: number;
}

/** The one place total landed cost is computed — the calculator, the parity engine, and the comparison table all call this rather than each summing the components themselves. */
export function computeLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
  const totalLandedCostPerUnit =
    inputs.exMillPrice + inputs.freightPerUnit + inputs.insurancePerUnit + inputs.loadingChargesPerUnit + inputs.brokeragePerUnit + inputs.handlingChargesPerUnit + inputs.taxesPerUnit;
  return { ...inputs, totalLandedCostPerUnit, totalLandedCost: totalLandedCostPerUnit * inputs.quantity };
}

export interface ParityInputs {
  purchasePrice: number;
  currentMarketPrice: number;
  expectedSellingPrice: number;
  quantity: number;
  freightPerUnit: number;
  marketAverageFreightPerUnit: number;
  otherCostsPerUnit: number;
}

export interface ParityAnalysis extends ParityInputs {
  estimatedGrossMargin: number;
  estimatedNetMargin: number;
  freightDifference: number;
  marginPercent: number;
  profitOrLoss: number;
}

/** The one place parity/margin is computed. */
export function computeParity(inputs: ParityInputs): ParityAnalysis {
  const landedCostPerUnit = inputs.purchasePrice + inputs.freightPerUnit + inputs.otherCostsPerUnit;
  const estimatedGrossMargin = (inputs.expectedSellingPrice - inputs.purchasePrice) * inputs.quantity;
  const estimatedNetMargin = (inputs.expectedSellingPrice - landedCostPerUnit) * inputs.quantity;
  const freightDifference = inputs.freightPerUnit - inputs.marketAverageFreightPerUnit;
  const marginPercent = inputs.expectedSellingPrice > 0 ? (estimatedNetMargin / (inputs.expectedSellingPrice * inputs.quantity)) * 100 : 0;

  return {
    ...inputs,
    estimatedGrossMargin,
    estimatedNetMargin,
    freightDifference,
    marginPercent,
    profitOrLoss: estimatedNetMargin,
  };
}

export interface CommercialScoreBreakdown {
  price: number;
  freight: number;
  quality: number;
  trust: number;
  dispatch: number;
  paymentTerms: number;
  inventoryAvailability: number;
}

export interface CommercialScoreInputs {
  exMillPrice: number;
  priceRange: { min: number; max: number };
  freightPerUnit: number;
  freightRange: { min: number; max: number };
  qualityRating: number;
  trustScore: number;
  dispatchDays: number;
  creditDays: number;
  quantityAvailable: number;
  requiredQuantity: number;
}

function clampScore(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/** The one place the 0–100 Commercial Score is computed, across price/freight/quality/trust/dispatch/payment/inventory. */
export function computeCommercialScore(inputs: CommercialScoreInputs): { score: number; breakdown: CommercialScoreBreakdown } {
  const priceSpread = inputs.priceRange.max - inputs.priceRange.min || 1;
  const price = clampScore(100 - ((inputs.exMillPrice - inputs.priceRange.min) / priceSpread) * 100);

  const freightSpread = inputs.freightRange.max - inputs.freightRange.min || 1;
  const freight = clampScore(100 - ((inputs.freightPerUnit - inputs.freightRange.min) / freightSpread) * 100);

  const quality = clampScore((inputs.qualityRating / 5) * 100);
  const trust = clampScore((inputs.trustScore / 5) * 100);
  const dispatch = clampScore(100 - inputs.dispatchDays * 5);
  const paymentTerms = clampScore(50 + inputs.creditDays * 2);
  const inventoryAvailability = clampScore(inputs.requiredQuantity > 0 ? (inputs.quantityAvailable / inputs.requiredQuantity) * 100 : 100);

  const breakdown: CommercialScoreBreakdown = { price, freight, quality, trust, dispatch, paymentTerms, inventoryAvailability };
  const score = Math.round(
    price * 0.3 + freight * 0.15 + quality * 0.15 + trust * 0.15 + dispatch * 0.1 + paymentTerms * 0.1 + inventoryAvailability * 0.05
  );

  return { score, breakdown };
}

export interface SupplierComparisonRow {
  id: string;
  offerId: string;
  supplierName: string;
  millName: string;
  state: string;
  city: string;
  grade: QualityGrade;
  product: string;
  exMillPrice: number;
  freight: number;
  insurance: number;
  brokerage: number;
  totalLandedCost: number;
  dispatchDays: number;
  qualityRating: number;
  trustScore: number;
  paymentTerms: string;
  quantityAvailable: number;
  expectedMargin: number;
  commercialScore: number;
  scoreBreakdown: CommercialScoreBreakdown;
  overallRank: number;
}

export type CommercialOpportunityCategory = "best_buy" | "best_margin" | "cheapest_landed_cost" | "fastest_dispatch" | "lowest_freight" | "highest_profit";

export interface CommercialOpportunity {
  id: string;
  category: CommercialOpportunityCategory;
  title: string;
  description: string;
  value: number;
  meta: string;
  href: string;
}

export interface ParityDashboardStats {
  todaysAverageParity: number;
  highestMargin: number;
  lowestMargin: number;
  topBuyingOpportunity: string;
  topSellingOpportunity: string;
  nearbySuppliers: number;
}

export interface MarginThresholdWarning {
  belowThreshold: boolean;
  thresholdPercent: number;
  actualPercent: number;
}

/** Business Rule: "Warn if margin is below user-defined threshold." */
export function checkMarginThreshold(actualPercent: number, thresholdPercent: number): MarginThresholdWarning {
  return { belowThreshold: actualPercent < thresholdPercent, thresholdPercent, actualPercent };
}
