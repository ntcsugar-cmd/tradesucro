import { MILLS } from "@/lib/master-data/mills";
import { PRODUCTS } from "@/lib/master-data/products";
import { PACKAGING } from "@/lib/master-data/packaging";
import { UNITS } from "@/lib/master-data/units";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type {
  MillOffer,
  MillOfferDraft,
  MillOfferFilters,
  MillOfferStatus,
  MillOfferRevision,
  MillOfferDashboardStats,
  MillOfferProductRow,
} from "@/lib/types/millOffer";
import type { Mill } from "@/types/master-data";

const NETWORK_DELAY_MS = 300;
const OVERRIDES_KEY = "tradesucro-mill-offer-overrides";
const REVISIONS_KEY = "tradesucro-mill-offer-revisions";
const COUNTER_KEY = "tradesucro-mill-offer-counter";

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/* ------------------------------------------------------------------ */
/* 10 participating mills, drawn from Master Data (not redefined)      */
/* ------------------------------------------------------------------ */

const PARTICIPATING_MILLS: Mill[] = MILLS.slice(0, 10);

/** Factory Code isn't a Master Data field — derived locally per mill, deterministically, rather than editing lib/master-data/mills.ts. */
function factoryCodeFor(mill: Mill): string {
  const digits = mill.id.replace(/\D/g, "").padStart(3, "0").slice(-3);
  return `FC-${mill.state.slice(0, 2).toUpperCase()}-${digits}`;
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Offer number generation                                             */
/* ------------------------------------------------------------------ */

function readCounter(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(COUNTER_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

function nextOfferNumber(): string {
  const year = new Date().getFullYear();
  const next = readCounter() + 1;
  if (typeof window !== "undefined") window.localStorage.setItem(COUNTER_KEY, String(next));
  return `MO-${year}-${String(next).padStart(5, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Mock offer generation                                               */
/* ------------------------------------------------------------------ */

const STATUS_CYCLE: MillOfferStatus[] = ["published", "published", "published", "draft", "closed", "cancelled", "expired"];

function buildProductRows(seed: number): MillOfferProductRow[] {
  const rowCount = 1 + (seed % 3); // 1–3 product rows per offer
  return Array.from({ length: rowCount }).map((_, i) => {
    const idx = seed + i * 2;
    const product = PRODUCTS[idx % PRODUCTS.length];
    return {
      id: `row-${seed}-${i}`,
      product: product.value,
      grade: QUALITY_GRADES[idx % QUALITY_GRADES.length],
      packaging: PACKAGING[idx % PACKAGING.length].value,
      availableQuantity: 100 + ((idx * 37) % 900),
      unit: UNITS[0].value,
      basePrice: 3400 + ((idx * 53) % 900),
      gstIncluded: idx % 2 === 0,
    };
  });
}

function generateOffers(count: number): MillOffer[] {
  const offers: MillOffer[] = [];

  for (let i = 0; i < count; i++) {
    const mill = PARTICIPATING_MILLS[i % PARTICIPATING_MILLS.length];
    const paymentTerm = PAYMENT_TERMS[i % PAYMENT_TERMS.length];
    const dispatchTerm = DISPATCH_TERMS[i % DISPATCH_TERMS.length];
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const emdRequired = i % 4 === 0;
    const offerDate = daysFromNow(-(i % 15));
    const validTill = status === "expired" ? daysFromNow(-(1 + (i % 5))) : daysFromNow(5 + (i % 20));

    offers.push({
      id: `mo-${String(i + 1).padStart(4, "0")}`,
      offerNumber: `MO-2026-${String(10000 + i).slice(1)}`,
      offerDate,
      validTill,
      status,
      millId: mill.id,
      millName: mill.name,
      state: mill.state,
      city: mill.city,
      factoryCode: factoryCodeFor(mill),
      products: buildProductRows(i + 1),
      paymentTerms: {
        paymentType: paymentTerm.value,
        advancePercent: [0, 10, 25, 50, 100][i % 5],
        balancePayment: i % 2 === 0 ? "Balance before dispatch" : "Balance against delivery",
        paymentDueDate: daysFromNow(7 + (i % 10)),
        creditDays: paymentTerm.creditDays,
        emdRequired,
        emdAmount: emdRequired ? 50000 + (i % 10) * 10000 : 0,
        emdDueDate: emdRequired ? daysFromNow(3 + (i % 5)) : "",
      },
      dispatch: {
        dispatchStartDate: daysFromNow(2 + (i % 5)),
        dispatchEndDate: daysFromNow(20 + (i % 15)),
        liftingPeriodDays: [7, 10, 15, 20, 30][i % 5],
        minimumLiftingQuantity: 25 + (i % 4) * 25,
        maximumDailyLifting: 100 + (i % 5) * 50,
        dispatchTerms: dispatchTerm.value,
      },
      conditions: {
        specialTerms: i % 3 === 0 ? "Priority allocation for repeat buyers." : "",
        qualityConditions: "Sugar to conform to AGMARK/ISI grade standards at time of lifting.",
        penaltyClause: "Delayed lifting beyond the lifting period attracts demurrage as per mill policy.",
        cancellationPolicy: "Cancellation after EMD payment forfeits the EMD amount.",
        remarks: i % 5 === 0 ? "Limited period offer, subject to stock availability." : "",
      },
      attachments: {
        offerCircular: { fileName: null, uploadedAt: null },
        qualityCertificate: { fileName: null, uploadedAt: null },
        millLetter: { fileName: null, uploadedAt: null },
        otherDocuments: [],
      },
      createdBy: "Mill Sales Executive",
      createdAt: offerDate,
      updatedAt: offerDate,
    });
  }

  return offers;
}

const BASE_OFFERS: MillOffer[] = generateOffers(50);

/* ------------------------------------------------------------------ */
/* localStorage overlay — create/update/publish/withdraw all write here */
/* ------------------------------------------------------------------ */

function readOverrides(): Record<string, MillOffer> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, MillOffer>) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Record<string, MillOffer>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

function readAllOffers(): MillOffer[] {
  const overrides = readOverrides();
  const merged = BASE_OFFERS.map((o) => overrides[o.id] ?? o);
  const newOnes = Object.values(overrides).filter((o) => !BASE_OFFERS.some((b) => b.id === o.id));
  return [...newOnes, ...merged];
}

function readRevisions(): MillOfferRevision[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVISIONS_KEY);
    return raw ? (JSON.parse(raw) as MillOfferRevision[]) : [];
  } catch {
    return [];
  }
}

function writeRevision(offerId: string, fieldsModified: string[]) {
  if (typeof window === "undefined") return;
  const all = readRevisions();
  const revisionNumber = all.filter((r) => r.offerId === offerId).length + 1;
  all.push({
    id: `rev-${offerId}-${revisionNumber}`,
    offerId,
    revisionNumber,
    changedBy: "Mill Sales Executive",
    changedOn: new Date().toISOString(),
    fieldsModified,
  });
  window.localStorage.setItem(REVISIONS_KEY, JSON.stringify(all));
}

/* ------------------------------------------------------------------ */
/* Business-rule helper: effective status (expiry is computed, not stored) */
/* ------------------------------------------------------------------ */

/** Business Rule: "Expired offers automatically become inactive" — computed at read time from validTill, never mutates the stored status. */
export function resolveEffectiveStatus(offer: MillOffer): MillOfferStatus {
  if (offer.status === "published" && new Date(offer.validTill).getTime() < Date.now()) {
    return "expired";
  }
  return offer.status;
}

function matchesFilters(offer: MillOffer, filters: MillOfferFilters): boolean {
  const effectiveStatus = resolveEffectiveStatus(offer);
  if (filters.millId && offer.millId !== filters.millId) return false;
  if (filters.state && offer.state !== filters.state) return false;
  if (filters.status && effectiveStatus !== filters.status) return false;
  if (filters.emdRequired != null && offer.paymentTerms.emdRequired !== filters.emdRequired) return false;
  if (filters.product && !offer.products.some((p) => p.product === filters.product)) return false;
  if (filters.grade && !offer.products.some((p) => p.grade === filters.grade)) return false;
  if (filters.dateFrom && new Date(offer.offerDate) < new Date(filters.dateFrom)) return false;
  if (filters.dateTo && new Date(offer.offerDate) > new Date(filters.dateTo)) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${offer.offerNumber} ${offer.millName} ${offer.city} ${offer.state}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

/**
 * Mill Offer Service (mock)
 * ------------------------------------------------------------------
 * No backend yet. Base offers are generated deterministically from
 * Master Data (mills, products, packaging, units, payment/dispatch
 * terms). Every create/update/publish/withdraw/duplicate writes to a
 * localStorage overlay keyed by offer id, so edits to generated offers
 * and brand-new offers are handled by the same mechanism.
 *
 * Deliberately does not import from or write to marketplace.service.ts
 * — Mill Offer Management is a separate module per the v0.6 brief.
 */
export const millOfferService = {
  async getOffers(filters: MillOfferFilters = {}): Promise<MillOffer[]> {
    const all = readAllOffers().filter((o) => matchesFilters(o, filters));
    return delay(all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  },

  async getOfferById(id: string): Promise<MillOffer | undefined> {
    return delay(readAllOffers().find((o) => o.id === id));
  },

  async getParticipatingMills(): Promise<Mill[]> {
    return delay(PARTICIPATING_MILLS);
  },

  /** Business Rule: Offer Number must be unique — generated server-side (mock), never user-entered. */
  async createOffer(draft: MillOfferDraft, status: "draft" | "published"): Promise<MillOffer> {
    const now = new Date().toISOString();
    const offer: MillOffer = {
      ...draft,
      id: `mo-user-${Date.now()}`,
      offerNumber: nextOfferNumber(),
      status,
      createdBy: "Mill Sales Executive",
      createdAt: now,
      updatedAt: now,
    };
    const overrides = readOverrides();
    overrides[offer.id] = offer;
    writeOverrides(overrides);
    writeRevision(offer.id, ["Offer created"]);
    return delay(offer, 600);
  },

  /** Business Rule: Draft offers are editable; Published offers become read-only (enforced by the edit page, not just here — see business rule note in the edit route). */
  async updateOffer(id: string, patch: Partial<MillOfferDraft>, fieldsModified: string[]): Promise<MillOffer | undefined> {
    const all = readAllOffers();
    const existing = all.find((o) => o.id === id);
    if (!existing) return delay(undefined);

    const updated: MillOffer = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    const overrides = readOverrides();
    overrides[id] = updated;
    writeOverrides(overrides);
    writeRevision(id, fieldsModified);
    return delay(updated, 500);
  },

  async publishOffer(id: string): Promise<MillOffer | undefined> {
    return millOfferService.updateOfferStatus(id, "published", ["Status → Published"]);
  },

  /** Business Rule: Withdrawn offers cannot receive new interest — modeled as status "cancelled" (no separate Withdrawn status was specified for this module). */
  async withdrawOffer(id: string): Promise<MillOffer | undefined> {
    return millOfferService.updateOfferStatus(id, "cancelled", ["Status → Cancelled (Withdrawn)"]);
  },

  async closeOffer(id: string): Promise<MillOffer | undefined> {
    return millOfferService.updateOfferStatus(id, "closed", ["Status → Closed"]);
  },

  async updateOfferStatus(id: string, status: MillOfferStatus, fieldsModified: string[]): Promise<MillOffer | undefined> {
    const all = readAllOffers();
    const existing = all.find((o) => o.id === id);
    if (!existing) return delay(undefined);

    const updated: MillOffer = { ...existing, status, updatedAt: new Date().toISOString() };
    const overrides = readOverrides();
    overrides[id] = updated;
    writeOverrides(overrides);
    writeRevision(id, fieldsModified);
    return delay(updated, 400);
  },

  async duplicateOffer(id: string): Promise<MillOffer | undefined> {
    const source = readAllOffers().find((o) => o.id === id);
    if (!source) return delay(undefined);

    const now = new Date().toISOString();
    const duplicate: MillOffer = {
      ...source,
      id: `mo-user-${Date.now()}`,
      offerNumber: nextOfferNumber(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    const overrides = readOverrides();
    overrides[duplicate.id] = duplicate;
    writeOverrides(overrides);
    writeRevision(duplicate.id, [`Duplicated from ${source.offerNumber}`]);
    return delay(duplicate, 500);
  },

  async getOfferHistory(offerId: string): Promise<MillOfferRevision[]> {
    const revisions = readRevisions().filter((r) => r.offerId === offerId);
    return delay(revisions.sort((a, b) => b.revisionNumber - a.revisionNumber));
  },

  async getAllHistory(): Promise<MillOfferRevision[]> {
    return delay(readRevisions().sort((a, b) => new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()));
  },

  async getDashboardStats(): Promise<MillOfferDashboardStats> {
    const all = readAllOffers();
    const today = new Date().toDateString();

    const todaysActiveOffers = all.filter((o) => resolveEffectiveStatus(o) === "published").length;
    const offersExpiringToday = all.filter(
      (o) => resolveEffectiveStatus(o) === "published" && new Date(o.validTill).toDateString() === today
    ).length;
    const publishedOffers = all.filter((o) => resolveEffectiveStatus(o) === "published").length;
    const draftOffers = all.filter((o) => o.status === "draft").length;
    const totalQuantityAvailable = all
      .filter((o) => resolveEffectiveStatus(o) === "published")
      .reduce((sum, o) => sum + o.products.reduce((s, p) => s + p.availableQuantity, 0), 0);

    return delay({ todaysActiveOffers, offersExpiringToday, publishedOffers, draftOffers, totalQuantityAvailable });
  },
};
