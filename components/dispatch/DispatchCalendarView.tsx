import { Truck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { DispatchEntry, DispatchStatus } from "@/lib/types/millOperations";

const STATUS_LABEL: Record<DispatchStatus, string> = {
  today: "Today's Dispatches",
  upcoming: "Upcoming Dispatches",
  completed: "Completed Dispatches",
  delayed: "Delayed Dispatches",
};

const STATUS_TONE: Record<DispatchStatus, "gold" | "charcoal" | "verified" | "urgent"> = {
  today: "gold",
  upcoming: "charcoal",
  completed: "verified",
  delayed: "urgent",
};

function DispatchRow({ entry }: { entry: DispatchEntry }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-sm border border-line p-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-charcoal/[0.04] text-ink-faint">
          {entry.status === "delayed" ? <ShieldAlert size={16} className="text-danger" /> : <Truck size={16} />}
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium text-charcoal">
            {entry.dispatchNumber} · {getProductLabel(entry.product)} ({entry.grade})
          </p>
          <p className="text-xs text-ink-faint mt-0.5">
            {formatQuantityMt(entry.quantity)} → {entry.buyerName} · {entry.vehicleNumber} · {entry.transporter}
          </p>
        </div>
      </div>
      <p className="font-mono text-xs text-ink-faint shrink-0">
        {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
      </p>
    </div>
  );
}

interface DispatchCalendarViewProps {
  entries: DispatchEntry[];
}

/** DispatchCalendarView — agenda-style grouping (Today / Upcoming / Completed / Delayed) rather than a full month-grid calendar widget, appropriate for a Phase-1 scope. */
export function DispatchCalendarView({ entries }: DispatchCalendarViewProps) {
  const order: DispatchStatus[] = ["today", "delayed", "upcoming", "completed"];

  return (
    <div className="space-y-8">
      {order.map((status) => {
        const group = entries.filter((e) => e.status === status);
        if (group.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-3">
              <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
              <span className="text-xs text-ink-faint">{group.length}</span>
            </div>
            <div className="space-y-2.5">
              {group.map((entry) => (
                <DispatchRow key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
