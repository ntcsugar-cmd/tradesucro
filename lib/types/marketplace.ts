import type { VerificationStatus } from "./company-profile";
import type { Season } from "@/lib/master-data/seasons";

/**
 * Marketplace Types
 * ------------------------------------------------------------------
 * Named MarketplaceOffer/MarketplaceRequirement (not SellOffer/BuyRequirement)
 * to avoid colliding with the homepage's simpler display-oriented types
 * already exported from this same lib/types barrel (see index.ts) — those
 * power the public homepage ticker/offer ledgers and are out of scope here.
 */

export type OfferStatus = "draft" | "active" | "expired" | "fulfilled" | "cancelled";
export type RequirementStatus = "draft" | "active" | "expired" | "fulfilled" | "cancelled";

/**
 * Quality grade classification shown alongside the master-data Product
 * (e.g. "M30"). This is a small, marketplace-listing-specific attribute,
 * not master reference data, so it's defined here rather than added to
 * lib/master-data/ (which this module doesn't touch).
 */
/**
 * Grade Master — real Indian sugar trade grades (M/S/L series by crystal
 * size, plus ICUMSA color grades for export/refined/pharma trade). This
 * is the single source of truth for "Grade" everywhere in the app —
 * every Grade dropdown must import QUALITY_GRADES rather than
 * hardcoding its own list.
 */
export type QualityGrade = "M-30" | "S-30" | "L-30" | "M-31" | "S-31" | "L-31" | "ICUMSA 45" | "ICUMSA 100" | "ICUMSA 150" | "ICUMSA 600-1200";
export const QUALITY_GRADES: QualityGrade[] = ["M-30", "S-30", "L-30", "M-31", "S-31", "L-31", "ICUMSA 45", "ICUMSA 100", "ICUMSA 150", "ICUMSA 600-1200"];

/** Lightweight company info attached to every listing — not the full CompanyProfile (that's the logged-in user's own company only). */
export interface CompanySummary {
  id: string;
  name: string;
  businessType: string;
  city: string;
  state: string;
  verified: VerificationStatus;
  rating: number;
}

export interface DispatchLocation {
  state: string;
  city: string;
}

export interface MarketplaceOffer {
  id: string;
  company: CompanySummary;
  product: string;
  grade: QualityGrade;
  season: Season;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;
  gstIncluded: boolean;
  dispatchFrom: DispatchLocation;
  millId: string | null;
  readyStock: boolean;
  dispatchDate: string;
  paymentTerms: string;
  dispatchTerms: string;
  validity: string;
  remarks: string;
  images: string[];
  status: OfferStatus;
  createdAt: string;
}

export interface MarketplaceRequirement {
  id: string;
  company: CompanySummary;
  product: string;
  grade: QualityGrade;
  season: Season;
  quantity: number;
  unit: string;
  destination: DispatchLocation;
  expectedPrice: number;
  paymentTerms: string;
  deliverBy: string;
  remarks: string;
  status: RequirementStatus;
  createdAt: string;
}

/** Draft/editable shape used by the Post Sell Offer form before it becomes a full MarketplaceOffer. */
export type OfferDraft = Omit<MarketplaceOffer, "id" | "company" | "status" | "createdAt">;

/** Draft/editable shape used by the Post Buy Requirement form. */
export type RequirementDraft = Omit<MarketplaceRequirement, "id" | "company" | "status" | "createdAt">;

export interface ExpressInterestPayload {
  listingId: string;
  listingType: "offer" | "requirement";
  message: string;
  offeredPrice: number;
  quantity: number;
  expectedDispatch: string;
}

export interface MarketplaceStats {
  activeSellOffers: number;
  activeBuyRequirements: number;
  verifiedCompanies: number;
  todaysDeals: number;
}

export interface MarketplaceActivityItem {
  id: string;
  title: string;
  timestamp: string;
}

export type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "quantity" | "dispatch-date";

/**
 * Shared filter shape for both offers and requirements — fields that only
 * apply to one side (e.g. dispatchDate vs. deliverBy) are simply unused
 * by the other's query function.
 */
export interface MarketplaceFilters {
  search?: string;
  product?: string;
  grade?: QualityGrade;
  season?: Season;
  state?: string;
  city?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  companyType?: string;
  verifiedOnly?: boolean;
  /** Only offers dispatching within this many days from today. No-op for requirements (which use deliverBy, not dispatchDate). */
  dispatchWithinDays?: number;
  sort?: SortOption;
}
