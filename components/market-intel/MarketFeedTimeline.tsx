"use client";

import { useEffect, useState } from "react";
import { DollarSign, PackagePlus, Gavel, Lock, Trophy, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { MarketFeedEvent, MarketFeedEventType } from "@/lib/types/marketIntelligence";

const EVENT_ICON: Record<MarketFeedEventType, typeof DollarSign> = {
  price_revised: DollarSign,
  new_offer: PackagePlus,
  tender_published: Gavel,
  tender_closed: Lock,
  tender_awarded: Trophy,
  dispatch_update: Truck,
};

const EVENT_LABEL: Record<MarketFeedEventType, string> = {
  price_revised: "Price Revised",
  new_offer: "New Offer",
  tender_published: "Tender Published",
  tender_closed: "Tender Closed",
  tender_awarded: "Tender Awarded",
  dispatch_update: "Dispatch Update",
};

interface MarketFeedTimelineProps {
  limit?: number;
}

export function MarketFeedTimeline({ limit = 40 }: MarketFeedTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MarketFeedEvent[]>([]);

  useEffect(() => {
    marketIntelligenceService.getMarketFeed(limit).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {events.map((e) => {
        const Icon = EVENT_ICON[e.type];
        return (
          <li key={e.id} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
              <Icon size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-charcoal">
                <span className="font-medium">{EVENT_LABEL[e.type]}</span> — {e.description}
              </p>
              <p className="text-xs text-ink-faint mt-0.5">
                {getMasterStateLabel(e.state)} · {new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
