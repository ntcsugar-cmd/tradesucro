import { BellRing } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AlertNotification } from "@/lib/types/marketIntelligence";

interface AlertNotificationsListProps {
  notifications: AlertNotification[];
}

export function AlertNotificationsList({ notifications }: AlertNotificationsListProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Recent Alert Notifications</CardTitle>
      </CardHeader>
      <CardBody>
        {notifications.length === 0 ? (
          <EmptyState icon={<BellRing size={20} />} title="No notifications yet" description="You'll see alert notifications here once your rules start matching." />
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className={`flex items-start gap-3 rounded-sm border p-3 ${n.read ? "border-line dark:border-white/10" : "border-gold/30 bg-gold/[0.04]"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-charcoal/[0.04] text-ink-faint dark:text-white/40" : "bg-gold/10 text-gold-dim"}`}>
                  <BellRing size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal dark:text-white">{n.title}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{n.description}</p>
                  <p className="text-[11px] text-ink-faint dark:text-white/40 mt-1">{n.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
