import type { ReportDefinition, ReportType } from "@/lib/types/millOperations";

const NETWORK_DELAY_MS = 700;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  { type: "daily_offer", label: "Daily Offer Report", description: "All offers published, updated, or expired today." },
  { type: "price_revision", label: "Price Revision Report", description: "Every price change across all grades, with reasons." },
  { type: "inventory", label: "Inventory Report", description: "Grade-wise opening, production, reserved, and closing stock." },
  { type: "dispatch", label: "Dispatch Report", description: "All dispatches by status, vehicle, and buyer." },
  { type: "offer_performance", label: "Offer Performance", description: "Views, interest received, and conversion by offer." },
];

export interface GeneratedReport {
  type: ReportType;
  generatedAt: string;
  rowCount: number;
}

/**
 * Report Service (mock)
 * ------------------------------------------------------------------
 * No backend — "generating" a report simulates the delay a real export
 * job would take; export buttons (PDF/Excel/CSV) are placeholders per
 * the brief and surface a toast rather than producing a file.
 */
export const reportService = {
  async generateReport(type: ReportType): Promise<GeneratedReport> {
    return delay({ type, generatedAt: new Date().toISOString(), rowCount: 12 + Math.floor(Math.random() * 40) });
  },
};
