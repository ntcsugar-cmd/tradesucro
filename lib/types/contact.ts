import type { QualityGrade } from "./marketplace";

/**
 * Smart Contact Network — Types
 * ------------------------------------------------------------------
 * A self-contained directory module. This is TradeSucro's own
 * relationship data, not a mirror of any other module's records.
 */

export type ContactCategory =
  | "mill"
  | "trader"
  | "broker"
  | "wholesaler"
  | "retailer"
  | "industrial_buyer"
  | "transporter"
  | "insurance_partner"
  | "warehouse"
  | "financial_partner";

export type ContactVerificationStatus = "verified" | "pending" | "unverified";

export interface Contact {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  category: ContactCategory;
  preferredGrades: QualityGrade[];
  preferredRegions: string[];
  averageMonthlyVolume: number;
  preferredPaymentTerms: string;
  verificationStatus: ContactVerificationStatus;
  trustScore: number;
  lastInteraction: string;
  notes: string;
  favorite: boolean;
  interactionCount: number;
  createdAt: string;
}

export type ContactDraft = Omit<Contact, "id" | "favorite" | "interactionCount" | "lastInteraction" | "createdAt">;

export type ContactActivityType = "call" | "whatsapp" | "email" | "offer_created" | "requirement_created" | "deal_started" | "note_added" | "profile_viewed";

export interface ContactActivityEvent {
  id: string;
  contactId: string;
  type: ContactActivityType;
  description: string;
  timestamp: string;
}

export interface ContactFilters {
  search?: string;
  state?: string;
  city?: string;
  category?: ContactCategory;
  grade?: QualityGrade;
  verification?: ContactVerificationStatus;
}

export interface ContactDirectoryStats {
  total: number;
  verified: number;
  favorites: number;
  categoriesRepresented: number;
}
