"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { dealService } from "@/services/deal.service";
import type { DealTimelineEvent } from "@/lib/types/deal";

interface DealTimelineViewProps {
  dealId: string;
}

export function DealTimelineView({ dealId }: DealTimelineViewProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<DealTimelineEvent[]>([]);

  useEffect(() => {
    dealService.getTimeline(dealId).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, [dealId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">No activity recorded yet.</p>;
  }

  return (
    <ol className="relative border-l border-line dark:border-white/10 ml-1.5 space-y-5">
      {events.map((e, i) => (
        <li key={e.id} className="pl-5 relative">
          <span className={`absolute -left-[7px] top-1 flex h-3 w-3 items-center justify-center rounded-full ${i === 0 ? "bg-gold" : "bg-charcoal/20"}`}>
            <Circle size={6} fill="white" className="text-white" />
          </span>
          <p className="text-[13px] font-medium text-charcoal dark:text-white">{e.description}</p>
          <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
            {e.actor} · {new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </li>
      ))}
    </ol>
  );
}
