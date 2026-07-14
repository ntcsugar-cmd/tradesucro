"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/cards/Card";
import { dealStatusLabel } from "./DealStatusBadge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import { DEAL_STATUS_SEQUENCE } from "@/lib/types/deal";
import type { Deal } from "@/lib/types/deal";

interface DealPipelineBoardProps {
  deals: Deal[];
}

/** DealPipelineBoard — one column per stage in DEAL_STATUS_SEQUENCE (Cancelled deals are intentionally excluded from this forward-flow view). */
export function DealPipelineBoard({ deals }: DealPipelineBoardProps) {
  const router = useRouter();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {DEAL_STATUS_SEQUENCE.map((status) => {
        const columnDeals = deals.filter((d) => d.status === status);
        return (
          <div key={status} className="w-72 shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[12px] font-semibold text-charcoal">{dealStatusLabel(status)}</p>
              <span className="font-mono text-[11px] text-ink-faint">{columnDeals.length}</span>
            </div>
            <div className="space-y-2.5 min-h-[80px]">
              {columnDeals.map((deal) => (
                <Card
                  key={deal.id}
                  padding="sm"
                  interactive
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/deals/${deal.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/deals/${deal.id}`)}
                >
                  <p className="font-mono text-[11px] text-ink-faint">{deal.dealNumber}</p>
                  <p className="text-[13px] font-medium text-charcoal mt-1 truncate">{deal.buyer}</p>
                  <p className="text-xs text-ink-faint mt-0.5">
                    {getProductLabel(deal.product)} · {formatQuantityMt(deal.quantity)}
                  </p>
                  <p className="font-mono text-[13px] text-gold-dim mt-2">{formatINR(deal.totalValue)}</p>
                </Card>
              ))}
              {columnDeals.length === 0 && (
                <div className="rounded-sm border border-dashed border-line p-4 text-center">
                  <p className="text-[11px] text-ink-faint">No deals</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
