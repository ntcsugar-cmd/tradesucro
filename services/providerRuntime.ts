import type { ProviderHistoryEntry } from "@/lib/types/marketDataProvider";
import { priceHistoryStore } from "./priceHistoryStore";

const HISTORY_KEY = "tradesucro-provider-history";
const MAX_HISTORY_PER_PROVIDER = 50;
const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = [200, 500, 1000];

function readHistory(): ProviderHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ProviderHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: ProviderHistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function recordAttempt(entry: ProviderHistoryEntry) {
  const all = readHistory();
  const forProvider = all.filter((e) => e.providerId === entry.providerId);
  const others = all.filter((e) => e.providerId !== entry.providerId);
  const trimmed = [entry, ...forProvider].slice(0, MAX_HISTORY_PER_PROVIDER);
  writeHistory([...others, ...trimmed]);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RunResult<T> {
  succeeded: boolean;
  data: T | null;
  retryCount: number;
  errorMessage: string | null;
}

/** Validate stage — rejects obviously malformed responses (null, or an array that's unexpectedly empty when the provider is supposed to always return records) before they ever reach normalize/dedupe or the UI. */
function isValid<T>(data: T): boolean {
  if (data === null || data === undefined) return false;
  if (Array.isArray(data)) return true; // an empty array is valid (e.g. no active listings right now) — only null/undefined is rejected
  return true;
}

/** Remove Duplicates stage — for array-shaped provider results, drops repeated entries by a natural identity key (id if present, otherwise the whole entry's JSON shape). Non-array results pass through unchanged. */
function dedupe<T>(data: T): T {
  if (!Array.isArray(data)) return data;
  const seen = new Set<string>();
  const deduped = data.filter((item) => {
    const identity = typeof item === "object" && item !== null && "id" in item ? String((item as { id: unknown }).id) : JSON.stringify(item);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
  return deduped as T;
}

/**
 * Runs a provider's fetch function through the full pipeline: Fetch →
 * Validate → Dedupe → Store History (price snapshots, append-only) →
 * Log Provider Health (fetch-attempt history). Retries with
 * exponential backoff (MAX_RETRIES attempts) before giving up. A
 * failure here never throws past the caller — it returns a result the
 * caller uses to fall back to the last verified snapshot, per "never
 * display Not Connected, show the last verified price instead."
 */
export async function runProviderFetch<T>(providerId: string, fn: () => Promise<T>, countRecords: (data: T) => number): Promise<RunResult<T>> {
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await fn();
      if (!isValid(raw)) throw new Error("Provider returned invalid data (null/undefined).");
      const data = dedupe(raw);

      // Store History — every successful fetch is appended as a new, permanent snapshot. Never overwrites a prior one.
      priceHistoryStore.record(providerId, data);

      recordAttempt({
        providerId,
        attemptedAt: new Date().toISOString(),
        succeeded: true,
        retryCount: attempt,
        errorMessage: null,
        recordCount: countRecords(data),
      });
      return { succeeded: true, data, retryCount: attempt, errorMessage: null };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BACKOFF_MS[attempt] ?? 1000);
      }
    }
  }

  recordAttempt({
    providerId,
    attemptedAt: new Date().toISOString(),
    succeeded: false,
    retryCount: MAX_RETRIES,
    errorMessage: lastError,
    recordCount: 0,
  });
  return { succeeded: false, data: null, retryCount: MAX_RETRIES, errorMessage: lastError };
}

export interface ProviderHealthMetrics {
  successRatePercent: number;
  totalAttempts: number;
  recordsImportedLatest: number;
  dataQuality: "good" | "degraded" | "poor" | "unknown";
}

export const providerHistoryStore = {
  getForProvider(providerId: string): ProviderHistoryEntry[] {
    return readHistory()
      .filter((e) => e.providerId === providerId)
      .sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
  },
  getConsecutiveFailures(providerId: string): number {
    const entries = providerHistoryStore.getForProvider(providerId);
    let count = 0;
    for (const e of entries) {
      if (e.succeeded) break;
      count++;
    }
    return count;
  },
  getLastSuccess(providerId: string): ProviderHistoryEntry | null {
    return providerHistoryStore.getForProvider(providerId).find((e) => e.succeeded) ?? null;
  },
  getLastAttempt(providerId: string): ProviderHistoryEntry | null {
    return providerHistoryStore.getForProvider(providerId)[0] ?? null;
  },
  /** Success Rate + Records Imported + Data Quality — the Admin Data Source Dashboard metrics, computed from real recorded attempts rather than displayed as static labels. */
  getHealthMetrics(providerId: string): ProviderHealthMetrics {
    const entries = providerHistoryStore.getForProvider(providerId);
    if (entries.length === 0) return { successRatePercent: 0, totalAttempts: 0, recordsImportedLatest: 0, dataQuality: "unknown" };

    const successes = entries.filter((e) => e.succeeded);
    const successRatePercent = Math.round((successes.length / entries.length) * 100);
    const recordsImportedLatest = successes[0]?.recordCount ?? 0;
    const dataQuality: ProviderHealthMetrics["dataQuality"] = successRatePercent >= 90 ? "good" : successRatePercent >= 50 ? "degraded" : successes.length > 0 ? "poor" : "unknown";

    return { successRatePercent, totalAttempts: entries.length, recordsImportedLatest, dataQuality };
  },
};
