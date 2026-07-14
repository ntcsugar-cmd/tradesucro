import type { QualityGrade } from "./marketplace";

/**
 * Market Intelligence Types
 * ------------------------------------------------------------------
 * A market-wide, read-only view across all Master Data mills — not
 * scoped to the logged-in mill's own data (that's Mill Portal, which
 * this module doesn't touch or import from). Self-contained mock
 * dataset generated from Master Data (mills, products, states) only.
 */

export interface MillPriceEntry {
  id: string;
  millId: string;
  millName: string;
  state: string;
  grade: QualityGrade;
  product: string;
  todaysPrice: number;
  previousPrice: number;
  timeUpdated: string;
  offerAvailable: boolean;
  tenderOpen: boolean;
  quantityAvailable: number;
  dispatchDate: string;
  paymentTerms: string;
}

export interface LivePriceFilters {
  search?: string;
  state?: string;
  millId?: string;
  grade?: QualityGrade;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-low" | "price-high" | "latest";
}

export interface MarketDashboardStats {
  averageIndiaPrice: number;
  todaysHighest: number;
  todaysLowest: number;
  mostActiveState: string;
  mostActiveMill: string;
  offersToday: number;
  tendersToday: number;
  priceUpCount: number;
  priceDownCount: number;
}

export type TrendWindow = 7 | 30 | 90;

export interface TrendPoint {
  date: string;
  averagePrice: number;
}

export interface GradeTrend {
  grade: QualityGrade;
  points: TrendPoint[];
}

export type MarketFeedEventType = "price_revised" | "new_offer" | "tender_published" | "tender_closed" | "tender_awarded" | "dispatch_update";

export interface MarketFeedEvent {
  id: string;
  type: MarketFeedEventType;
  millName: string;
  state: string;
  description: string;
  timestamp: string;
}

export interface StateHeatMapEntry {
  state: string;
  averagePrice: number;
  highest: number;
  lowest: number;
  millCount: number;
  offers: number;
  tenders: number;
}

export type AlertType = "price_increase" | "price_decrease" | "mill_price_update" | "new_tender" | "offer_closing" | "target_price_reached";

export interface AlertRule {
  id: string;
  type: AlertType;
  label: string;
  state?: string;
  millId?: string;
  grade?: QualityGrade;
  targetPrice?: number;
  active: boolean;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export type MarketNewsCategory = "government" | "export_policy" | "import_policy" | "industry" | "weather" | "production" | "ethanol";

export interface MarketNewsItem {
  id: string;
  category: MarketNewsCategory;
  headline: string;
  summary: string;
  date: string;
}

export interface MarketSearchResults {
  mills: { id: string; label: string }[];
  states: { value: string; label: string }[];
  grades: QualityGrade[];
  tenders: { number: string; millName: string }[];
  offers: { number: string; millName: string }[];
}
