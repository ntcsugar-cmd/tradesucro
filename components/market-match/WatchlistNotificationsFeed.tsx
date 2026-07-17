"use client";

import { BellRing } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WatchlistNotification } from "@/lib/types/smartMatch";

interface WatchlistNotificationsFeedProps {
  notifications: WatchlistNotification[];
  onRead: (id: string) => void;
}

export function WatchlistNotificationsFeed({ notifications, onRead }: WatchlistNotificationsFeedProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Watchlist Notifications</CardTitle>
      </CardHeader>
      <CardBody>
        {notifications.length === 0 ? (
          <EmptyState icon={<BellRing size={20} />} title="No activity yet" description="Notifications appear here when something you follow changes." />
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => onRead(n.id)}
                className={`flex items-start gap-3 rounded-sm border p-3 cursor-pointer transition-colors ${n.read ? "border-line dark:border-white/10" : "border-gold/30 bg-gold/[0.04]"}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-charcoal/[0.04] text-ink-faint dark:text-white/40" : "bg-gold/10 text-gold-dim"}`}>
                  <BellRing size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal dark:text-white">{n.title}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{n.description}</p>
                  <p className="text-[11px] text-ink-faint dark:text-white/40 mt-1">{new Date(n.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
