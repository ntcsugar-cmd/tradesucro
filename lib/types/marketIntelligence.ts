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

export type AlertType =
  | "price_increase"
  | "price_decrease"
  | "mill_price_update"
  | "new_tender"
  | "offer_closing"
  | "target_price_reached"
  | "global_market_change"
  | "spot_price_change"
  | "freight_change";

export type AlertChannel = "push" | "email" | "whatsapp";

export interface AlertRule {
  id: string;
  type: AlertType;
  label: string;
  state?: string;
  millId?: string;
  grade?: QualityGrade;
  targetPrice?: number;
  /** Threshold for percent-change alerts (e.g. "ICE changes >2%"). */
  changeThresholdPercent?: number;
  channels?: AlertChannel[];
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

/**
 * Phase 3 — Sugar Market Intelligence Platform
 * ------------------------------------------------------------------
 * See lib/types/marketDataProvider.ts for the source/confidence/
 * verification metadata every value below is wrapped in.
 */

/** Section 1 — Global Market: exchange futures, FX, freight/energy benchmarks. */
export type GlobalInstrumentCategory = "sugar_futures" | "fx" | "energy" | "freight";

export interface GlobalInstrument {
  id: string;
  symbol: string;
  name: string;
  category: GlobalInstrumentCategory;
  unit: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  dailySeries: TrendPoint[];
  weeklySeries: TrendPoint[];
}

/** Section 2 — International Physical Market: export/import quotes by origin country. */
export type PhysicalPriceBasis = "FOB" | "CIF";

export interface InternationalPhysicalQuote {
  id: string;
  country: string;
  basis: PhysicalPriceBasis;
  currency: string;
  price: number | null;
  change: number | null;
  lastUpdated: string | null;
}

/** Section 3 — India Spot Market: state rolls up to city-level detail. */
export interface CitySpotPrice {
  state: string;
  city: string;
  spotPrice: number;
  priceChange: number;
  volumeMt: number;
  activeBuyers: number;
  activeSellers: number;
  trend: "up" | "down" | "flat";
}

export interface StateSpotSummary {
  state: string;
  averagePrice: number;
  priceChange: number;
  totalVolumeMt: number;
  cities: CitySpotPrice[];
}

/** Section 6 — Market Analytics: computed insights over TradeSucro's own data. */
export interface MarketAnalyticsInsights {
  topRisingMarkets: { state: string; changePercent: number }[];
  topFallingMarkets: { state: string; changePercent: number }[];
  highestDemandState: { state: string; requirementCount: number } | null;
  highestSupplyState: { state: string; offerCount: number } | null;
  lowestFreightRoute: { route: string; rate: number } | null;
  mostActiveMill: { millName: string; offerCount: number } | null;
  mostActiveTrader: { companyName: string; dealCount: number } | null;
}
