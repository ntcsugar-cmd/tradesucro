import { ArrowUpRight, ArrowDownRight, Minus, Pencil, History } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillPriceQuote } from "@/lib/types/millPricing";

interface PriceBoardTableProps {
  quotes: MillPriceQuote[];
  onUpdatePrice: (quote: MillPriceQuote) => void;
  onViewHistory: (quote: MillPriceQuote) => void;
}

const STATUS_META = {
  active: { label: "Active", badgeStatus: "success" as const },
  on_hold: { label: "On Hold", badgeStatus: "warning" as const },
  withdrawn: { label: "Withdrawn", badgeStatus: "danger" as const },
};

export function PriceBoardTable({ quotes, onUpdatePrice, onViewHistory }: PriceBoardTableProps) {
  return (
    <div className="border border-line dark:border-white/10">
      <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_0.9fr_1fr_0.8fr_auto] gap-4 px-5 py-3 bg-charcoal/[0.03] text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">
        <span>Grade</span>
        <span>Today&rsquo;s Price</span>
        <span>Yesterday</span>
        <span>Difference</span>
        <span>Qty Available</span>
        <span>Status</span>
        <span />
      </div>
      {quotes.map((q) => {
        const diff = q.todaysPrice - q.yesterdayPrice;
        const meta = STATUS_META[q.status];
        return (
          <div
            key={q.id}
            className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_0.9fr_1fr_0.8fr_auto] gap-x-4 gap-y-2 px-5 py-4 border-t border-line dark:border-white/10 items-center"
          >
            <div className="col-span-2 md:col-span-1">
              <p className="font-medium text-charcoal dark:text-white">{getProductLabel(q.product)}</p>
              <p className="text-xs text-ink-faint dark:text-white/40">{q.grade}</p>
            </div>
            <p className="font-mono text-sm text-charcoal dark:text-white">{formatINR(q.todaysPrice)}</p>
            <p className="font-mono text-sm text-ink-faint dark:text-white/40">{formatINR(q.yesterdayPrice)}</p>
            <span
              className={`flex items-center gap-1 font-mono text-xs ${diff > 0 ? "text-rise" : diff < 0 ? "text-fall" : "text-ink-faint dark:text-white/40"}`}
            >
              {diff > 0 ? <ArrowUpRight size={13} /> : diff < 0 ? <ArrowDownRight size={13} /> : <Minus size={13} />}
              {formatINR(Math.abs(diff))}
            </span>
            <p className="font-mono text-sm text-charcoal dark:text-white">{formatQuantityMt(q.quantityAvailable)}</p>
            <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>
            <div className="flex items-center gap-1 justify-end">
              <IconButton variant="ghost" size="sm" aria-label={`Update price for ${getProductLabel(q.product)}`} onClick={() => onUpdatePrice(q)}>
                <Pencil size={14} />
              </IconButton>
              <IconButton variant="ghost" size="sm" aria-label={`View price history for ${getProductLabel(q.product)}`} onClick={() => onViewHistory(q)}>
                <History size={14} />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}
