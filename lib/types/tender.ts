export type TenderStatus = "draft" | "published" | "bidding_open" | "bidding_closed" | "under_evaluation" | "awarded" | "cancelled";
export type TenderBidStatus = "submitted" | "under_review" | "shortlisted" | "awarded" | "rejected";

export interface TenderBid {
  id: string;
  tenderId: string;
  bidderName: string;
  bidderVerified: boolean;
  bidPrice: number;
  bidQuantity: number;
  submittedAt: string;
  status: TenderBidStatus;
}

export interface Tender {
  id: string;
  tenderNumber: string;
  product: string;
  grade: string;
  quantity: number;
  unit: string;
  reservePrice: number;
  emdAmount: number;
  bidDeadline: string;
  status: TenderStatus;
  createdAt: string;
  updatedAt: string;
}

export type TenderDraft = Omit<Tender, "id" | "tenderNumber" | "status" | "createdAt" | "updatedAt">;
