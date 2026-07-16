"use client";

import { useState, type ReactNode } from "react";

interface MillNameScrollProps {
  name: string;
  className?: string;
  /** Verified badge, rank icon, etc. — rendered inline before the name, outside the scroll area so it never scrolls away. */
  prefix?: ReactNode;
}

/**
 * MillNameScroll — the single implementation for "Mill Name must support
 * horizontal scrolling" across every Offer, Buy Requirement, Search,
 * Comparison, Watchlist, and Favorites surface. Renders the full official
 * name on one line (never wraps, never truncates with an ellipsis that
 * hides real information), scrollable by touch swipe or mouse/trackpad,
 * with the scrollbar hidden via the existing .scrollbar-none utility
 * (app/globals.css) rather than introducing a new styling approach.
 * Hover (desktop) or tap (mobile) reveals a small popover with the
 * complete name, for names that still don't fully fit in view.
 */
export function MillNameScroll({ name, className = "", prefix }: MillNameScrollProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div className={`relative flex min-w-0 items-center gap-1.5 ${className}`}>
      {prefix}
      <div
        title={name}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setTooltipOpen((v) => !v);
        }}
        onTouchStart={(e) => e.stopPropagation()}
        className="scrollbar-none min-w-0 flex-1 overflow-x-auto whitespace-nowrap"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <span className="inline-block">{name}</span>
      </div>

      {tooltipOpen && (
        <>
          <div className="fixed inset-0 z-tooltip" onClick={(e) => { e.stopPropagation(); setTooltipOpen(false); }} aria-hidden />
          <div className="absolute left-0 top-full z-tooltip mt-1.5 max-w-xs rounded-sm border border-line bg-charcoal px-3 py-2 text-[12.5px] leading-snug text-white shadow-lg dark:border-white/10">
            {name}
          </div>
        </>
      )}
    </div>
  );
}
