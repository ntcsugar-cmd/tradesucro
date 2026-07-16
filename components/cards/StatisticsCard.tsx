import { ReactNode } from "react";
import clsx from "clsx";
import { PriceDelta } from "@/components/common/PriceDelta";
import { formatNumber, formatCompactINR } from "@/lib/utils/format";

interface StatisticsCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: ReactNode;
  trend?: { change: number; direction: "up" | "down" | "flat" };
  tone?: "light" | "dark";
  className?: string;
  /** Formats a numeric value as compact Indian currency (₹91.6 Lakh) instead of the full grouped number — use for rupee figures that can run large (Inventory Value, Today's Profit) so they never overflow the card. */
  compact?: boolean;
}

export function StatisticsCard({ label, value, suffix, icon, trend, tone = "light", className, compact = false }: StatisticsCardProps) {
  const isDark = tone === "dark";
  const displayValue = typeof value === "number" ? (compact ? formatCompactINR(value) : formatNumber(value)) : value;

  return (
    <div
      className={clsx(
        "border p-5 sm:p-6 min-w-0",
        isDark
          ? "bg-charcoal border-charcoal-faint text-white dark:bg-charcoal-soft dark:border-white/10"
          : "bg-white border-line text-charcoal dark:bg-charcoal-soft dark:border-white/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={clsx("font-mono text-[11px] uppercase tracking-widest2 truncate", isDark ? "text-white/40" : "text-ink-faint dark:text-white/40")}>
          {label}
        </p>
        {icon && <span className={clsx("shrink-0", isDark ? "text-gold-bright" : "text-gold-dim dark:text-gold-bright")}>{icon}</span>}
      </div>

      <div className="mt-4 flex items-end justify-between gap-2 min-w-0">
        <p
          className={clsx(
            "font-mono font-semibold leading-none min-w-0 truncate",
            // Auto-scale: compact values are short by design (fits at the larger size); long full-precision
            // numbers or string values (which can be arbitrarily long, e.g. a long label) step down a size
            // so they stay inside the card instead of overflowing it.
            typeof value === "number" && (compact || String(displayValue).length <= 9) ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
            isDark ? "text-gold-bright" : "text-charcoal dark:text-gold-bright"
          )}
          title={typeof value === "number" ? formatNumber(value) : undefined}
        >
          {displayValue}
          {suffix && <span className={clsx("text-base font-normal", isDark ? "text-white/50" : "text-ink-faint dark:text-white/50")}>{suffix}</span>}
        </p>
        {trend && (
          <div className="shrink-0">
            <PriceDelta change={trend.change} direction={trend.direction} />
          </div>
        )}
      </div>
    </div>
  );
}
