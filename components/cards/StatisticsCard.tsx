import { ReactNode } from "react";
import clsx from "clsx";
import { PriceDelta } from "@/components/common/PriceDelta";
import { formatNumber } from "@/lib/utils/format";

interface StatisticsCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: ReactNode;
  trend?: { change: number; direction: "up" | "down" | "flat" };
  tone?: "light" | "dark";
  className?: string;
}

export function StatisticsCard({ label, value, suffix, icon, trend, tone = "light", className }: StatisticsCardProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={clsx(
        "border p-6",
        isDark ? "bg-charcoal border-charcoal-faint text-white" : "bg-white border-line text-charcoal",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className={clsx("font-mono text-[11px] uppercase tracking-widest2", isDark ? "text-white/40" : "text-ink-faint")}>
          {label}
        </p>
        {icon && <span className={isDark ? "text-gold-bright" : "text-gold-dim"}>{icon}</span>}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className={clsx("font-mono text-3xl", isDark ? "text-gold-bright" : "text-charcoal")}>
          {typeof value === "number" ? formatNumber(value) : value}
          {suffix && <span className={isDark ? "text-white/50" : "text-ink-faint"}>{suffix}</span>}
        </p>
        {trend && <PriceDelta change={trend.change} direction={trend.direction} />}
      </div>
    </div>
  );
}
