"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Factory, ChevronDown, Check, Globe2 } from "lucide-react";
import { BottomSheet } from "@/components/mobile";
import { masterDataService } from "@/services/masterDataService";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type { Mill } from "@/types/master-data";

interface MultiMillPickerProps {
  label?: string;
  /** Empty array means "All Mills". */
  value: string[];
  onChange: (millIds: string[]) => void;
}

/**
 * MultiMillPicker — the Sugar Mill selector for the Post Buy
 * Requirement page. Supports Single Mill, Multiple Mills, or "All
 * Mills" (the empty-selection state) through one control, backed by
 * the real mill master data (masterDataService.getMills() — the same
 * source SearchableMillPicker and MillSelect already use, not
 * placeholder data). Search stays pinned to the top of the sheet while
 * the result list scrolls beneath it, and every row is a real <button>
 * so it's reachable and operable by keyboard/screen reader.
 */
export function MultiMillPicker({ label = "Sugar Mill", value, onChange }: MultiMillPickerProps) {
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

  const isAllMills = value.length === 0;
  const selectedMills = mills.filter((m) => value.includes(m.id));

  function toggleMill(millId: string) {
    onChange(value.includes(millId) ? value.filter((id) => id !== millId) : [...value, millId]);
  }

  function selectAllMills() {
    onChange([]);
  }

  function summaryLabel(): string {
    if (isAllMills) return "All Mills";
    if (selectedMills.length === 1) return `${selectedMills[0].name} — ${selectedMills[0].city}`;
    return `${selectedMills.length} mills selected`;
  }

  return (
    <div>
      {label && <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">{label}</p>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-sm border border-line dark:border-white/15 bg-white dark:bg-white/5 px-3.5 text-sm hover:border-charcoal/30 dark:hover:border-white/30 transition-colors"
      >
        <span className="flex items-center gap-2 truncate text-charcoal dark:text-white">
          {isAllMills ? <Globe2 size={15} className="shrink-0 text-gold-dim" /> : <Factory size={15} className="shrink-0 text-gold-dim" />}
          {summaryLabel()}
        </span>
        <ChevronDown size={15} className="shrink-0 text-ink-faint dark:text-white/40" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Select Sugar Mill">
        <div className="sticky -top-4 z-10 bg-white dark:bg-charcoal-soft pt-1 pb-3">
          <div className="flex items-center gap-2 rounded-sm border border-line dark:border-white/15 px-3 h-11">
            <Search size={16} className="text-ink-faint dark:text-white/40 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by mill name, state, or city"
              className="flex-1 bg-transparent text-[14px] text-charcoal dark:text-white placeholder:text-ink-faint dark:placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={selectAllMills}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left hover:bg-charcoal/[0.04] dark:hover:bg-white/5 transition-colors"
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isAllMills ? "bg-gold text-charcoal" : "bg-gold/10 text-gold-dim"}`}>
            <Globe2 size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium text-charcoal dark:text-white">All Mills</p>
            <p className="text-[11.5px] text-ink-faint dark:text-white/40">Open to any registered sugar mill</p>
          </div>
          {isAllMills && <Check size={16} className="text-gold-dim shrink-0" />}
        </button>

        <div className="my-2 border-t border-line dark:border-white/10" />

        {loading ? (
          <p className="text-[13px] text-ink-faint dark:text-white/40 text-center py-8">Loading mills…</p>
        ) : filtered.length === 0 ? (
          <p className="text-[13px] text-ink-faint dark:text-white/40 text-center py-8">No mills match this search.</p>
        ) : (
          <div className="max-h-[42vh] overflow-y-auto -mx-1">
            {filtered.map((mill) => {
              const selected = value.includes(mill.id);
              return (
                <button
                  key={mill.id}
                  type="button"
                  onClick={() => toggleMill(mill.id)}
                  aria-pressed={selected}
                  className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left hover:bg-charcoal/[0.04] dark:hover:bg-white/5 transition-colors"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${selected ? "bg-gold text-charcoal" : "bg-charcoal/[0.05] dark:bg-white/10 text-ink-faint dark:text-white/50"}`}>
                    <Factory size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-charcoal dark:text-white truncate">{mill.name}</p>
                    <p className="text-[11.5px] text-ink-faint dark:text-white/40">{getMasterStateLabel(mill.state)} · {mill.city}</p>
                  </div>
                  {selected && <Check size={16} className="text-gold-dim shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="pt-3 mt-1 border-t border-line dark:border-white/10">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm bg-charcoal dark:bg-gold py-3 text-[13.5px] font-semibold text-white dark:text-charcoal"
          >
            Done{!isAllMills && ` — ${value.length} selected`}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
