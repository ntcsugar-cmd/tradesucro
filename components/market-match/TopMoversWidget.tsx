"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceDelta } from "@/components/common/PriceDelta";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";
import type { Direction } from "@/lib/types";

function percentChange(entry: MillPriceEntry): { change: number; direction: Direction } {
  const diff = entry.todaysPrice - entry.previousPrice;
  const pct = entry.previousPrice > 0 ? (diff / entry.previousPrice) * 100 : 0;
  return { change: pct, direction: diff > 0 ? "up" : diff < 0 ? "down" : "flat" };
}

export function TopMoversWidget() {
  const [loading, setLoading] = useState(true);
  const [gainers, setGainers] = useState<MillPriceEntry[]>([]);
  const [losers, setLosers] = useState<MillPriceEntry[]>([]);

  useEffect(() => {
    marketIntelligenceService.getLivePrices().then((prices) => {
      const sorted = [...prices].sort((a, b) => (b.todaysPrice - b.previousPrice) - (a.todaysPrice - a.previousPrice));
      setGainers(sorted.filter((p) => p.todaysPrice > p.previousPrice).slice(0, 5));
      setLosers([...sorted].reverse().filter((p) => p.todaysPrice < p.previousPrice).slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Top Gainers</CardTitle>
          <TrendingUp size={14} className="text-rise" />
        </CardHeader>
        <CardBody className="divide-y divide-line -my-1">
          {gainers.map((g) => {
            const { change, direction } = percentChange(g);
            return (
              <div key={g.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] text-charcoal truncate">{g.millName}</p>
                  <p className="text-[11px] text-ink-faint">{getProductLabel(g.product)} · {getMasterStateLabel(g.state)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[13px] text-charcoal">{formatINR(g.todaysPrice)}</p>
                  <PriceDelta change={change} direction={direction} className="justify-end" />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Top Losers</CardTitle>
          <TrendingDown size={14} className="text-fall" />
        </CardHeader>
        <CardBody className="divide-y divide-line -my-1">
          {losers.map((l) => {
            const { change, direction } = percentChange(l);
            return (
              <div key={l.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] text-charcoal truncate">{l.millName}</p>
                  <p className="text-[11px] text-ink-faint">{getProductLabel(l.product)} · {getMasterStateLabel(l.state)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[13px] text-charcoal">{formatINR(l.todaysPrice)}</p>
                  <PriceDelta change={change} direction={direction} className="justify-end" />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}
