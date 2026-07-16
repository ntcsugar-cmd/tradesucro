import { PRODUCTS } from "@/lib/master-data/products";
import type { MasterProduct, MasterProductDraft } from "@/lib/types/masterDataAdmin";

const STORAGE_KEY = "tradesucro-master-products";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function seed(): MasterProduct[] {
  const now = new Date().toISOString();
  return PRODUCTS.map((p, i) => ({
    id: `prod-${p.value}`,
    code: p.value,
    displayName: p.label,
    status: "active" as const,
    sortOrder: (i + 1) * 10,
    createdAt: now,
    updatedAt: now,
  }));
}

function readAll(): MasterProduct[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MasterProduct[];
  } catch {
    // fall through to reseed
  }
  const seeded = seed();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeAll(records: MasterProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Product Master Service
 * ------------------------------------------------------------------
 * The admin-manageable Product Master: Add / Edit / Deactivate /
 * Reorder, exactly as the brief specifies. Every write goes through
 * here — there is no other place in the app that should ever mutate
 * product records.
 */
export const productMasterService = {
  async getAll(): Promise<MasterProduct[]> {
    return delay([...readAll()].sort((a, b) => a.sortOrder - b.sortOrder));
  },

  async getActive(): Promise<MasterProduct[]> {
    const all = await productMasterService.getAll();
    return all.filter((p) => p.status === "active");
  },

  async getById(id: string): Promise<MasterProduct | undefined> {
    return readAll().find((p) => p.id === id);
  },

  async create(draft: MasterProductDraft): Promise<MasterProduct> {
    const records = readAll();
    const code = draft.code.trim() || slugify(draft.displayName);
    if (records.some((p) => p.code === code)) {
      throw new Error(`A product with code "${code}" already exists.`);
    }
    const now = new Date().toISOString();
    const maxSort = records.reduce((m, p) => Math.max(m, p.sortOrder), 0);
    const record: MasterProduct = {
      id: `prod-${code}-${Date.now()}`,
      code,
      displayName: draft.displayName.trim(),
      status: "active",
      sortOrder: maxSort + 10,
      createdAt: now,
      updatedAt: now,
    };
    writeAll([...records, record]);
    return delay(record, 400);
  },

  async update(id: string, draft: Partial<MasterProductDraft>): Promise<MasterProduct> {
    const records = readAll();
    const existing = records.find((p) => p.id === id);
    if (!existing) throw new Error("Product not found.");
    const updated: MasterProduct = { ...existing, ...draft, updatedAt: new Date().toISOString() };
    writeAll(records.map((p) => (p.id === id ? updated : p)));
    return delay(updated, 400);
  },

  async setStatus(id: string, status: "active" | "inactive"): Promise<MasterProduct> {
    const records = readAll();
    const existing = records.find((p) => p.id === id);
    if (!existing) throw new Error("Product not found.");
    const updated: MasterProduct = { ...existing, status, updatedAt: new Date().toISOString() };
    writeAll(records.map((p) => (p.id === id ? updated : p)));
    return delay(updated, 300);
  },

  /** Reorders by moving one record up or down relative to its current position among ALL records (not just active ones), so the sequence stays stable across filtering. */
  async reorder(id: string, direction: "up" | "down"): Promise<MasterProduct[]> {
    const records = [...readAll()].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = records.findIndex((p) => p.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= records.length) return delay(records, 150);

    const a = records[index];
    const b = records[swapWith];
    const now = new Date().toISOString();
    const aUpdated = { ...a, sortOrder: b.sortOrder, updatedAt: now };
    const bUpdated = { ...b, sortOrder: a.sortOrder, updatedAt: now };
    const next = records.map((p) => (p.id === a.id ? aUpdated : p.id === b.id ? bUpdated : p));
    writeAll(next);
    return delay([...next].sort((x, y) => x.sortOrder - y.sortOrder), 250);
  },
};
