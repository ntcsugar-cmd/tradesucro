"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketplaceService } from "@/services/marketplace.service";
import type { MarketplaceActivityItem } from "@/lib/types/marketplace";

export function MarketplaceActivityFeed() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MarketplaceActivityItem[]>([]);

  useEffect(() => {
    marketplaceService.getRecentActivity().then((result) => {
      setItems(result);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardWidget title="Recent Market Activity">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                <Activity size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-charcoal leading-snug">{item.title}</p>
                <p className="text-xs text-ink-faint mt-0.5">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
