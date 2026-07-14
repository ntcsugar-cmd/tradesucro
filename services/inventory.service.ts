import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { GradeInventory } from "@/lib/types/millOperations";

const STORAGE_KEY = "tradesucro-mill-inventory";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function computeDerived(row: Pick<GradeInventory, "openingStock" | "todaysProduction" | "reservedStock" | "dispatched">) {
  const totalStock = row.openingStock + row.todaysProduction;
  const availableStock = Math.max(0, totalStock - row.reservedStock);
  const closingStock = Math.max(0, totalStock - row.dispatched);
  return { totalStock, availableStock, closingStock };
}

function seedInventory(): GradeInventory[] {
  return PRODUCTS.slice(0, 6).map((product, i) => {
    const openingStock = 800 + i * 120;
    const todaysProduction = 150 + (i % 4) * 40;
    const reservedStock = 100 + (i % 3) * 60;
    const dispatched = 90 + (i % 5) * 30;
    const derived = computeDerived({ openingStock, todaysProduction, reservedStock, dispatched });

    return {
      id: `inv-${i + 1}`,
      product: product.value,
      grade: QUALITY_GRADES[i % QUALITY_GRADES.length],
      unit: "mt",
      openingStock,
      todaysProduction,
      reservedStock,
      dispatched,
      ...derived,
    };
  });
}

function readInventory(): GradeInventory[] {
  if (typeof window === "undefined") return seedInventory();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GradeInventory[];
  } catch {
    // fall through
  }
  const seeded = seedInventory();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeInventory(rows: GradeInventory[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

/**
 * Inventory Service (mock)
 * ------------------------------------------------------------------
 * Business Rule: "Inventory should never become negative" — every
 * derived bucket (availableStock, closingStock) is clamped to zero in
 * computeDerived(), the single place these values are calculated.
 */
export const inventoryService = {
  async getInventory(): Promise<GradeInventory[]> {
    return delay(readInventory());
  },

  async adjustReserved(id: string, delta: number): Promise<GradeInventory | undefined> {
    const rows = readInventory();
    const row = rows.find((r) => r.id === id);
    if (!row) return delay(undefined);

    const reservedStock = Math.max(0, row.reservedStock + delta);
    const derived = computeDerived({ ...row, reservedStock });
    const updated: GradeInventory = { ...row, reservedStock, ...derived };
    writeInventory(rows.map((r) => (r.id === id ? updated : r)));
    return delay(updated, 400);
  },

  async getTotalAvailableStock(): Promise<number> {
    const rows = readInventory();
    return delay(rows.reduce((sum, r) => sum + r.availableStock, 0));
  },
};
