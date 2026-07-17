"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { millOfferService } from "@/services/millOffer.service";
import type { MillOfferRevision } from "@/lib/types/millOffer";

interface OfferTimelineProps {
  offerId: string;
}

export function OfferTimeline({ offerId }: OfferTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [revisions, setRevisions] = useState<MillOfferRevision[]>([]);

  useEffect(() => {
    millOfferService.getOfferHistory(offerId).then((result) => {
      setRevisions(result);
      setLoading(false);
    });
  }, [offerId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (revisions.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">No changes recorded yet.</p>;
  }

  return (
    <ol className="relative border-l border-line dark:border-white/10 ml-1.5 space-y-5">
      {revisions.map((rev, i) => (
        <li key={rev.id} className="pl-5 relative">
          <span className={`absolute -left-[7px] top-1 flex h-3 w-3 items-center justify-center rounded-full ${i === 0 ? "bg-gold" : "bg-charcoal/20"}`}>
            <Circle size={6} fill="white" className="text-white" />
          </span>
          <p className="text-[13px] font-medium text-charcoal dark:text-white">{rev.fieldsModified.join(", ")}</p>
          <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
            Rev {rev.revisionNumber} · {rev.changedBy} · {new Date(rev.changedOn).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </li>
      ))}
    </ol>
  );
}
