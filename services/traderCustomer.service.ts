import { STATES } from "@/lib/master-data/states";
import type { Customer, CustomerDraft, CustomerType, LedgerEntry, CustomerAgeing } from "@/lib/types/traderResale";

const CUSTOMERS_KEY = "tradesucro-trader-customers";
const LEDGER_KEY = "tradesucro-trader-customer-ledger";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const CUSTOMER_NAMES: { name: string; type: CustomerType }[] = [
  { name: "Haldiram Snacks Pvt. Ltd.", type: "industrial_buyer" },
  { name: "Britannia Ingredients", type: "industrial_buyer" },
  { name: "Parle Products Ltd.", type: "industrial_buyer" },
  { name: "Nestlé Confectionery Div.", type: "industrial_buyer" },
  { name: "Reliance Retail — Fresh", type: "retail_chain" },
  { name: "More Retail Ltd.", type: "retail_chain" },
  { name: "Kumar Wholesale Traders", type: "wholesaler" },
  { name: "Shree Balaji Wholesale Corp.", type: "wholesaler" },
  { name: "Anand Semi-Wholesale Depot", type: "semi_wholesaler" },
  { name: "Ganesh General Store Distributors", type: "semi_wholesaler" },
  { name: "Al Manar Trading LLC", type: "exporter" },
  { name: "Gulf Sweetners Trading Co.", type: "exporter" },
];

const CONTACT_FIRST = ["Rohan", "Suresh", "Anita", "Vikram", "Meena", "Arjun", "Kavita", "Ramesh", "Priya", "Sanjay", "Fatima", "Deepak"];
const CONTACT_LAST = ["Mehta", "Iyer", "Sharma", "Rao", "Patel", "Reddy", "Nair", "Gupta", "Khan", "Joshi", "Al Rashid", "Verma"];

function generateCustomers(count: number): Customer[] {
  return Array.from({ length: count }).map((_, i) => {
    const source = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const state = STATES[i % 28];
    const creditLimit = 500000 + (i % 8) * 250000;
    const outstanding = i % 4 === 0 ? 0 : Math.round(creditLimit * (0.1 + (i % 5) * 0.12));

    return {
      id: `cust-${String(i + 1).padStart(4, "0")}`,
      companyName: source.name,
      customerType: source.type,
      contactPerson: `${CONTACT_FIRST[i % CONTACT_FIRST.length]} ${CONTACT_LAST[i % CONTACT_LAST.length]}`,
      contactPhone: `9${String(800000000 + i * 137).slice(0, 9)}`,
      contactEmail: `contact@${source.name.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 12)}.com`,
      gst: `${(10 + (i % 27)).toString().padStart(2, "0")}AAAAA${1000 + i}A1Z${i % 10}`,
      pan: `AAAAA${1000 + i}${String.fromCharCode(65 + (i % 26))}`,
      address: `Plot ${12 + i}, Industrial Estate, ${state.label}`,
      state: state.value,
      creditLimit,
      outstanding,
      rating: [3, 3.5, 4, 4.2, 4.5, 4.8, 5][i % 7],
      createdAt: daysFromNow(-(60 + i * 5)),
    };
  });
}

function generateLedger(customers: Customer[]): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let counter = 0;
  customers.forEach((c) => {
    if (c.outstanding === 0) return;
    let balance = 0;
    const saleAmount = c.outstanding + Math.round(c.outstanding * 0.6);
    entries.push({
      id: `led-${counter++}`,
      customerId: c.id,
      type: "sale",
      reference: `SO-2026-${String(2000 + counter).slice(1)}`,
      description: "Sugar sale",
      amount: saleAmount,
      date: daysFromNow(-40),
      balanceAfter: (balance += saleAmount),
    });
    const paymentAmount = saleAmount - c.outstanding;
    if (paymentAmount > 0) {
      entries.push({
        id: `led-${counter++}`,
        customerId: c.id,
        type: "payment",
        reference: `PMT-${2000 + counter}`,
        description: "Payment received (NEFT)",
        amount: -paymentAmount,
        date: daysFromNow(-20),
        balanceAfter: (balance -= paymentAmount),
      });
    }
  });
  return entries;
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

function readCustomers(): Customer[] {
  return readJSON(CUSTOMERS_KEY, () => generateCustomers(14));
}
function readLedger(): LedgerEntry[] {
  return readJSON(LEDGER_KEY, () => generateLedger(readCustomers()));
}

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

/**
 * Trader Customer Service (mock)
 * ------------------------------------------------------------------
 * No backend. Fully self-contained (own localStorage keys) — does not
 * touch any Trader Dashboard / Mill Workspace / Deal Management data.
 */
export const traderCustomerService = {
  async getCustomers(): Promise<Customer[]> {
    return delay(readCustomers().sort((a, b) => b.rating - a.rating));
  },

  async getCustomerById(id: string): Promise<Customer | undefined> {
    return delay(readCustomers().find((c) => c.id === id));
  },

  async createCustomer(draft: CustomerDraft): Promise<Customer> {
    const customer: Customer = { ...draft, id: nextId("cust"), outstanding: 0, createdAt: new Date().toISOString() };
    writeJSON(CUSTOMERS_KEY, [customer, ...readCustomers()]);
    return delay(customer, 500);
  },

  async updateCustomer(id: string, patch: Partial<CustomerDraft>): Promise<Customer | undefined> {
    const customers = readCustomers();
    const existing = customers.find((c) => c.id === id);
    if (!existing) return delay(undefined);
    const updated = { ...existing, ...patch };
    writeJSON(CUSTOMERS_KEY, customers.map((c) => (c.id === id ? updated : c)));
    return delay(updated, 400);
  },

  async recordSale(customerId: string, reference: string, amount: number): Promise<void> {
    const customers = readCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const updatedCustomer = { ...customer, outstanding: customer.outstanding + amount };
    writeJSON(CUSTOMERS_KEY, customers.map((c) => (c.id === customerId ? updatedCustomer : c)));

    const ledger = readLedger();
    ledger.push({
      id: nextId("led"),
      customerId,
      type: "sale",
      reference,
      description: "Sugar sale",
      amount,
      date: new Date().toISOString(),
      balanceAfter: updatedCustomer.outstanding,
    });
    writeJSON(LEDGER_KEY, ledger);
  },

  async recordPayment(customerId: string, amount: number, reference: string): Promise<void> {
    const customers = readCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const updatedCustomer = { ...customer, outstanding: Math.max(0, customer.outstanding - amount) };
    writeJSON(CUSTOMERS_KEY, customers.map((c) => (c.id === customerId ? updatedCustomer : c)));

    const ledger = readLedger();
    ledger.push({
      id: nextId("led"),
      customerId,
      type: "payment",
      reference,
      description: "Payment received",
      amount: -amount,
      date: new Date().toISOString(),
      balanceAfter: updatedCustomer.outstanding,
    });
    writeJSON(LEDGER_KEY, ledger);
  },

  async getLedger(customerId?: string): Promise<LedgerEntry[]> {
    const all = readLedger();
    const filtered = customerId ? all.filter((e) => e.customerId === customerId) : all;
    return delay(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },

  async getAgeing(customerId: string): Promise<CustomerAgeing> {
    const entries = readLedger().filter((e) => e.customerId === customerId && e.type === "sale");
    const now = Date.now();
    const ageing: CustomerAgeing = { current: 0, days30: 0, days60: 0, days90Plus: 0 };

    entries.forEach((e) => {
      const ageDays = (now - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays <= 30) ageing.current += e.amount;
      else if (ageDays <= 60) ageing.days30 += e.amount;
      else if (ageDays <= 90) ageing.days60 += e.amount;
      else ageing.days90Plus += e.amount;
    });

    return delay(ageing);
  },
};
