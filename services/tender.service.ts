import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { millProfileService } from "./millProfile.service";
import { isMillVerified } from "@/lib/types/millProfile";
import type { Tender, TenderBid, TenderDraft, TenderStatus } from "@/lib/types/tender";
import type { AuthResult } from "@/lib/types/auth";

const TENDERS_KEY = "tradesucro-mill-tenders";
const BIDS_KEY = "tradesucro-mill-tender-bids";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const BIDDER_NAMES = ["Triveni Agro Industries", "Godavari Sugarcane Co.", "Shree Renuka Exports", "Bajaj Refineries Pvt. Ltd.", "Al Manar Trading LLC"];

function seedTenders(): { tenders: Tender[]; bids: TenderBid[] } {
  const tenders: Tender[] = [];
  const bids: TenderBid[] = [];
  const statuses: TenderStatus[] = ["published", "bidding_open", "bidding_open", "under_evaluation", "awarded", "draft"];

  for (let i = 0; i < 6; i++) {
    const product = PRODUCTS[i % PRODUCTS.length];
    const status = statuses[i];
    const tenderId = `tnd-${String(i + 1).padStart(3, "0")}`;

    tenders.push({
      id: tenderId,
      tenderNumber: `TN-2026-${String(1000 + i).slice(1)}`,
      product: product.value,
      grade: QUALITY_GRADES[i % QUALITY_GRADES.length],
      quantity: 500 + i * 150,
      unit: "mt",
      reservePrice: 3600 + i * 40,
      emdAmount: 75000 + i * 15000,
      bidDeadline: daysFromNow(2 + i),
      status,
      createdAt: daysFromNow(-(5 + i)),
      updatedAt: daysFromNow(-(1 + i)),
    });

    if (status !== "draft") {
      const bidCount = 1 + (i % 3);
      for (let b = 0; b < bidCount; b++) {
        bids.push({
          id: `bid-${tenderId}-${b}`,
          tenderId,
          bidderName: BIDDER_NAMES[(i + b) % BIDDER_NAMES.length],
          bidderVerified: (i + b) % 3 !== 0,
          bidPrice: 3600 + i * 40 + b * 25,
          bidQuantity: 200 + b * 100,
          submittedAt: daysFromNow(-(1 + b)),
          status: status === "awarded" && b === 0 ? "awarded" : "submitted",
        });
      }
    }
  }

  return { tenders, bids };
}

function readStore(): { tenders: Tender[]; bids: TenderBid[] } {
  if (typeof window === "undefined") return seedTenders();
  try {
    const rawTenders = window.localStorage.getItem(TENDERS_KEY);
    const rawBids = window.localStorage.getItem(BIDS_KEY);
    if (rawTenders && rawBids) {
      return { tenders: JSON.parse(rawTenders), bids: JSON.parse(rawBids) };
    }
  } catch {
    // fall through
  }
  const seeded = seedTenders();
  window.localStorage.setItem(TENDERS_KEY, JSON.stringify(seeded.tenders));
  window.localStorage.setItem(BIDS_KEY, JSON.stringify(seeded.bids));
  return seeded;
}

function writeTenders(tenders: Tender[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TENDERS_KEY, JSON.stringify(tenders));
}

function nextTenderNumber(): string {
  const year = new Date().getFullYear();
  return `TN-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
}

/**
 * Tender Service (mock)
 * ------------------------------------------------------------------
 * Business Rule: "Only verified mills can publish tenders" — enforced
 * in publishTender() by checking millProfileService's verification
 * state (read-only reuse of Mill Profile, not a modification to it).
 */
export const tenderService = {
  async getTenders(): Promise<Tender[]> {
    return delay(readStore().tenders.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getTenderById(id: string): Promise<Tender | undefined> {
    return delay(readStore().tenders.find((t) => t.id === id));
  },

  async getBidsForTender(tenderId: string): Promise<TenderBid[]> {
    const bids = readStore().bids.filter((b) => b.tenderId === tenderId);
    return delay(bids.sort((a, b) => b.bidPrice - a.bidPrice));
  },

  async createTender(draft: TenderDraft, status: "draft" | "published"): Promise<AuthResult<Tender>> {
    if (status === "published") {
      const profile = await millProfileService.getProfile();
      if (!isMillVerified(profile)) {
        return delay({ success: false, message: "Only verified mills can publish tenders. Complete GST and PAN verification first." }, 200);
      }
    }

    const { tenders } = readStore();
    const now = new Date().toISOString();
    const tender: Tender = {
      ...draft,
      id: `tnd-user-${Date.now()}`,
      tenderNumber: nextTenderNumber(),
      status: status === "published" ? "bidding_open" : "draft",
      createdAt: now,
      updatedAt: now,
    };
    writeTenders([tender, ...tenders]);
    return delay({ success: true, message: "Tender created.", data: tender }, 600);
  },

  async awardTender(tenderId: string, bidId: string): Promise<Tender | undefined> {
    const { tenders, bids } = readStore();
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return delay(undefined);

    const updated: Tender = { ...tender, status: "awarded", updatedAt: new Date().toISOString() };
    writeTenders(tenders.map((t) => (t.id === tenderId ? updated : t)));

    const updatedBids = bids.map((b) =>
      b.tenderId === tenderId ? { ...b, status: b.id === bidId ? ("awarded" as const) : ("rejected" as const) } : b
    );
    if (typeof window !== "undefined") window.localStorage.setItem(BIDS_KEY, JSON.stringify(updatedBids));

    return delay(updated, 500);
  },

  async cancelTender(tenderId: string): Promise<Tender | undefined> {
    const { tenders } = readStore();
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return delay(undefined);
    const updated: Tender = { ...tender, status: "cancelled", updatedAt: new Date().toISOString() };
    writeTenders(tenders.map((t) => (t.id === tenderId ? updated : t)));
    return delay(updated, 400);
  },

  async getActiveTenderCount(): Promise<number> {
    const { tenders } = readStore();
    return delay(tenders.filter((t) => t.status === "published" || t.status === "bidding_open").length);
  },
};
