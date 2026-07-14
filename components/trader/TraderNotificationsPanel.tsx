"use client";

import { useEffect, useState } from "react";
import { PackagePlus, Clock, TrendingDown, TrendingUp, Building2, Handshake } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/common/Badge";
import { traderDashboardService } from "@/services/traderDashboard.service";
import type { TraderNotificationCategory, TraderNotification } from "@/lib/types/traderWorkspace";

const CATEGORY_ICON: Record<TraderNotificationCategory, typeof PackagePlus> = {
  new_offer: PackagePlus,
  tender_closing: Clock,
  price_drop: TrendingDown,
  price_increase: TrendingUp,
  supplier_update: Building2,
  deal_update: Handshake,
};

export function TraderNotificationsPanel() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<TraderNotification[]>([]);

  useEffect(() => {
    traderDashboardService.getNotifications().then((result) => {
      setNotifications(result);
      setLoading(false);
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardWidget
      title="Notifications"
      action={!loading && unreadCount > 0 ? <Badge tone="gold">{unreadCount} new</Badge> : undefined}
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState title="All caught up" description="No new notifications." />
      ) : (
        <ul className="divide-y divide-line -my-1">
          {notifications.map((n) => {
            const Icon = CATEGORY_ICON[n.category];
            return (
              <li key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-charcoal/[0.04] text-ink-faint" : "bg-gold/10 text-gold-dim"}`}>
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-charcoal">{n.title}</p>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />}
                  </div>
                  <p className="text-xs text-ink-faint mt-0.5">{n.description}</p>
                  <p className="text-[11px] text-ink-faint mt-1">{n.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardWidget>
  );
}
