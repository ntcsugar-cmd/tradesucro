"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Factory, ChevronDown } from "lucide-react";
import { BottomSheet } from "@/components/mobile";
import { masterDataService } from "@/services/masterDataService";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type { Mill } from "@/types/master-data";

interface SearchableMillPickerProps {
  label?: string;
  value?: Mill | null;
  placeholder?: string;
  onSelect: (mill: Mill) => void;
  error?: string;
}

/**
 * SearchableMillPicker — a fast-filtering mill selector for screens
 * where a plain <select> isn't usable at real scale (search by name,
 * state, or city/district in one field, smooth-scrolling result list).
 * Built on the existing BottomSheet (the app's established large-list
 * mobile selector pattern) rather than a new modal implementation.
 * Filtering is a simple substring match — correct and fast at today's
 * 50-mill master list, and the one place to swap in real
 * pagination/virtualization if the master list grows into the
 * thousands the brief anticipates, without touching any call site.
 */
export function SearchableMillPicker({ label = "Mill", value, placeholder = "Search mill, state, or city…", onSelect, error }: SearchableMillPickerProps) {
  const [open, setOpen] = useState(false);
  const [mills, setMills] = useState<Mill[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    masterDataService.getMills().then((result) => {
      setMills(result);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mills;
    return mills.filter((m) => {
      const stateLabel = getMasterStateLabel(m.state).toLowerCase();
      return m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q) || stateLabel.includes(q) || m.state.toLowerCase().includes(q);
    });
  }, [mills, query]);

  function handleSelect(mill: Mill) {
    onSelect(mill);
    setOpen(false);
    setQuery("");
  }

  return (
    <div>
      {label && <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">{label}</p>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-sm border bg-white dark:bg-white/5 px-3.5 text-sm transition-colors ${
          error ? "border-danger" : "border-line dark:border-white/15 hover:border-charcoal/30 dark:hover:border-white/30"
        }`}
      >
        <span className={`flex items-center gap-2 truncate ${value ? "text-charcoal dark:text-white" : "text-ink-faint dark:text-white/40"}`}>
          <Factory size={15} className="shrink-0 text-gold-dim" />
          {value ? `${value.name} — ${value.city}` : placeholder}
        </span>
        <ChevronDown size={15} className="shrink-0 text-ink-faint dark:text-white/40" />
      </button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Select Mill">
        <div className="flex items-center gap-2 rounded-sm border border-line dark:border-white/15 px-3 h-11 mb-4">
          <Search size={16} className="text-ink-faint dark:text-white/40 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by mill name, state, or city"
            className="flex-1 bg-transparent text-[14px] text-charcoal dark:text-white placeholder:text-ink-faint dark:placeholder:text-white/40 outline-none"
          />
        </div>

        {loading ? (
          <p className="text-[13px] text-ink-faint dark:text-white/40 text-center py-8">Loading mills…</p>
        ) : filtered.length === 0 ? (
          <p className="text-[13px] text-ink-faint dark:text-white/40 text-center py-8">No mills match this search.</p>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto -mx-1">
            {filtered.map((mill) => (
              <button
                key={mill.id}
                type="button"
                onClick={() => handleSelect(mill)}
                className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left hover:bg-charcoal/[0.04] dark:hover:bg-white/5 transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                  <Factory size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-charcoal dark:text-white truncate">{mill.name}</p>
                  <p className="text-[11.5px] text-ink-faint dark:text-white/40">
                    {mill.city}, {getMasterStateLabel(mill.state)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
