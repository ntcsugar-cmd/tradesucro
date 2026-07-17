import { Truck, DollarSign, PackageCheck } from "lucide-react";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Deal } from "@/lib/types/deal";

type CalendarKind = "dispatch" | "payment" | "delivery";

interface DealCalendarViewProps {
  deals: Deal[];
  kind: CalendarKind;
}

function getDateFor(deal: Deal, kind: CalendarKind): string {
  if (kind === "dispatch") return deal.dispatch.dispatchStart;
  if (kind === "delivery") return deal.dispatch.dispatchEnd;
  return deal.dealDate;
}

const ICON: Record<CalendarKind, typeof Truck> = { dispatch: Truck, payment: DollarSign, delivery: PackageCheck };

export function DealCalendarView({ deals, kind }: DealCalendarViewProps) {
  const relevant =
    kind === "payment"
      ? deals.filter((d) => ["payment_pending", "payment_received"].includes(d.status))
      : deals.filter((d) => ["dispatch_scheduled", "loading", "in_transit", "delivered"].includes(d.status));

  const sorted = [...relevant].sort((a, b) => new Date(getDateFor(a, kind)).getTime() - new Date(getDateFor(b, kind)).getTime());
  const Icon = ICON[kind];

  if (sorted.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">Nothing scheduled here right now.</p>;
  }

  return (
    <div className="space-y-2.5">
      {sorted.map((deal) => (
        <div key={deal.id} className="flex items-center justify-between gap-4 rounded-sm border border-line dark:border-white/10 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-charcoal/[0.04] text-ink-faint dark:text-white/40">
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-charcoal dark:text-white">
                {deal.dealNumber} · {deal.mill} → {deal.buyer}
              </p>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
                {getProductLabel(deal.product)} · {formatQuantityMt(deal.quantity)}
                {kind === "payment" && ` · ${formatINR(deal.totalValue)}`}
              </p>
            </div>
          </div>
          <p className="font-mono text-xs text-ink-faint dark:text-white/40 shrink-0">
            {new Date(getDateFor(deal, kind)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}
