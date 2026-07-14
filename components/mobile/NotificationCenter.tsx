"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Gavel, Handshake, Truck, Wallet, Car, BellOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { notificationService } from "@/services/notification.service";
import { watchlistService } from "@/services/watchlist.service";

export type NotificationCenterCategory = "price_change" | "tender" | "deal" | "dispatch" | "payment" | "transport";

interface DisplayNotification {
  id: string;
  category: NotificationCenterCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const CATEGORY_META: Record<NotificationCenterCategory, { label: string; icon: LucideIcon; tone: string }> = {
  price_change: { label: "Price Change", icon: TrendingUp, tone: "text-gold-dim bg-gold/10" },
  tender: { label: "Tender", icon: Gavel, tone: "text-charcoal bg-charcoal/[0.06]" },
  deal: { label: "Deal", icon: Handshake, tone: "text-rise bg-rise/10" },
  dispatch: { label: "Dispatch", icon: Truck, tone: "text-info-600 bg-info-100" },
  payment: { label: "Payment", icon: Wallet, tone: "text-fall bg-fall/10" },
  transport: { label: "Transport", icon: Car, tone: "text-ink-soft bg-charcoal/[0.04]" },
};

/** Maps existing (unmodified) notification sources onto the 6 target categories. Payment/Transport are fully wired in the UI below but have no producing source yet in the app — real events will slot in here once those modules exist, without any change to this component. */
async function collectNotifications(): Promise<DisplayNotification[]> {
  const [millNotifications, watchlistNotifications] = await Promise.all([notificationService.getNotifications(), watchlistService.getNotifications()]);

  const fromMill: DisplayNotification[] = millNotifications.map((n) => ({
    id: `mill-${n.id}`,
    category: n.category === "tender_closing" ? "tender" : n.category === "dispatch_delay" ? "dispatch" : n.category === "new_interest" ? "deal" : "price_change",
    title: n.title,
    description: n.description,
    timestamp: n.timestamp,
    read: n.read,
  }));

  const fromWatchlist: DisplayNotification[] = watchlistNotifications.map((n) => ({
    id: `watch-${n.id}`,
    category: n.title.toLowerCase().includes("tender") ? "tender" : "price_change",
    title: n.title,
    description: n.description,
    timestamp: n.timestamp,
    read: n.read,
  }));

  return [...fromMill, ...fromWatchlist].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
  const [filter, setFilter] = useState<NotificationCenterCategory | "all">("all");

  useEffect(() => {
    collectNotifications().then((result) => {
      setNotifications(result);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.category === filter);
  const categoriesPresent = new Set(notifications.map((n) => n.category));

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${filter === "all" ? "bg-charcoal text-white" : "bg-charcoal/[0.05] text-ink-soft"}`}
        >
          All
        </button>
        {(Object.keys(CATEGORY_META) as NotificationCenterCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          const has = categoriesPresent.has(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              disabled={!has}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap ${
                filter === cat ? "bg-charcoal text-white" : has ? "bg-charcoal/[0.05] text-ink-soft" : "bg-charcoal/[0.02] text-ink-faint/40"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BellOff size={20} />} title="No notifications" description="You're all caught up." />
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((n) => {
            const meta = CATEGORY_META[n.category];
            const Icon = meta.icon;
            return (
              <li key={n.id} onClick={onClose} className={`flex items-start gap-3 rounded-sm border p-3.5 ${n.read ? "border-line" : "border-gold/30 bg-gold/[0.04]"}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal">{n.title}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{n.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
