import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { TRANSPORTER_DIRECTORY, getCurrentTransporterId } from "@/lib/master-data/transporters";
import { transportService } from "./transport.service";
import type {
  FreightInquiry,
  FreightInquiryStatus,
  FreightQuote,
  FreightLoadingLocation,
  TransporterProfile,
  VehicleType,
  TransportDispatch,
} from "@/lib/types/transport";

const INQUIRIES_KEY = "tradesucro-freight-inquiries";
const QUOTES_KEY = "tradesucro-freight-quotes";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readJSON<T>(key: string, seed: () => T): T {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // fall through to reseed
  }
  const seeded = seed();
  window.localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString();
}

const REQUESTER_COMPANIES = ["Triveni Agro Industries", "Godavari Sugarcane Co.", "Bajaj Refineries Pvt. Ltd.", "Kaveri Trading Co.", "Shree Renuka Exports"];
const VEHICLE_TYPES: VehicleType[] = ["open-truck", "covered-truck", "trailer", "container"];
const LOCATION_TYPES: FreightLoadingLocation["locationType"][] = ["mill", "warehouse", "city"];

function cityFor(stateValue: string, seedIndex: number): string {
  const options = CITIES.filter((c) => c.stateCode === stateValue);
  return options.length ? options[seedIndex % options.length].label : "";
}

/**
 * Matching engine — the "Transport Broadcast" feature. A transporter is
 * eligible if they cover the loading state AND can supply the required
 * vehicle type. This is the ONLY place inquiries connect to
 * transporters; nothing routes directly to one company.
 */
function matchTransporters(loadingState: string, vehicleTypeRequired: VehicleType): TransporterProfile[] {
  return TRANSPORTER_DIRECTORY.filter((t) => t.coverageStates.includes(loadingState) && t.vehicleTypes.includes(vehicleTypeRequired));
}

function seedInquiries(): FreightInquiry[] {
  return Array.from({ length: 14 }, (_, i) => {
    const loadingState = STATES[(i * 3 + 2) % STATES.length].value;
    const destState = STATES[(i * 5 + 9) % STATES.length].value;
    const vehicleTypeRequired = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
    const matched = matchTransporters(loadingState, vehicleTypeRequired);
    const status: FreightInquiryStatus = (["broadcasting", "quotes_received", "quotes_received", "quote_approved", "confirmed", "delivered"] as FreightInquiryStatus[])[i % 6];

    return {
      id: `fi-${String(i + 1).padStart(3, "0")}`,
      requestNumber: `FI-2026-${String(4000 + i).slice(1)}`,
      requestedByCompany: REQUESTER_COMPANIES[i % REQUESTER_COMPANIES.length],
      requestedByRole: (["trader", "buyer", "mill"] as const)[i % 3],
      loading: {
        locationType: LOCATION_TYPES[i % LOCATION_TYPES.length],
        refName: LOCATION_TYPES[i % LOCATION_TYPES.length] !== "city" ? `${["Kaveri", "Renuka", "Balrampur", "Triveni"][i % 4]} ${LOCATION_TYPES[i % LOCATION_TYPES.length] === "mill" ? "Sugar Mill" : "Warehouse"}` : undefined,
        state: loadingState,
        city: cityFor(loadingState, i),
      },
      destination: { state: destState, city: cityFor(destState, i + 2) },
      product: PRODUCTS[i % PRODUCTS.length].value,
      grade: i % 3 === 0 ? null : QUALITY_GRADES[i % QUALITY_GRADES.length],
      quantity: 80 + ((i * 47) % 350),
      vehicleTypeRequired,
      expectedLoadingDate: daysFromNow(2 + (i % 8)),
      specialInstructions: i % 3 === 0 ? "Tarpaulin cover required; load must reach before evening." : "",
      status,
      matchedTransporterIds: matched.map((t) => t.id),
      approvedQuoteId: null,
      dispatchId: null,
      createdAt: daysFromNow(-(i % 10)),
    };
  });
}

function seedQuotes(inquiries: FreightInquiry[]): FreightQuote[] {
  const quotes: FreightQuote[] = [];
  inquiries.forEach((inquiry, i) => {
    inquiry.matchedTransporterIds.forEach((transporterId, j) => {
      const transporter = TRANSPORTER_DIRECTORY.find((t) => t.id === transporterId)!;
      const hasResponded = inquiry.status !== "broadcasting" && j <= i % 3;
      const submitted = hasResponded && j % 3 !== 2;
      const quoteId = `fq-${inquiry.id}-${transporterId}`;
      quotes.push({
        id: quoteId,
        inquiryId: inquiry.id,
        transporterId,
        transporterName: transporter.companyName,
        transporterRating: transporter.rating,
        transporterVerified: transporter.verified,
        response: hasResponded ? (submitted ? "accepted" : "declined") : "pending",
        freightAmount: submitted ? 8500 + ((i * 700 + j * 300) % 12000) : null,
        vehicleAvailability: submitted ? "Available within 24 hours" : null,
        loadingTime: submitted ? `${4 + (j % 3) * 2} hours` : null,
        transitTime: submitted ? `${1 + (j % 3)} days` : null,
        remarks: submitted ? "Standard insured freight, GST invoice provided." : null,
        adminStatus:
          inquiry.approvedQuoteId === quoteId
            ? "approved"
            : submitted
              ? inquiry.status === "quotes_received"
                ? "pending_review"
                : "not_selected"
              : "awaiting_quote",
        submittedAt: submitted ? daysFromNow(-(i % 5)) : null,
      });
    });
  });
  return quotes;
}

function readInquiries(): FreightInquiry[] {
  return readJSON(INQUIRIES_KEY, seedInquiries);
}
function readQuotes(): FreightQuote[] {
  return readJSON(QUOTES_KEY, () => seedQuotes(readInquiries()));
}

export type FreightInquiryDraft = Pick<
  FreightInquiry,
  "loading" | "destination" | "product" | "grade" | "quantity" | "vehicleTypeRequired" | "expectedLoadingDate" | "specialInstructions"
> & { requestedByCompany: string; requestedByRole: FreightInquiry["requestedByRole"] };

export const freightService = {
  // ---- Trader-facing ------------------------------------------------
  async createInquiry(draft: FreightInquiryDraft): Promise<FreightInquiry> {
    const inquiries = readInquiries();
    const matched = matchTransporters(draft.loading.state, draft.vehicleTypeRequired);
    const inquiry: FreightInquiry = {
      id: `fi-${Date.now()}`,
      requestNumber: `FI-2026-${String(inquiries.length + 1).padStart(4, "0")}`,
      ...draft,
      status: "broadcasting",
      matchedTransporterIds: matched.map((t) => t.id),
      approvedQuoteId: null,
      dispatchId: null,
      createdAt: new Date().toISOString(),
    };
    writeJSON(INQUIRIES_KEY, [inquiry, ...inquiries]);

    const quotes = readQuotes();
    const newQuotes: FreightQuote[] = matched.map((t) => ({
      id: `fq-${inquiry.id}-${t.id}`,
      inquiryId: inquiry.id,
      transporterId: t.id,
      transporterName: t.companyName,
      transporterRating: t.rating,
      transporterVerified: t.verified,
      response: "pending",
      freightAmount: null,
      vehicleAvailability: null,
      loadingTime: null,
      transitTime: null,
      remarks: null,
      adminStatus: "awaiting_quote",
      submittedAt: null,
    }));
    writeJSON(QUOTES_KEY, [...quotes, ...newQuotes]);

    return delay(inquiry, 400);
  },

  async getInquiriesForTrader(companyName: string): Promise<FreightInquiry[]> {
    return delay(readInquiries().filter((i) => i.requestedByCompany === companyName).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async getInquiryById(id: string): Promise<FreightInquiry | undefined> {
    return readInquiries().find((i) => i.id === id);
  },

  /** The ONLY quote a trader is ever allowed to see — the one TradeSucro staff approved. No other quotes, no transporter contact details. */
  async getApprovedQuote(inquiryId: string): Promise<FreightQuote | null> {
    const inquiry = readInquiries().find((i) => i.id === inquiryId);
    if (!inquiry?.approvedQuoteId) return null;
    return readQuotes().find((q) => q.id === inquiry.approvedQuoteId) ?? null;
  },

  async confirmTransport(inquiryId: string): Promise<TransportDispatch> {
    const inquiries = readInquiries();
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    if (!inquiry || !inquiry.approvedQuoteId) throw new Error("No approved quote to confirm.");
    const quote = readQuotes().find((q) => q.id === inquiry.approvedQuoteId);
    if (!quote || quote.freightAmount === null) throw new Error("Approved quote is incomplete.");

    const dispatch = await transportService.createDispatchFromInquiry({
      inquiryId: inquiry.id,
      product: inquiry.product,
      grade: inquiry.grade ?? QUALITY_GRADES[0],
      quantity: inquiry.quantity,
      pickup: { state: inquiry.loading.state, city: inquiry.loading.city },
      delivery: inquiry.destination,
      rate: quote.freightAmount,
      pickupDate: inquiry.expectedLoadingDate,
    });

    const updated: FreightInquiry = { ...inquiry, status: "confirmed", dispatchId: dispatch.id };
    writeJSON(INQUIRIES_KEY, inquiries.map((i) => (i.id === inquiryId ? updated : i)));
    return dispatch;
  },

  // ---- Transporter-facing --------------------------------------------
  /** Inquiries broadcast to this transporter that haven't been responded to yet. */
  async getNewInquiriesForTransporter(transporterId: string = getCurrentTransporterId()): Promise<{ inquiry: FreightInquiry; quote: FreightQuote }[]> {
    const inquiries = readInquiries();
    const quotes = readQuotes();
    return delay(
      quotes
        .filter((q) => q.transporterId === transporterId && q.response === "pending")
        .map((quote) => ({ quote, inquiry: inquiries.find((i) => i.id === quote.inquiryId)! }))
        .filter((r) => r.inquiry)
    );
  },

  /** Everything this transporter has responded to — accepted (quoted or not) or declined. */
  async getMyQuotations(transporterId: string = getCurrentTransporterId()): Promise<{ inquiry: FreightInquiry; quote: FreightQuote }[]> {
    const inquiries = readInquiries();
    const quotes = readQuotes();
    return delay(
      quotes
        .filter((q) => q.transporterId === transporterId && q.response !== "pending")
        .map((quote) => ({ quote, inquiry: inquiries.find((i) => i.id === quote.inquiryId)! }))
        .filter((r) => r.inquiry)
        .sort((a, b) => (b.quote.submittedAt ?? "").localeCompare(a.quote.submittedAt ?? ""))
    );
  },

  async respondToInquiry(quoteId: string, accept: boolean): Promise<FreightQuote> {
    const quotes = readQuotes();
    const existing = quotes.find((q) => q.id === quoteId);
    if (!existing) throw new Error("Quote not found.");
    const updated: FreightQuote = {
      ...existing,
      response: accept ? "accepted" : "declined",
      adminStatus: accept ? existing.adminStatus : "not_selected",
    };
    writeJSON(QUOTES_KEY, quotes.map((q) => (q.id === quoteId ? updated : q)));
    return delay(updated, 300);
  },

  async submitQuote(
    quoteId: string,
    details: { freightAmount: number; vehicleAvailability: string; loadingTime: string; transitTime: string; remarks: string }
  ): Promise<FreightQuote> {
    const quotes = readQuotes();
    const existing = quotes.find((q) => q.id === quoteId);
    if (!existing) throw new Error("Quote not found.");
    const updated: FreightQuote = {
      ...existing,
      ...details,
      response: "accepted",
      adminStatus: "pending_review",
      submittedAt: new Date().toISOString(),
    };
    writeJSON(QUOTES_KEY, quotes.map((q) => (q.id === quoteId ? updated : q)));

    const inquiries = readInquiries();
    const inquiry = inquiries.find((i) => i.id === existing.inquiryId);
    if (inquiry && inquiry.status === "broadcasting") {
      writeJSON(INQUIRIES_KEY, inquiries.map((i) => (i.id === inquiry.id ? { ...i, status: "quotes_received" as FreightInquiryStatus } : i)));
    }
    return delay(updated, 400);
  },

  // ---- Admin (TradeSucro staff) facing --------------------------------
  async getAllInquiries(): Promise<FreightInquiry[]> {
    return delay([...readInquiries()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async getQuotesForInquiry(inquiryId: string): Promise<FreightQuote[]> {
    return delay(readQuotes().filter((q) => q.inquiryId === inquiryId));
  },

  async getPendingApprovalInquiries(): Promise<FreightInquiry[]> {
    return delay(readInquiries().filter((i) => i.status === "quotes_received"));
  },

  /** TradeSucro staff approve exactly one quote per inquiry — every other submitted quote for that inquiry becomes "not_selected". This is the verification step; nothing reaches the trader before it. */
  async approveQuote(quoteId: string): Promise<FreightInquiry> {
    const quotes = readQuotes();
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) throw new Error("Quote not found.");

    const updatedQuotes = quotes.map((q) => {
      if (q.id === quoteId) return { ...q, adminStatus: "approved" as const };
      if (q.inquiryId === quote.inquiryId && q.response === "accepted") return { ...q, adminStatus: "not_selected" as const };
      return q;
    });
    writeJSON(QUOTES_KEY, updatedQuotes);

    const inquiries = readInquiries();
    const inquiry = inquiries.find((i) => i.id === quote.inquiryId);
    if (!inquiry) throw new Error("Inquiry not found.");
    const updated: FreightInquiry = { ...inquiry, status: "quote_approved", approvedQuoteId: quoteId };
    writeJSON(INQUIRIES_KEY, inquiries.map((i) => (i.id === inquiry.id ? updated : i)));
    return delay(updated, 400);
  },

  getTransporterDirectory(): TransporterProfile[] {
    return TRANSPORTER_DIRECTORY;
  },
};
