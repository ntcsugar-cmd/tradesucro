"use client";

import { useEffect, useState } from "react";
import { Send, Handshake, Clock, Hourglass, Lock, Trophy } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { millTenderService } from "@/services/millTender.service";
import type { TenderNotificationCategory, TenderNotification } from "@/lib/types/millTender";

const CATEGORY_ICON: Record<TenderNotificationCategory, typeof Send> = {
  tender_published: Send,
  bid_received: Handshake,
  tender_closing_soon: Clock,
  award_pending: Hourglass,
  tender_closed: Lock,
  winner_selected: Trophy,
};

export function TenderNotificationsPanel() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<TenderNotification[]>([]);

  useEffect(() => {
    millTenderService.getNotifications().then((result) => {
      setNotifications(result);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardWidget title="Tender Notifications">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState title="All caught up" description="No new tender notifications." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const Icon = CATEGORY_ICON[n.category];
            return (
              <li key={n.id} className={`flex items-start gap-3 rounded-sm border p-3 ${n.read ? "border-line" : "border-gold/30 bg-gold/[0.04]"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-charcoal/[0.04] text-ink-faint" : "bg-gold/10 text-gold-dim"}`}>
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal">{n.title}</p>
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
