import { PRODUCTS } from "@/lib/master-data/products";
import { PACKAGING } from "@/lib/master-data/packaging";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { millProfileService } from "./millProfile.service";
import { isMillVerified } from "@/lib/types/millProfile";
import type {
  MillTender,
  MillTenderDraft,
  MillTenderStatus,
  MillTenderBid,
  TenderTimelineEvent,
  TenderTimelineEventType,
  AwardDetails,
  TenderNotification,
  TenderDashboardStats,
  TenderType,
} from "@/lib/types/millTender";
import type { AuthResult } from "@/lib/types/auth";

const TENDERS_KEY = "tradesucro-mill-tender-mgmt-tenders";
const BIDS_KEY = "tradesucro-mill-tender-mgmt-bids";
const TIMELINE_KEY = "tradesucro-mill-tender-mgmt-timeline";
const NOTIFICATIONS_KEY = "tradesucro-mill-tender-mgmt-notifications";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Mock data generation                                                */
/* ------------------------------------------------------------------ */

const TENDER_TYPES: TenderType[] = ["open", "limited", "private", "negotiation", "spot", "forward", "export"];
const BIDDER_NAMES = [
  { name: "Triveni Agro Industries", type: "trader" as const },
  { name: "Godavari Sugarcane Co.", type: "trader" as const },
  { name: "Shree Renuka Exports", type: "trader" as const },
  { name: "Al Manar Trading LLC", type: "broker" as const },
  { name: "Bajaj Refineries Pvt. Ltd.", type: "trader" as const },
  { name: "Kaveri Brokerage Partners", type: "broker" as const },
];

function emptyDoc() {
  return { fileName: null, uploadedAt: null };
}

function buildProducts(seed: number) {
  const rowCount = 1 + (seed % 2);
  return Array.from({ length: rowCount }).map((_, i) => {
    const idx = seed + i * 3;
    const product = PRODUCTS[idx % PRODUCTS.length];
    const reserve = 3600 + ((idx * 41) % 900);
    return {
      id: `tp-${seed}-${i}`,
      grade: QUALITY_GRADES[idx % QUALITY_GRADES.length],
      product: product.value,
      packaging: PACKAGING[idx % PACKAGING.length].value,
      quantity: 300 + ((idx * 53) % 1200),
      unit: "mt",
      minimumBidPrice: reserve - 100,
      reservePrice: reserve,
      emdRequired: idx % 3 !== 0,
      emdAmount: idx % 3 !== 0 ? 60000 + (idx % 8) * 15000 : 0,
      liftingSchedule: "Within 15 days of award confirmation",
    };
  });
}

function generateTenders(count: number): MillTender[] {
  const statuses: MillTenderStatus[] = ["published", "published", "closed", "awarded", "draft", "cancelled", "expired", "published"];
  const tenders: MillTender[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[i % statuses.length];
    const type = TENDER_TYPES[i % TENDER_TYPES.length];
    const tenderDate = daysFromNow(-(10 + i));
    const openingDateTime = daysFromNow(-(9 + i));
    const closingDateTime =
      status === "expired" || status === "closed" || status === "awarded" ? daysFromNow(-(1 + (i % 4))) : daysFromNow(1 + (i % 6));

    tenders.push({
      id: `mt-${String(i + 1).padStart(4, "0")}`,
      tenderNumber: `MTD-2026-${String(1000 + i).slice(1)}`,
      title: `${type === "export" ? "Export" : "Domestic"} Sale of ${PRODUCTS[i % PRODUCTS.length].label} — Lot ${i + 1}`,
      type,
      tenderDate,
      openingDateTime,
      closingDateTime,
      awardDate: daysFromNow(3 + (i % 6)),
      status,
      products: buildProducts(i + 1),
      bidConditions: {
        minimumQuantity: 50,
        maximumQuantity: 2000,
        bidIncrement: 5,
        bidRevisionAllowed: i % 2 === 0,
        numberOfRevisions: i % 2 === 0 ? 3 : 0,
        autoExtension: i % 3 === 0,
        visibility: type === "private" ? "private" : type === "limited" ? "invited_only" : "public",
      },
      paymentTerms: {
        advancePercent: [10, 25, 50, 100][i % 4],
        balancePercent: 100 - [10, 25, 50, 100][i % 4],
        paymentDue: "Before dispatch",
        creditDays: [0, 7, 15][i % 3],
        emdNotes: "EMD payable via NEFT/RTGS to the mill's escrow account prior to bid submission.",
        bankDetailsSummary: "State Bank of India · A/C ...4821 · IFSC SBIN0001234",
      },
      dispatchTerms: {
        dispatchStart: daysFromNow(5 + (i % 5)),
        dispatchEnd: daysFromNow(25 + (i % 10)),
        loadingCapacity: 200 + (i % 5) * 50,
        dailyDispatchLimit: 100 + (i % 4) * 40,
        deliveryTerms: DISPATCH_TERMS[i % DISPATCH_TERMS.length].value,
      },
      documents: {
        tenderNotice: { fileName: "tender_notice.pdf", uploadedAt: tenderDate },
        termsAndConditions: { fileName: "terms_and_conditions.pdf", uploadedAt: tenderDate },
        qualityCertificate: i % 2 === 0 ? { fileName: "quality_certificate.pdf", uploadedAt: tenderDate } : emptyDoc(),
        labReport: i % 3 === 0 ? { fileName: "lab_report.pdf", uploadedAt: tenderDate } : emptyDoc(),
        otherDocuments: [],
      },
      createdBy: "Mill Sales Executive",
      createdAt: tenderDate,
      updatedAt: openingDateTime,
    });
  }

  return tenders;
}

function generateBids(tenders: MillTender[]): MillTenderBid[] {
  const bids: MillTenderBid[] = [];
  tenders.forEach((tender, ti) => {
    if (tender.status === "draft") return;
    const bidCount = 2 + (ti % 3);
    for (let b = 0; b < bidCount; b++) {
      const bidder = BIDDER_NAMES[(ti + b) % BIDDER_NAMES.length];
      const baseReserve = tender.products[0]?.reservePrice ?? 3700;
      const isWinner = tender.status === "awarded" && b === 0;
      bids.push({
        id: `mtb-${tender.id}-${b}`,
        tenderId: tender.id,
        bidNumber: `BID-${tender.tenderNumber}-${b + 1}`,
        companyName: bidder.name,
        bidderType: bidder.type,
        verified: (ti + b) % 4 !== 0,
        quantity: 100 + (b % 4) * 150,
        price: baseReserve + b * 20 + (ti % 15),
        submittedAt: daysFromNow(-(1 + b), -(b * 3)),
        revisionCount: tender.bidConditions.bidRevisionAllowed ? b % (tender.bidConditions.numberOfRevisions + 1) : 0,
        emdStatus: tender.products[0]?.emdRequired ? (isWinner ? "paid" : "pending") : "not_required",
        status: isWinner ? "awarded" : tender.status === "awarded" ? "rejected" : "submitted",
        deliveryPreference: b % 2 === 0 ? "Ex Mill" : "Delivered at buyer warehouse",
        paymentPreference: b % 2 === 0 ? "100% Advance" : "50% Advance, balance on dispatch",
      });
    }
  });
  return bids;
}

function generateTimeline(tenders: MillTender[]): TenderTimelineEvent[] {
  const events: TenderTimelineEvent[] = [];
  let counter = 0;
  tenders.forEach((tender) => {
    events.push({ id: `tl-${counter++}`, tenderId: tender.id, event: "created", description: "Tender created", timestamp: tender.createdAt, actor: tender.createdBy });
    if (tender.status !== "draft") {
      events.push({ id: `tl-${counter++}`, tenderId: tender.id, event: "published", description: "Tender published", timestamp: tender.updatedAt, actor: tender.createdBy });
    }
    if (tender.status === "closed" || tender.status === "awarded") {
      events.push({ id: `tl-${counter++}`, tenderId: tender.id, event: "closed", description: "Bidding closed", timestamp: tender.closingDateTime, actor: "System" });
    }
    if (tender.status === "awarded") {
      events.push({ id: `tl-${counter++}`, tenderId: tender.id, event: "awarded", description: "Tender awarded", timestamp: tender.awardDate, actor: "Mill Sales Executive" });
    }
    if (tender.status === "cancelled") {
      events.push({ id: `tl-${counter++}`, tenderId: tender.id, event: "cancelled", description: "Tender cancelled", timestamp: tender.updatedAt, actor: "Mill Sales Executive" });
    }
  });
  return events;
}

const MOCK_NOTIFICATIONS: TenderNotification[] = [
  { id: "tn-1", tenderId: "mt-0001", category: "bid_received", title: "New bid received", description: "Triveni Agro Industries submitted a bid on MTD-2026-1000.", timestamp: "20 min ago", read: false },
  { id: "tn-2", tenderId: "mt-0002", category: "tender_closing_soon", title: "Tender closing soon", description: "MTD-2026-1001 closes in 4 hours.", timestamp: "1 hr ago", read: false },
  { id: "tn-3", tenderId: "mt-0003", category: "award_pending", title: "Award pending", description: "MTD-2026-1002 has closed and is awaiting award.", timestamp: "3 hr ago", read: false },
  { id: "tn-4", tenderId: "mt-0004", category: "winner_selected", title: "Winner selected", description: "Shree Renuka Exports was awarded MTD-2026-1003.", timestamp: "Yesterday", read: true },
  { id: "tn-5", tenderId: "mt-0001", category: "tender_published", title: "Tender published", description: "MTD-2026-1000 is now live for bidding.", timestamp: "2 days ago", read: true },
];

/* ------------------------------------------------------------------ */
/* Storage                                                              */
/* ------------------------------------------------------------------ */

function readJSON<T>(key: string, fallback: () => T): T {
  if (typeof window === "undefined") return fallback();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // fall through
  }
  const seeded = fallback();
  window.localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readTenders(): MillTender[] {
  return readJSON(TENDERS_KEY, () => generateTenders(14));
}
function readBids(): MillTenderBid[] {
  return readJSON(BIDS_KEY, () => generateBids(readTenders()));
}
function readTimeline(): TenderTimelineEvent[] {
  return readJSON(TIMELINE_KEY, () => generateTimeline(readTenders()));
}

function appendTimeline(tenderId: string, event: TenderTimelineEventType, description: string) {
  const timeline = readTimeline();
  timeline.push({
    id: `tl-user-${Date.now()}`,
    tenderId,
    event,
    description,
    timestamp: new Date().toISOString(),
    actor: "Mill Sales Executive",
  });
  writeJSON(TIMELINE_KEY, timeline);
}

function nextTenderNumber(): string {
  const year = new Date().getFullYear();
  return `MTD-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

/** Business Rule: "Tender closes automatically after Closing Time." Computed at read time, never mutates the stored status. */
export function resolveEffectiveTenderStatus(tender: MillTender): MillTenderStatus {
  if (tender.status === "published" && new Date(tender.closingDateTime).getTime() < Date.now()) {
    return "closed";
  }
  return tender.status;
}

/**
 * Mill Tender Management Service (mock)
 * ------------------------------------------------------------------
 * No backend. Every mutating action appends a TenderTimelineEvent —
 * this is both the visible Tender Timeline and the audit log the
 * brief requires ("every action must create an audit log"); they are
 * the same underlying record, not two systems to keep in sync.
 */
export const millTenderService = {
  async getTenders(): Promise<MillTender[]> {
    return delay([...readTenders()].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getTenderById(id: string): Promise<MillTender | undefined> {
    return delay(readTenders().find((t) => t.id === id));
  },

  async createTender(draft: MillTenderDraft, status: "draft" | "published"): Promise<AuthResult<MillTender>> {
    if (status === "published") {
      const profile = await millProfileService.getProfile();
      if (!isMillVerified(profile)) {
        return delay({ success: false, message: "Only verified mills can publish tenders. Complete GST and PAN verification first." }, 200);
      }
    }

    const now = new Date().toISOString();
    const tender: MillTender = {
      ...draft,
      id: `mt-user-${Date.now()}`,
      tenderNumber: nextTenderNumber(),
      status,
      createdBy: "Mill Sales Executive",
      createdAt: now,
      updatedAt: now,
    };
    writeJSON(TENDERS_KEY, [tender, ...readTenders()]);
    appendTimeline(tender.id, "created", "Tender created");
    if (status === "published") appendTimeline(tender.id, "published", "Tender published");

    return delay({ success: true, message: "Tender saved.", data: tender }, 600);
  },

  /** Business Rule: only Draft tenders may be edited (enforced by the edit page reading this status; also re-checked here). */
  async updateTender(id: string, patch: Partial<MillTenderDraft>): Promise<MillTender | undefined> {
    const tenders = readTenders();
    const existing = tenders.find((t) => t.id === id);
    if (!existing || existing.status !== "draft") return delay(undefined);

    const updated: MillTender = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    writeJSON(TENDERS_KEY, tenders.map((t) => (t.id === id ? updated : t)));
    appendTimeline(id, "edited", "Tender details updated");
    return delay(updated, 500);
  },

  async publishTender(id: string): Promise<AuthResult<MillTender>> {
    const profile = await millProfileService.getProfile();
    if (!isMillVerified(profile)) {
      return delay({ success: false, message: "Only verified mills can publish tenders." }, 200);
    }
    const tenders = readTenders();
    const existing = tenders.find((t) => t.id === id);
    if (!existing) return delay({ success: false, message: "Tender not found." });

    const updated: MillTender = { ...existing, status: "published", updatedAt: new Date().toISOString() };
    writeJSON(TENDERS_KEY, tenders.map((t) => (t.id === id ? updated : t)));
    appendTimeline(id, "published", "Tender published");
    return delay({ success: true, message: "Tender published.", data: updated }, 500);
  },

  async cancelTender(id: string): Promise<MillTender | undefined> {
    const tenders = readTenders();
    const existing = tenders.find((t) => t.id === id);
    if (!existing) return delay(undefined);
    const updated: MillTender = { ...existing, status: "cancelled", updatedAt: new Date().toISOString() };
    writeJSON(TENDERS_KEY, tenders.map((t) => (t.id === id ? updated : t)));
    appendTimeline(id, "cancelled", "Tender cancelled");
    return delay(updated, 400);
  },

  /* ---------------- Bids ---------------- */

  async getBidsForTender(tenderId: string): Promise<MillTenderBid[]> {
    return delay(readBids().filter((b) => b.tenderId === tenderId).sort((a, b) => b.price - a.price));
  },

  /** Business Rule: "No bids accepted after closing." / "Bid revisions allowed only before closing." */
  async submitOrReviseBid(
    tenderId: string,
    bid: Omit<MillTenderBid, "id" | "tenderId" | "submittedAt" | "revisionCount" | "status">
  ): Promise<AuthResult<MillTenderBid>> {
    const tender = readTenders().find((t) => t.id === tenderId);
    if (!tender) return delay({ success: false, message: "Tender not found." });
    if (resolveEffectiveTenderStatus(tender) !== "published") {
      return delay({ success: false, message: "This tender is not open for bidding." }, 200);
    }

    const bids = readBids();
    const existing = bids.find((b) => b.tenderId === tenderId && b.companyName === bid.companyName);

    if (existing) {
      if (!tender.bidConditions.bidRevisionAllowed || existing.revisionCount >= tender.bidConditions.numberOfRevisions) {
        return delay({ success: false, message: "Bid revisions are not permitted for this tender, or the revision limit has been reached." }, 200);
      }
      const revised: MillTenderBid = { ...existing, ...bid, revisionCount: existing.revisionCount + 1, submittedAt: new Date().toISOString(), status: "revised" };
      writeJSON(BIDS_KEY, bids.map((b) => (b.id === existing.id ? revised : b)));
      appendTimeline(tenderId, "bid_revised", `${bid.companyName} revised their bid`);
      return delay({ success: true, message: "Bid revised.", data: revised }, 500);
    }

    const created: MillTenderBid = {
      ...bid,
      id: `mtb-user-${Date.now()}`,
      tenderId,
      submittedAt: new Date().toISOString(),
      revisionCount: 0,
      status: "submitted",
    };
    writeJSON(BIDS_KEY, [...bids, created]);
    appendTimeline(tenderId, "bid_submitted", `${bid.companyName} submitted a bid`);
    return delay({ success: true, message: "Bid submitted.", data: created }, 500);
  },

  /* ---------------- Award ---------------- */

  /** Business Rule: "Award can only happen after tender closes." */
  async awardTender(details: AwardDetails): Promise<AuthResult<MillTender>> {
    const tenders = readTenders();
    const tender = tenders.find((t) => t.id === details.tenderId);
    if (!tender) return delay({ success: false, message: "Tender not found." });
    if (resolveEffectiveTenderStatus(tender) !== "closed") {
      return delay({ success: false, message: "This tender must be closed before it can be awarded." }, 200);
    }

    const updated: MillTender = { ...tender, status: "awarded", awardDate: details.awardedAt, updatedAt: new Date().toISOString() };
    writeJSON(TENDERS_KEY, tenders.map((t) => (t.id === details.tenderId ? updated : t)));

    const bids = readBids();
    writeJSON(
      BIDS_KEY,
      bids.map((b) => (b.tenderId === details.tenderId ? { ...b, status: b.id === details.winningBidId ? "awarded" : "rejected" } : b))
    );

    appendTimeline(
      details.tenderId,
      "awarded",
      `Awarded ${details.awardQuantity} MT at ₹${details.awardPrice}/QTL${details.awardNotes ? ` — ${details.awardNotes}` : ""}`
    );
    return delay({ success: true, message: "Tender awarded.", data: updated }, 600);
  },

  /* ---------------- Timeline / audit log ---------------- */

  async getTimeline(tenderId?: string): Promise<TenderTimelineEvent[]> {
    const all = readTimeline();
    const filtered = tenderId ? all.filter((e) => e.tenderId === tenderId) : all;
    return delay(filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  /* ---------------- Notifications ---------------- */

  async getNotifications(): Promise<TenderNotification[]> {
    return delay(readJSON(NOTIFICATIONS_KEY, () => MOCK_NOTIFICATIONS));
  },

  /* ---------------- Dashboard ---------------- */

  async getDashboardStats(): Promise<TenderDashboardStats> {
    const tenders = readTenders();
    const effective = tenders.map((t) => ({ t, status: resolveEffectiveTenderStatus(t) }));
    const today = new Date().toDateString();

    return delay({
      activeTenders: effective.filter((e) => e.status === "published").length,
      closingToday: effective.filter((e) => e.status === "published" && new Date(e.t.closingDateTime).toDateString() === today).length,
      awardPending: effective.filter((e) => e.status === "closed").length,
      awarded: effective.filter((e) => e.status === "awarded").length,
      cancelled: effective.filter((e) => e.status === "cancelled").length,
    });
  },
};
