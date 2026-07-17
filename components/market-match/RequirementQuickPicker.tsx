"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { smartMatchService } from "@/services/smartMatch.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MarketplaceRequirement } from "@/lib/types/marketplace";
import type { MatchCriteria } from "@/lib/types/smartMatch";

interface RequirementQuickPickerProps {
  onPick: (criteria: MatchCriteria) => void;
  activeRequirementId?: string;
}

export function RequirementQuickPicker({ onPick, activeRequirementId }: RequirementQuickPickerProps) {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<MarketplaceRequirement[]>([]);

  useEffect(() => {
    smartMatchService.getOpenRequirements().then((result) => {
      setRequirements(result.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (requirements.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">No open buy requirements right now.</p>;
  }

  return (
    <div className="space-y-2">
      {requirements.map((r) => {
        const active = r.id === activeRequirementId;
        return (
          <Card
            key={r.id}
            padding="none"
            interactive
            role="button"
            tabIndex={0}
            onClick={() =>
              onPick({ grade: r.grade, state: r.destination.state, quantity: r.quantity, maxPrice: r.expectedPrice, targetSellPrice: r.expectedPrice })
            }
            className={active ? "ring-2 ring-gold" : ""}
          >
            <CardBody className="p-3.5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                <ClipboardList size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{r.company.name}</p>
                <p className="text-[11px] text-ink-faint dark:text-white/40">{getProductLabel(r.product)} · {r.grade} · {formatQuantityMt(r.quantity)}</p>
              </div>
              <span className="font-mono text-xs text-charcoal dark:text-white shrink-0">{formatINR(r.expectedPrice)}</span>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
