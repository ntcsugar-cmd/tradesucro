import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { DispatchEntry, DispatchStatus } from "@/lib/types/millOperations";

const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const TRANSPORTERS = ["Shree Logistics", "BharatLine Carriers", "Speedway Transport", "Kaveri Roadways"];
const BUYERS = ["Nestlé Confectionery Div.", "Britannia Ingredients", "Haldiram Snacks Pvt. Ltd.", "Parle Products Ltd.", "Al Manar Trading LLC"];

function generateDispatches(count: number): DispatchEntry[] {
  const entries: DispatchEntry[] = [];
  const dayOffsets = [-3, -2, -1, 0, 0, 1, 2, 3, 4, 5];
  const statusByOffset = (offset: number, i: number): DispatchStatus => {
    if (offset < 0) return i % 4 === 0 ? "delayed" : "completed";
    if (offset === 0) return "today";
    return "upcoming";
  };

  for (let i = 0; i < count; i++) {
    const offset = dayOffsets[i % dayOffsets.length];
    entries.push({
      id: `disp-${String(i + 1).padStart(3, "0")}`,
      dispatchNumber: `DSP-${String(2000 + i)}`,
      date: daysFromNow(offset),
      product: PRODUCTS[i % PRODUCTS.length].value,
      grade: QUALITY_GRADES[i % QUALITY_GRADES.length],
      quantity: 50 + (i % 6) * 25,
      unit: "mt",
      vehicleNumber: `KA-${10 + (i % 20)}-AB-${1000 + i}`,
      transporter: TRANSPORTERS[i % TRANSPORTERS.length],
      buyerName: BUYERS[i % BUYERS.length],
      status: statusByOffset(offset, i),
    });
  }
  return entries;
}

const DISPATCHES: DispatchEntry[] = generateDispatches(24);

/**
 * Dispatch Calendar Service (mock)
 * ------------------------------------------------------------------
 * No backend — generated deterministically around today's date so the
 * calendar always has a realistic upcoming/today/completed/delayed spread.
 */
export const dispatchService = {
  async getDispatches(): Promise<DispatchEntry[]> {
    return delay([...DISPATCHES].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  },

  async getDispatchesByStatus(status: DispatchEntry["status"]): Promise<DispatchEntry[]> {
    return delay(DISPATCHES.filter((d) => d.status === status));
  },

  async getPendingDispatchCount(): Promise<number> {
    return delay(DISPATCHES.filter((d) => d.status === "upcoming" || d.status === "today").length);
  },

  async getUpcomingLiftingSchedule(limit = 5): Promise<DispatchEntry[]> {
    const upcoming = DISPATCHES.filter((d) => d.status === "upcoming" || d.status === "today")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return delay(upcoming.slice(0, limit));
  },
};
