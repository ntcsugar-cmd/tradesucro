"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/common/Badge";
import { dispatchService } from "@/services/dispatch.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { DispatchEntry } from "@/lib/types/millOperations";

export function UpcomingLiftingWidget() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<DispatchEntry[]>([]);

  useEffect(() => {
    dispatchService.getUpcomingLiftingSchedule(5).then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardWidget
      title="Upcoming Lifting Schedule"
      action={
        <Link href="/dispatch-calendar" className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
          Full calendar
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-[13px] text-ink-faint italic">No upcoming liftings scheduled.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] text-charcoal truncate">{getProductLabel(e.product)} → {e.buyerName}</p>
                <p className="text-xs text-ink-faint mt-0.5">{formatQuantityMt(e.quantity)} · {e.vehicleNumber}</p>
              </div>
              <Badge tone={e.status === "today" ? "gold" : "charcoal"}>
                {new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
