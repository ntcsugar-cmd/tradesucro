"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Gavel, PackageX, Truck, Handshake } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { notificationService } from "@/services/notification.service";
import type { NotificationCategory, PortalNotification } from "@/lib/types/millOperations";

const CATEGORY_ICON: Record<NotificationCategory, typeof AlertTriangle> = {
  offer_expiring: AlertTriangle,
  tender_closing: Gavel,
  low_inventory: PackageX,
  dispatch_delay: Truck,
  new_interest: Handshake,
};

export function NotificationPanel() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  useEffect(() => {
    notificationService.getNotifications().then((result) => {
      setNotifications(result);
      setLoading(false);
    });
  }, []);

  async function handleDismiss(id: string) {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <DashboardWidget title="Notifications" description="Offers, tenders, inventory, and dispatch alerts">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState title="All caught up" description="No new notifications." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const Icon = CATEGORY_ICON[n.category];
            return (
              <li
                key={n.id}
                className={`flex items-start gap-3 rounded-sm border p-3 cursor-pointer transition-colors ${n.read ? "border-line dark:border-white/10" : "border-gold/30 bg-gold/[0.04]"}`}
                onClick={() => handleDismiss(n.id)}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-charcoal/[0.04] text-ink-faint dark:text-white/40" : "bg-gold/10 text-gold-dim"}`}>
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal dark:text-white">{n.title}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{n.description}</p>
                  <p className="text-[11px] text-ink-faint dark:text-white/40 mt-1">{n.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardWidget>
  );
}
