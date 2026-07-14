/**
 * Smart Match Engine + Live Trading Terminal — Types
 * ------------------------------------------------------------------
 * This module is a read-only aggregation layer over four existing,
 * unmodified sources: Marketplace (offers/requirements), Mill Offer
 * Management, Trader Resale (inventory-backed offers), and Tender
 * Management (awards). It never writes back to any of them — matching
 * a requirement to supply is pure computation over data those modules
 * already own.
 */

export type MatchSourceType = "marketplace_offer" | "mill_offer" | "resale_offer" | "tender_award";

export interface MatchCandidate {
  id: string;
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
  distanceKm: number;
  expectedDispatchDays: number;
  matchScore: number;
  matchReasons: string[];
  estimatedProfitPotential: number;
}

export interface MatchCriteria {
  grade?: string;
  state?: string;
  quantity: number;
  maxPrice?: number;
  targetSellPrice?: number;
}

export type OpportunityCategory =
  | "best_buy"
  | "best_sell"
  | "high_margin"
  | "urgent_offer"
  | "tender_closing"
  | "inventory_ready"
  | "price_drop";

export interface Opportunity {
  id: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  value: number;
  meta: string;
  actionLabel: string;
  actionHref: string;
}

export type WatchTargetType = "mill" | "trader" | "grade" | "state" | "region";

export interface WatchlistItem {
  id: string;
  targetType: WatchTargetType;
  targetValue: string;
  targetLabel: string;
  createdAt: string;
}

export interface WatchlistNotification {
  id: string;
  watchlistItemId: string;
  targetLabel: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface TerminalMover {
  label: string;
  state: string;
  price: number;
  changePercent: number;
}

export interface TerminalActivityEvent {
  id: string;
  type: "price" | "offer" | "tender" | "requirement" | "dispatch";
  label: string;
  description: string;
  timestamp: string;
}
