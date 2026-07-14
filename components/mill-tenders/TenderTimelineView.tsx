"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { millTenderService } from "@/services/millTender.service";
import type { TenderTimelineEvent } from "@/lib/types/millTender";

interface TenderTimelineViewProps {
  tenderId: string;
}

export function TenderTimelineView({ tenderId }: TenderTimelineViewProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TenderTimelineEvent[]>([]);

  useEffect(() => {
    millTenderService.getTimeline(tenderId).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, [tenderId]);

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
    return <p className="text-[13px] text-ink-faint italic">No activity recorded yet.</p>;
  }

  return (
    <ol className="relative border-l border-line ml-1.5 space-y-5">
      {events.map((e, i) => (
        <li key={e.id} className="pl-5 relative">
          <span className={`absolute -left-[7px] top-1 flex h-3 w-3 items-center justify-center rounded-full ${i === 0 ? "bg-gold" : "bg-charcoal/20"}`}>
            <Circle size={6} fill="white" className="text-white" />
          </span>
          <p className="text-[13px] font-medium text-charcoal">{e.description}</p>
          <p className="text-xs text-ink-faint mt-0.5">
            {e.actor} · {new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </li>
      ))}
    </ol>
  );
}
