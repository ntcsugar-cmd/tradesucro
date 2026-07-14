/**
 * Season master list — the Indian sugar industry's crop year (October
 * to September, conventionally labeled by the two calendar years it
 * spans). Season is mandatory on every Buy Requirement, Sell Offer,
 * Tender, and appears in every filter, card, dashboard, and report —
 * this is the single source of truth for all of them.
 */
export type Season = "2023-2024" | "2024-2025" | "2025-2026" | "2026-2027";

export const SEASONS: Season[] = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

export const DEFAULT_SEASON: Season = "2025-2026";

export const SEASON_OPTIONS = SEASONS.map((s) => ({ value: s, label: s }));
