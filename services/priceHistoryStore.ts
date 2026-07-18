export interface PriceSnapshot<T> {
  providerId: string;
  capturedAt: string;
  data: T;
}

export type HistoryWindow = "intraday" | "daily" | "weekly" | "monthly" | "yearly";

const SNAPSHOT_KEY_PREFIX = "tradesucro-price-history-";
const MAX_SNAPSHOTS_PER_PROVIDER = 500;

const WINDOW_MS: Record<HistoryWindow, number> = {
  intraday: 24 * 60 * 60 * 1000,
  daily: 7 * 24 * 60 * 60 * 1000,
  weekly: 30 * 24 * 60 * 60 * 1000,
  monthly: 365 * 24 * 60 * 60 * 1000,
  yearly: 5 * 365 * 24 * 60 * 60 * 1000,
};

function key(providerId: string): string {
  return `${SNAPSHOT_KEY_PREFIX}${providerId}`;
}

function readSnapshots<T>(providerId: string): PriceSnapshot<T>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(providerId));
    return raw ? (JSON.parse(raw) as PriceSnapshot<T>[]) : [];
  } catch {
    return [];
  }
}

function writeSnapshots<T>(providerId: string, snapshots: PriceSnapshot<T>[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(providerId), JSON.stringify(snapshots));
}

export const priceHistoryStore = {
  /**
   * Appends a new snapshot — never replaces or mutates a prior one.
   * Only called after a successful fetch (see providerRuntime), so a
   * failed refresh never writes a "blank" entry over real data.
   */
  record<T>(providerId: string, data: T): PriceSnapshot<T> {
    const snapshot: PriceSnapshot<T> = { providerId, capturedAt: new Date().toISOString(), data };
    const existing = readSnapshots<T>(providerId);
    // Oldest entries roll off past the cap — a storage limit, not an "overwrite": every entry that existed was genuinely recorded, only the longest-retained window is capped for a browser-storage backend.
    const next = [snapshot, ...existing].slice(0, MAX_SNAPSHOTS_PER_PROVIDER);
    writeSnapshots(providerId, next);
    return snapshot;
  },

  getLatest<T>(providerId: string): PriceSnapshot<T> | null {
    return readSnapshots<T>(providerId)[0] ?? null;
  },

  /** The "last verified" value — this is what a page shows instead of "Not Connected" when the live provider is currently failing. */
  getLastVerified<T>(providerId: string): PriceSnapshot<T> | null {
    return priceHistoryStore.getLatest<T>(providerId);
  },

  getWindow<T>(providerId: string, window: HistoryWindow): PriceSnapshot<T>[] {
    const cutoff = Date.now() - WINDOW_MS[window];
    return readSnapshots<T>(providerId)
      .filter((s) => new Date(s.capturedAt).getTime() >= cutoff)
      .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  },

  getAll<T>(providerId: string): PriceSnapshot<T>[] {
    return readSnapshots<T>(providerId).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  },

  count(providerId: string): number {
    return readSnapshots(providerId).length;
  },
};
