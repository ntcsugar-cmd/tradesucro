export type PriceQuoteStatus = "active" | "on_hold" | "withdrawn";

export interface MillPriceQuote {
  id: string;
  product: string;
  grade: string;
  todaysPrice: number;
  yesterdayPrice: number;
  quantityAvailable: number;
  unit: string;
  status: PriceQuoteStatus;
  updatedAt: string;
}

export interface PriceRevision {
  id: string;
  quoteId: string;
  product: string;
  revisionNo: number;
  oldPrice: number;
  newPrice: number;
  difference: number;
  changedAt: string;
  updatedBy: string;
  reason: string;
}

/** A minimal, chart-library-agnostic point — "graph-ready" per the brief, without committing to a specific charting dependency. */
export interface PriceHistoryPoint {
  timestamp: string;
  price: number;
}
