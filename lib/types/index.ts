export type Direction = "up" | "down" | "flat";

export * from "./auth";
export * from "./onboarding";
export * from "./company-profile";
export * from "./marketplace";
export * from "./millOffer";
export * from "./millProfile";
export * from "./millPricing";
export * from "./tender";
export * from "./millOperations";
export * from "./workspace";
export * from "./millTender";
export * from "./marketIntelligence";
export * from "./deal";
export * from "./traderWorkspace";
export * from "./traderResale";
export * from "./smartMatch";
export * from "./commercial";
export * from "./contact";
export * from "./masterDataAdmin";
export * from "./transport";

export interface TickerItem {
  symbol: string;
  label: string;
  price: number;
  change: number;
  direction: Direction;
}

export interface MarketIndex {
  grade: string;
  region: string;
  price: number;
  unit: string;
  change: number;
  direction: Direction;
  sparkline: number[];
}

export interface SellOffer {
  id: string;
  mill: string;
  location: string;
  grade: string;
  quantityMt: number;
  price: number;
  postedAgo: string;
  verified: boolean;
}

export interface BuyRequirement {
  id: string;
  buyer: string;
  location: string;
  grade: string;
  quantityMt: number;
  targetPrice: number;
  postedAgo: string;
  urgent: boolean;
}

export interface Mill {
  id: string;
  name: string;
  location: string;
  capacityTpd: number;
  grades: string[];
  established: number;
  rating: number;
}

export interface NewsItem {
  id: string;
  category: string;
  headline: string;
  summary: string;
  date: string;
  readMins: number;
}
