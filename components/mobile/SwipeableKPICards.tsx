import type { ReactNode } from "react";

export interface SwipeableKPI {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "dark";
}

interface SwipeableKPICardsProps {
  items: SwipeableKPI[];
}

/**
 * SwipeableKPICards — a horizontal, snap-scrolling KPI carousel. This
 * is the mobile counterpart to StatisticsCard grids: same data, but a
 * grid of 6-10 stat cards doesn't fit a phone width, so this swipes
 * one/one-and-a-half cards at a time instead of wrapping into a wall
 * of small tiles.
 */
export function SwipeableKPICards({ items }: SwipeableKPICardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
      {items.map((item) => (
        <div
          key={item.label}
          className={`shrink-0 w-[42%] min-w-[150px] snap-start rounded-sm p-4 ${
            item.tone === "dark" ? "bg-charcoal text-white" : "border border-line bg-white text-charcoal"
          }`}
        >
          {item.icon && <div className={`mb-2 ${item.tone === "dark" ? "text-white/60" : "text-ink-faint"}`}>{item.icon}</div>}
          <p className={`text-[11px] ${item.tone === "dark" ? "text-white/60" : "text-ink-faint"}`}>{item.label}</p>
          <p className={`font-mono text-[17px] font-semibold mt-1 ${item.tone === "dark" ? "text-white" : "text-charcoal"}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
