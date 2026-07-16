import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { MasterGrade, MasterGradeDraft, GradeMarketClassification } from "@/lib/types/masterDataAdmin";

const STORAGE_KEY = "tradesucro-master-grades";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function classificationFor(code: string): GradeMarketClassification {
  return code.startsWith("ICUMSA") ? "export" : "both";
}

function seed(): MasterGrade[] {
  const now = new Date().toISOString();
  return QUALITY_GRADES.map((code, i) => ({
    id: `grade-${code.replace(/\s+/g, "-").toLowerCase()}`,
    code,
    displayName: code,
    applicableProducts: [],
    classification: classificationFor(code),
    status: "active" as const,
    sortOrder: (i + 1) * 10,
    createdAt: now,
    updatedAt: now,
  }));
}

function readAll(): MasterGrade[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MasterGrade[];
  } catch {
    // fall through to reseed
  }
  const seeded = seed();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeAll(records: MasterGrade[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Grade Master Service
 * ------------------------------------------------------------------
 * The admin-manageable Grade Master: Add / Edit / Deactivate / Reorder,
 * plus the applicable-products and domestic/export classification the
 * brief specifically calls out. Same localStorage-as-database pattern
 * as productMaster.service.ts.
 */
export const gradeMasterService = {
  async getAll(): Promise<MasterGrade[]> {
    return delay([...readAll()].sort((a, b) => a.sortOrder - b.sortOrder));
  },

  async getActive(): Promise<MasterGrade[]> {
    const all = await gradeMasterService.getAll();
    return all.filter((g) => g.status === "active");
  },

  async getActiveForProduct(productCode: string): Promise<MasterGrade[]> {
    const active = await gradeMasterService.getActive();
    return active.filter((g) => g.applicableProducts.length === 0 || g.applicableProducts.includes(productCode));
  },

  async getById(id: string): Promise<MasterGrade | undefined> {
    return readAll().find((g) => g.id === id);
  },

  async create(draft: MasterGradeDraft): Promise<MasterGrade> {
    const records = readAll();
    const code = draft.code.trim();
    if (!code) throw new Error("Grade code is required.");
    if (records.some((g) => g.code.toLowerCase() === code.toLowerCase())) {
      throw new Error(`A grade with code "${code}" already exists.`);
    }
    const now = new Date().toISOString();
    const maxSort = records.reduce((m, g) => Math.max(m, g.sortOrder), 0);
    const record: MasterGrade = {
      id: `grade-${code.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
      code,
      displayName: draft.displayName.trim() || code,
      applicableProducts: draft.applicableProducts,
      classification: draft.classification,
      status: "active",
      sortOrder: maxSort + 10,
      createdAt: now,
      updatedAt: now,
    };
    writeAll([...records, record]);
    return delay(record, 400);
  },

  async update(id: string, draft: Partial<MasterGradeDraft>): Promise<MasterGrade> {
    const records = readAll();
    const existing = records.find((g) => g.id === id);
    if (!existing) throw new Error("Grade not found.");
    const updated: MasterGrade = { ...existing, ...draft, updatedAt: new Date().toISOString() };
    writeAll(records.map((g) => (g.id === id ? updated : g)));
    return delay(updated, 400);
  },

  async setStatus(id: string, status: "active" | "inactive"): Promise<MasterGrade> {
    const records = readAll();
    const existing = records.find((g) => g.id === id);
    if (!existing) throw new Error("Grade not found.");
    const updated: MasterGrade = { ...existing, status, updatedAt: new Date().toISOString() };
    writeAll(records.map((g) => (g.id === id ? updated : g)));
    return delay(updated, 300);
  },

  async reorder(id: string, direction: "up" | "down"): Promise<MasterGrade[]> {
    const records = [...readAll()].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = records.findIndex((g) => g.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= records.length) return delay(records, 150);

    const a = records[index];
    const b = records[swapWith];
    const now = new Date().toISOString();
    const aUpdated = { ...a, sortOrder: b.sortOrder, updatedAt: now };
    const bUpdated = { ...b, sortOrder: a.sortOrder, updatedAt: now };
    const next = records.map((g) => (g.id === a.id ? aUpdated : g.id === b.id ? bUpdated : g));
    writeAll(next);
    return delay([...next].sort((x, y) => x.sortOrder - y.sortOrder), 250);
  },
};
