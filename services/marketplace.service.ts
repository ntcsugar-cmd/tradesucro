import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { PRODUCTS } from "@/lib/master-data/products";
import { UNITS } from "@/lib/master-data/units";
import { PACKAGING } from "@/lib/master-data/packaging";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { COMPANY_TYPES } from "@/lib/master-data/companyTypes";
import { MILLS } from "@/lib/master-data/mills";
import { SEASONS, DEFAULT_SEASON } from "@/lib/master-data/seasons";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type {
  MarketplaceOffer,
  MarketplaceRequirement,
  CompanySummary,
  OfferDraft,
  RequirementDraft,
  MarketplaceFilters,
  MarketplaceStats,
  MarketplaceActivityItem,
  ExpressInterestPayload,
  SortOption,
  AuthResult,
} from "@/lib/types";
import type { VerificationStatus } from "@/lib/types/company-profile";

const NETWORK_DELAY_MS = 350;
const OFFERS_KEY = "tradesucro-marketplace-offers";
const REQUIREMENTS_KEY = "tradesucro-marketplace-requirements";

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/* ------------------------------------------------------------------ */
/* Deterministic mock data generation — seeded once per session        */
/* ------------------------------------------------------------------ */

const COMPANY_NAME_TEMPLATES = [
  (city: string) => `${city} Trading Co.`,
  (city: string) => `${city} Sugar Traders`,
  (city: string) => `${city} Agro Exports`,
  (city: string) => `${city} Commodities Pvt. Ltd.`,
  (city: string) => `${city} Sweetners & Co.`,
];

const VERIFICATION_CYCLE: VerificationStatus[] = ["verified", "verified", "pending", "verified", "not_submitted"];

function generateCompanies(count: number): CompanySummary[] {
  const eligible = CITIES.slice(0, 60);
  const companies: CompanySummary[] = [];

  for (let i = 0; i < count; i++) {
    const city = eligible[i % eligible.length];
    const template = COMPANY_NAME_TEMPLATES[i % COMPANY_NAME_TEMPLATES.length];
    const type = COMPANY_TYPES[i % COMPANY_TYPES.length];

    companies.push({
      id: `co-${String(i + 1).padStart(3, "0")}`,
      name: template(city.label),
      businessType: type.value,
      city: city.label,
      state: city.stateCode,
      verified: VERIFICATION_CYCLE[i % VERIFICATION_CYCLE.length],
      rating: Math.round((3.4 + ((i * 37) % 16) / 10) * 10) / 10,
    });
  }
  return companies;
}

/** Mill-operated companies for sell offers (mills selling their own output). */
function millCompanies(): CompanySummary[] {
  return MILLS.slice(0, 25).map((mill, i) => ({
    id: `mill-co-${mill.id}`,
    name: mill.name,
    businessType: "mill",
    city: mill.city,
    state: mill.state,
    verified: VERIFICATION_CYCLE[i % VERIFICATION_CYCLE.length],
    rating: Math.round((3.6 + ((i * 29) % 14) / 10) * 10) / 10,
  }));
}

const COMPANIES: CompanySummary[] = [...millCompanies(), ...generateCompanies(20)];

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function generateOffers(count: number): MarketplaceOffer[] {
  const sellers = COMPANIES.filter((c) => c.businessType === "mill" || c.businessType === "trader");
  const offers: MarketplaceOffer[] = [];

  for (let i = 0; i < count; i++) {
    const company = sellers[i % sellers.length];
    const product = PRODUCTS[i % PRODUCTS.length];
    const grade = QUALITY_GRADES[i % QUALITY_GRADES.length];
    const unit = UNITS[0];
    const packaging = PACKAGING[i % PACKAGING.length];
    const paymentTerm = PAYMENT_TERMS[i % PAYMENT_TERMS.length];
    const dispatchTerm = DISPATCH_TERMS[i % DISPATCH_TERMS.length];
    const mill = MILLS[i % MILLS.length];

    offers.push({
      id: `off-${String(i + 1).padStart(4, "0")}`,
      company,
      product: product.value,
      grade,
      season: i % 5 === 0 ? SEASONS[i % SEASONS.length] : DEFAULT_SEASON,
      quantity: 100 + ((i * 47) % 900),
      unit: unit.value,
      packaging: packaging.value,
      price: 3400 + ((i * 53) % 900),
      gstIncluded: i % 2 === 0,
      dispatchFrom: { state: company.state, city: company.city },
      millId: i % 3 === 0 ? mill.id : null,
      readyStock: i % 3 !== 0,
      dispatchDate: daysFromNow(3 + (i % 20)),
      paymentTerms: paymentTerm.value,
      dispatchTerms: dispatchTerm.value,
      validity: daysFromNow(15 + (i % 15)),
      remarks: i % 4 === 0 ? "Bulk discount available for orders above 500 MT." : "",
      images: [],
      status: i % 11 === 0 ? "fulfilled" : i % 13 === 0 ? "expired" : "active",
      createdAt: daysFromNow(-(i % 30)),
    });
  }
  return offers;
}

function generateRequirements(count: number): MarketplaceRequirement[] {
  const buyers = COMPANIES.filter((c) => c.businessType === "buyer" || c.businessType === "trader" || c.businessType === "exporter");
  const requirements: MarketplaceRequirement[] = [];

  for (let i = 0; i < count; i++) {
    const company = buyers[i % buyers.length];
    const product = PRODUCTS[(i + 3) % PRODUCTS.length];
    const grade = QUALITY_GRADES[(i + 1) % QUALITY_GRADES.length];
    const unit = UNITS[0];
    const paymentTerm = PAYMENT_TERMS[(i + 2) % PAYMENT_TERMS.length];
    const destState = STATES[i % 28];

    requirements.push({
      id: `req-${String(i + 1).padStart(4, "0")}`,
      company,
      product: product.value,
      grade,
      season: i % 5 === 0 ? SEASONS[i % SEASONS.length] : DEFAULT_SEASON,
      quantity: 80 + ((i * 61) % 700),
      unit: unit.value,
      destination: { state: destState.value, city: company.city },
      preferredMillIds: i % 4 === 0 ? [MILLS[i % MILLS.length].id] : i % 7 === 0 ? [MILLS[i % MILLS.length].id, MILLS[(i + 3) % MILLS.length].id] : [],
      expectedPrice: 3350 + ((i * 41) % 850),
      paymentTerms: paymentTerm.value,
      deliverBy: daysFromNow(5 + (i % 25)),
      remarks: i % 5 === 0 ? "Open to long-term supply agreement for consistent quality." : "",
      status: i % 9 === 0 ? "fulfilled" : i % 14 === 0 ? "expired" : "active",
      createdAt: daysFromNow(-(i % 20)),
    });
  }
  return requirements;
}

const BASE_OFFERS: MarketplaceOffer[] = generateOffers(32);
const BASE_REQUIREMENTS: MarketplaceRequirement[] = generateRequirements(22);

/* ------------------------------------------------------------------ */
/* localStorage-backed user-created listings                           */
/* ------------------------------------------------------------------ */

function readLocal<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function currentCompany(): CompanySummary {
  return {
    id: "co-self",
    name: "Your Company",
    businessType: "trader",
    city: "Mumbai",
    state: "maharashtra",
    verified: "pending",
    rating: 0,
  };
}

/* ------------------------------------------------------------------ */
/* Filtering + sorting                                                 */
/* ------------------------------------------------------------------ */

function matchesFilters<
  T extends {
    product: string;
    grade: string;
    season: string;
    quantity: number;
    company: CompanySummary;
    dispatchDate?: string;
    millId?: string | null;
    preferredMillIds?: string[];
  }
>(item: T, price: number, location: { state: string; city: string }, filters: MarketplaceFilters): boolean {
  if (filters.product && item.product !== filters.product) return false;
  if (filters.grade && item.grade !== filters.grade) return false;
  if (filters.season && item.season !== filters.season) return false;
  if (filters.millId) {
    // Offers: match their own millId. Requirements: match if this mill is in
    // the preferred list, OR the list is empty ("All Mills" — open to every mill).
    if (item.millId !== undefined) {
      if (item.millId !== filters.millId) return false;
    } else if (item.preferredMillIds !== undefined) {
      if (item.preferredMillIds.length > 0 && !item.preferredMillIds.includes(filters.millId)) return false;
    }
  }
  if (filters.state && location.state !== filters.state) return false;
  if (filters.city && location.city !== filters.city) return false;
  if (filters.minQuantity != null && item.quantity < filters.minQuantity) return false;
  if (filters.maxQuantity != null && item.quantity > filters.maxQuantity) return false;
  if (filters.minPrice != null && price < filters.minPrice) return false;
  if (filters.maxPrice != null && price > filters.maxPrice) return false;
  if (filters.companyType && item.company.businessType !== filters.companyType) return false;
  if (filters.verifiedOnly && item.company.verified !== "verified") return false;
  if (filters.dispatchWithinDays != null && item.dispatchDate) {
    const daysUntil = (new Date(item.dispatchDate).getTime() - Date.now()) / 86_400_000;
    if (daysUntil > filters.dispatchWithinDays) return false;
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${item.company.name} ${item.product} ${item.season} ${location.city} ${location.state}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function sortItems<T extends { price?: number; expectedPrice?: number; quantity: number; createdAt: string; dispatchDate?: string }>(
  items: T[],
  sort: SortOption | undefined
): T[] {
  const copy = [...items];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "price-low":
      return copy.sort((a, b) => (a.price ?? a.expectedPrice ?? 0) - (b.price ?? b.expectedPrice ?? 0));
    case "price-high":
      return copy.sort((a, b) => (b.price ?? b.expectedPrice ?? 0) - (a.price ?? a.expectedPrice ?? 0));
    case "quantity":
      return copy.sort((a, b) => b.quantity - a.quantity);
    case "dispatch-date":
      return copy.sort((a, b) => new Date(a.dispatchDate ?? 0).getTime() - new Date(b.dispatchDate ?? 0).getTime());
    case "newest":
    default:
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

/* ------------------------------------------------------------------ */

const MOCK_ACTIVITY: MarketplaceActivityItem[] = [
  { id: "ma-1", title: "Triveni Agro Industries posted a sell offer for 800 MT of M30", timestamp: "12 min ago" },
  { id: "ma-2", title: "Britannia Ingredients posted a buy requirement for 400 MT of S30", timestamp: "45 min ago" },
  { id: "ma-3", title: "Kaveri Sugar Mills' offer was marked fulfilled", timestamp: "2 hr ago" },
  { id: "ma-4", title: "Al Manar Trading LLC posted a buy requirement for ICUMSA 45", timestamp: "3 hr ago" },
  { id: "ma-5", title: "Godavari Sugarcane Co. verified their GST registration", timestamp: "5 hr ago" },
];

/**
 * Marketplace Service (mock)
 * ------------------------------------------------------------------
 * No backend yet. Base offers/requirements are generated deterministically
 * from Master Data (products, states, cities, mills, company types) so
 * the catalog stays internally consistent. User-created listings (from
 * the Post Sell Offer / Post Buy Requirement forms) persist in
 * localStorage and are merged on top of the generated base set.
 *
 * Filtering/sorting happen here (not in components) so swapping this
 * for real query params against an API later doesn't change any caller.
 */
export const marketplaceService = {
  async getOffers(filters: MarketplaceFilters = {}): Promise<MarketplaceOffer[]> {
    const all = [...BASE_OFFERS, ...readLocal<MarketplaceOffer>(OFFERS_KEY)];
    const filtered = all.filter((o) => matchesFilters(o, o.price, o.dispatchFrom, filters));
    return delay(sortItems(filtered, filters.sort));
  },

  async getOfferById(id: string): Promise<MarketplaceOffer | undefined> {
    const all = [...BASE_OFFERS, ...readLocal<MarketplaceOffer>(OFFERS_KEY)];
    return delay(all.find((o) => o.id === id));
  },

  async getRequirements(filters: MarketplaceFilters = {}): Promise<MarketplaceRequirement[]> {
    const all = [...BASE_REQUIREMENTS, ...readLocal<MarketplaceRequirement>(REQUIREMENTS_KEY)];
    const filtered = all.filter((r) => matchesFilters(r, r.expectedPrice, r.destination, filters));
    return delay(sortItems(filtered, filters.sort));
  },

  async getRequirementById(id: string): Promise<MarketplaceRequirement | undefined> {
    const all = [...BASE_REQUIREMENTS, ...readLocal<MarketplaceRequirement>(REQUIREMENTS_KEY)];
    return delay(all.find((r) => r.id === id));
  },

  async createOffer(draft: OfferDraft, status: "draft" | "active"): Promise<MarketplaceOffer> {
    const offer: MarketplaceOffer = {
      ...draft,
      id: `off-user-${Date.now()}`,
      company: currentCompany(),
      status,
      createdAt: new Date().toISOString(),
    };
    const existing = readLocal<MarketplaceOffer>(OFFERS_KEY);
    writeLocal(OFFERS_KEY, [offer, ...existing]);
    return delay(offer, 700);
  },

  async createRequirement(draft: RequirementDraft, status: "draft" | "active"): Promise<MarketplaceRequirement> {
    const requirement: MarketplaceRequirement = {
      ...draft,
      id: `req-user-${Date.now()}`,
      company: currentCompany(),
      status,
      createdAt: new Date().toISOString(),
    };
    const existing = readLocal<MarketplaceRequirement>(REQUIREMENTS_KEY);
    writeLocal(REQUIREMENTS_KEY, [requirement, ...existing]);
    return delay(requirement, 700);
  },

  async getStats(): Promise<MarketplaceStats> {
    const offers = [...BASE_OFFERS, ...readLocal<MarketplaceOffer>(OFFERS_KEY)];
    const requirements = [...BASE_REQUIREMENTS, ...readLocal<MarketplaceRequirement>(REQUIREMENTS_KEY)];
    return delay({
      activeSellOffers: offers.filter((o) => o.status === "active").length,
      activeBuyRequirements: requirements.filter((r) => r.status === "active").length,
      verifiedCompanies: COMPANIES.filter((c) => c.verified === "verified").length,
      todaysDeals: 7,
    });
  },

  async getRecentActivity(): Promise<MarketplaceActivityItem[]> {
    return delay(MOCK_ACTIVITY);
  },

  async getTrendingProducts(): Promise<{ product: string; label: string; listingCount: number }[]> {
    const offers = [...BASE_OFFERS, ...readLocal<MarketplaceOffer>(OFFERS_KEY)];
    const counts = new Map<string, number>();
    offers.forEach((o) => counts.set(o.product, (counts.get(o.product) ?? 0) + 1));

    const ranked = PRODUCTS.map((p) => ({ product: p.value, label: p.label, listingCount: counts.get(p.value) ?? 0 }))
      .sort((a, b) => b.listingCount - a.listingCount)
      .slice(0, 5);
    return delay(ranked);
  },

  async expressInterest(payload: ExpressInterestPayload): Promise<AuthResult> {
    if (!payload.message.trim()) {
      return delay({ success: false, message: "Add a short message before sending." }, 200);
    }
    return delay({ success: true, message: "Your interest has been sent." }, 600);
  },
};
