"use client";

import { Factory, Users, Tag, MapPin, Globe, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { IconButton } from "@/components/ui/IconButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { MillNameScroll } from "@/components/common";
import type { WatchlistItem, WatchTargetType } from "@/lib/types/smartMatch";

const TYPE_META: Record<WatchTargetType, { label: string; icon: LucideIcon }> = {
  mill: { label: "Mill", icon: Factory },
  trader: { label: "Trader", icon: Users },
  grade: { label: "Grade", icon: Tag },
  state: { label: "State", icon: MapPin },
  region: { label: "Region", icon: Globe },
};

interface WatchlistPanelProps {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
}

export function WatchlistPanel({ items, onRemove }: WatchlistPanelProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Your Watchlist</CardTitle>
        <span className="text-xs text-ink-faint">{items.length} followed</span>
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          <EmptyState title="Nothing followed yet" description="Add a mill, trader, grade, state, or region above to get notified when it moves." />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((item) => {
              const meta = TYPE_META[item.targetType];
              const Icon = meta.icon;
              return (
                <li key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <MillNameScroll name={item.targetLabel} className="text-[13px] font-medium text-charcoal" />
                      <p className="text-[11px] text-ink-faint mt-0.5">{meta.label} · Following since {new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                    </div>
                  </div>
                  <IconButton variant="ghost" size="sm" aria-label={`Unfollow ${item.targetLabel}`} onClick={() => onRemove(item.id)}>
                    <X size={14} />
                  </IconButton>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
