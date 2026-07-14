import { MILLS } from "@/lib/master-data/mills";
import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { profileService } from "./profile.service";
import type { Contact, ContactDraft, ContactFilters, ContactCategory, ContactActivityEvent, ContactActivityType, ContactDirectoryStats } from "@/lib/types/contact";

const CONTACTS_KEY = "tradesucro-contacts";
const ACTIVITY_KEY = "tradesucro-contact-activity";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const CATEGORY_NAME_POOL: Record<ContactCategory, string[]> = {
  mill: [],
  trader: ["Triveni Agro Industries", "Godavari Sugarcane Co.", "Bajaj Refineries Pvt. Ltd.", "Kaveri Trading Co.", "Renuka Sweetners & Co."],
  broker: ["Kaveri Brokerage Partners", "Al Manar Trading LLC", "Deccan Brokerage House", "Malwa Commodity Brokers"],
  wholesaler: ["Kumar Wholesale Traders", "Shree Balaji Wholesale Corp.", "Anand Wholesale Depot", "Ganesh General Distributors"],
  retailer: ["More Retail Ltd.", "Reliance Retail — Fresh", "Vishal Mega Mart", "D-Mart Sugar Division"],
  industrial_buyer: ["Haldiram Snacks Pvt. Ltd.", "Britannia Ingredients", "Parle Products Ltd.", "Nestlé Confectionery Div."],
  transporter: ["Shree Logistics", "BharatLine Carriers", "Speedway Transport", "Kaveri Roadways", "National Fleet Carriers"],
  insurance_partner: ["Bajaj Allianz Trade Cover", "ICICI Lombard Cargo Insurance", "United India Marine Cover"],
  warehouse: ["CFS Warehousing Solutions", "Central Warehousing Corp.", "Agro Storage & Logistics"],
  financial_partner: ["HDFC Trade Finance", "Yes Bank Commodity Desk", "SBI Agri Finance", "Bajaj Finserv Trade Credit"],
};

const CONTACT_FIRST = ["Rohan", "Suresh", "Anita", "Vikram", "Meena", "Arjun", "Kavita", "Ramesh", "Priya", "Sanjay", "Fatima", "Deepak", "Nisha", "Rajiv"];
const CONTACT_LAST = ["Mehta", "Iyer", "Sharma", "Rao", "Patel", "Reddy", "Nair", "Gupta", "Khan", "Joshi", "Al Rashid", "Verma", "Krishnan", "Bose"];

const ALL_CATEGORIES: ContactCategory[] = [
  "mill",
  "trader",
  "broker",
  "wholesaler",
  "retailer",
  "industrial_buyer",
  "transporter",
  "insurance_partner",
  "warehouse",
  "financial_partner",
];

function generateContacts(): Contact[] {
  const contacts: Contact[] = [];
  let i = 0;

  ALL_CATEGORIES.forEach((category) => {
    const pool = category === "mill" ? MILLS.slice(0, 8).map((m) => m.name) : CATEGORY_NAME_POOL[category];
    const perCategoryCount = category === "mill" ? 8 : Math.min(5, pool.length);

    for (let j = 0; j < perCategoryCount; j++) {
      const companyName = pool[j % pool.length];
      const state = category === "mill" ? MILLS[j % MILLS.length].state : STATES[i % 24].value;
      const citiesInState = CITIES.filter((c) => c.stateCode === state);
      const city = citiesInState[i % (citiesInState.length || 1)]?.label ?? "";
      const gradeCount = 1 + (i % 3);
      const preferredGrades = QUALITY_GRADES.slice(0, gradeCount);
      const regionCount = 1 + (i % 2);
      const preferredRegions = Array.from({ length: regionCount }, (_, k) => STATES[(i + k * 5) % 24].value);
      const verification = i % 5 === 0 ? "unverified" : i % 3 === 0 ? "pending" : "verified";

      contacts.push({
        id: `contact-${String(i + 1).padStart(4, "0")}`,
        companyName,
        contactPerson: `${CONTACT_FIRST[i % CONTACT_FIRST.length]} ${CONTACT_LAST[i % CONTACT_LAST.length]}`,
        mobile: `9${String(700000000 + i * 191).slice(0, 9)}`,
        whatsapp: `9${String(700000000 + i * 191).slice(0, 9)}`,
        email: `contact@${companyName.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 14)}.com`,
        city,
        state,
        category,
        preferredGrades,
        preferredRegions,
        averageMonthlyVolume: 100 + ((i * 67) % 2400),
        preferredPaymentTerms: PAYMENT_TERMS[i % PAYMENT_TERMS.length].value,
        verificationStatus: verification,
        trustScore: [3, 3.5, 4, 4.2, 4.5, 4.7, 4.9, 5][i % 8],
        lastInteraction: daysFromNow(-(i % 45)),
        notes: i % 4 === 0 ? "Reliable payment history. Prefers early morning calls." : "",
        favorite: i % 7 === 0,
        interactionCount: 1 + (i % 30),
        createdAt: daysFromNow(-(90 + i * 3)),
      });
      i++;
    }
  });

  return contacts;
}

function generateActivity(contacts: Contact[]): ContactActivityEvent[] {
  const events: ContactActivityEvent[] = [];
  let counter = 0;
  const typeCycle: ContactActivityType[] = ["profile_viewed", "call", "whatsapp", "offer_created", "deal_started", "email", "requirement_created", "note_added"];
  const descriptions: Record<ContactActivityType, string> = {
    call: "Phone call logged",
    whatsapp: "WhatsApp message sent",
    email: "Email sent",
    offer_created: "Created a resale offer for this contact",
    requirement_created: "Shared a buy requirement",
    deal_started: "Started a deal with this contact",
    note_added: "Added a note",
    profile_viewed: "Viewed company profile",
  };

  contacts.slice(0, 20).forEach((contact, ci) => {
    const eventCount = 2 + (ci % 4);
    for (let k = 0; k < eventCount; k++) {
      const type = typeCycle[(ci + k) % typeCycle.length];
      events.push({
        id: `activity-${counter++}`,
        contactId: contact.id,
        type,
        description: descriptions[type],
        timestamp: daysFromNow(-(k * 4 + ci)),
      });
    }
  });

  return events;
}

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

function readContacts(): Contact[] {
  return readJSON(CONTACTS_KEY, generateContacts);
}
function readActivity(): ContactActivityEvent[] {
  return readJSON(ACTIVITY_KEY, () => generateActivity(readContacts()));
}

function matchesFilters(contact: Contact, filters: ContactFilters): boolean {
  if (filters.category && contact.category !== filters.category) return false;
  if (filters.state && contact.state !== filters.state) return false;
  if (filters.city && contact.city !== filters.city) return false;
  if (filters.verification && contact.verificationStatus !== filters.verification) return false;
  if (filters.grade && !contact.preferredGrades.includes(filters.grade)) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    if (!`${contact.companyName} ${contact.contactPerson} ${contact.city}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

/**
 * Smart Contact Network Service (mock)
 * ------------------------------------------------------------------
 * No backend. Reads the active company's own state (via profileService,
 * unmodified) only for "Nearby Contacts" — everything else is this
 * module's own local data.
 */
export const contactService = {
  async getContacts(filters: ContactFilters = {}): Promise<Contact[]> {
    return delay(readContacts().filter((c) => matchesFilters(c, filters)).sort((a, b) => a.companyName.localeCompare(b.companyName)));
  },

  async getContactById(id: string): Promise<Contact | undefined> {
    return delay(readContacts().find((c) => c.id === id));
  },

  async toggleFavorite(id: string): Promise<Contact | undefined> {
    const contacts = readContacts();
    const existing = contacts.find((c) => c.id === id);
    if (!existing) return delay(undefined);
    const updated = { ...existing, favorite: !existing.favorite };
    writeJSON(CONTACTS_KEY, contacts.map((c) => (c.id === id ? updated : c)));
    return delay(updated, 250);
  },

  async createContact(draft: ContactDraft): Promise<Contact> {
    const contact: Contact = {
      ...draft,
      id: `contact-user-${Date.now()}`,
      favorite: false,
      interactionCount: 0,
      lastInteraction: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    writeJSON(CONTACTS_KEY, [contact, ...readContacts()]);
    return delay(contact, 500);
  },

  async recordInteraction(id: string, type: ContactActivityType, description: string): Promise<void> {
    const contacts = readContacts();
    const existing = contacts.find((c) => c.id === id);
    if (existing) {
      const updated = { ...existing, lastInteraction: new Date().toISOString(), interactionCount: existing.interactionCount + 1 };
      writeJSON(CONTACTS_KEY, contacts.map((c) => (c.id === id ? updated : c)));
    }

    const activity = readActivity();
    activity.push({ id: `activity-user-${Date.now()}`, contactId: id, type, description, timestamp: new Date().toISOString() });
    writeJSON(ACTIVITY_KEY, activity);
  },

  async getFavorites(): Promise<Contact[]> {
    return delay(readContacts().filter((c) => c.favorite));
  },

  async getRecent(limit = 8): Promise<Contact[]> {
    return delay([...readContacts()].sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime()).slice(0, limit));
  },

  async getFrequent(limit = 8): Promise<Contact[]> {
    return delay([...readContacts()].sort((a, b) => b.interactionCount - a.interactionCount).slice(0, limit));
  },

  async getNearby(limit = 8): Promise<Contact[]> {
    const profile = await profileService.getProfile();
    const homeState = profile?.address?.state;
    const all = readContacts();
    const nearby = homeState ? all.filter((c) => c.state === homeState) : all;
    return delay(nearby.slice(0, limit));
  },

  async getSuggested(limit = 8): Promise<Contact[]> {
    const suggested = readContacts()
      .filter((c) => c.verificationStatus === "verified" && c.trustScore >= 4.3 && c.interactionCount < 10)
      .sort((a, b) => b.trustScore - a.trustScore);
    return delay(suggested.slice(0, limit));
  },

  async getDirectoryStats(): Promise<ContactDirectoryStats> {
    const contacts = readContacts();
    return delay({
      total: contacts.length,
      verified: contacts.filter((c) => c.verificationStatus === "verified").length,
      favorites: contacts.filter((c) => c.favorite).length,
      categoriesRepresented: new Set(contacts.map((c) => c.category)).size,
    });
  },

  async getRelationshipTimeline(contactId: string): Promise<ContactActivityEvent[]> {
    return delay(readActivity().filter((e) => e.contactId === contactId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  async getBusinessActivityFeed(limit = 20): Promise<(ContactActivityEvent & { contactName: string })[]> {
    const contacts = readContacts();
    const contactMap = new Map(contacts.map((c) => [c.id, c.companyName]));
    const events = readActivity()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
      .map((e) => ({ ...e, contactName: contactMap.get(e.contactId) ?? "Unknown" }));
    return delay(events);
  },

  getPartyOptions() {
    const contacts = readContacts();
    return {
      states: [...new Set(contacts.map((c) => c.state))],
      cities: [...new Set(contacts.map((c) => c.city))],
    };
  },
};
