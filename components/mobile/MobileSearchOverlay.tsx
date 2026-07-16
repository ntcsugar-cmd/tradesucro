"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, Clock, Bookmark, Mic, X } from "lucide-react";

const RECENT_KEY = "tradesucro-mobile-recent-searches";
const SAVED_KEY = "tradesucro-mobile-saved-searches";
const MAX_RECENT = 8;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(list));
}

interface MobileSearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * MobileSearchOverlay — full-screen search, always one tap away from
 * TopNav's search icon. Recent/saved searches persist locally; voice
 * search is a visible, disabled placeholder (Future Ready).
 */
export function MobileSearchOverlay({ open, onClose, onSearch, placeholder = "Search mills, grades, states…" }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setRecent(readList(RECENT_KEY));
      setSaved(readList(SAVED_KEY));
    }
  }, [open]);

  function commitSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, MAX_RECENT);
    setRecent(updated);
    writeList(RECENT_KEY, updated);
    onSearch(trimmed);
    onClose();
  }

  function toggleSaved(q: string) {
    const updated = saved.includes(q) ? saved.filter((s) => s !== q) : [q, ...saved];
    setSaved(updated);
    writeList(SAVED_KEY, updated);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-modal flex flex-col bg-white dark:bg-charcoal-soft"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-line shrink-0" style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}>
            <button type="button" onClick={onClose} aria-label="Close search" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint active:bg-charcoal/[0.06]">
              <ArrowLeft size={19} />
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-sm border border-line px-3 h-11">
              <Search size={16} className="text-ink-faint shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-[14px] text-charcoal placeholder:text-ink-faint outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear">
                  <X size={15} className="text-ink-faint" />
                </button>
              )}
            </div>
            <button type="button" disabled title="Voice search — coming soon" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-faint/40">
              <Mic size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            {saved.length > 0 && (
              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Saved Searches</p>
                <div className="space-y-1">
                  {saved.map((s) => (
                    <div key={s} className="flex items-center justify-between py-2.5">
                      <button type="button" onClick={() => commitSearch(s)} className="flex items-center gap-3 text-[14px] text-charcoal">
                        <Bookmark size={15} className="text-gold-dim fill-gold-dim" /> {s}
                      </button>
                      <button type="button" onClick={() => toggleSaved(s)} aria-label={`Remove ${s} from saved`}>
                        <X size={14} className="text-ink-faint" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Recent Searches</p>
              {recent.length === 0 ? (
                <p className="text-[13px] text-ink-faint italic">Your recent searches will appear here.</p>
              ) : (
                <div className="space-y-1">
                  {recent.map((r) => (
                    <div key={r} className="flex items-center justify-between py-2.5">
                      <button type="button" onClick={() => commitSearch(r)} className="flex items-center gap-3 text-[14px] text-charcoal">
                        <Clock size={15} className="text-ink-faint" /> {r}
                      </button>
                      <button type="button" onClick={() => toggleSaved(r)} aria-label={`Save ${r}`}>
                        <Bookmark size={14} className={saved.includes(r) ? "text-gold-dim fill-gold-dim" : "text-ink-faint"} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
