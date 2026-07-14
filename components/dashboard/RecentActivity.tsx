"use client";

import { useEffect, useState } from "react";
import { PackageCheck, Handshake, ShieldCheck, FileCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { dashboardService, type ActivityItem } from "@/services/dashboard.service";

const ICON_BY_TYPE: Record<ActivityItem["type"], typeof PackageCheck> = {
  offer_posted: PackageCheck,
  requirement_matched: Handshake,
  mill_verified: ShieldCheck,
  deal_confirmed: FileCheck,
};

/** RecentActivity — fetches from dashboardService.getRecentActivity() (mock today, API later). */
export function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    dashboardService.getRecentActivity().then((result) => {
      if (cancelled) return;
      setItems(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardBody>
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <EmptyState title="No activity yet" description="Post your first offer or requirement to see activity here." />
        )}

        {!loading && items.length > 0 && (
          <ul className="space-y-4">
            {items.map((item) => {
              const Icon = ICON_BY_TYPE[item.type];
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal leading-snug">{item.title}</p>
                    <p className="text-xs text-ink-faint mt-0.5">{item.timestamp}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
