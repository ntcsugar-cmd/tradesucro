"use client";

import { useEffect, useState } from "react";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Card } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatINR } from "@/lib/utils/format";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { StateHeatMapEntry } from "@/lib/types/marketIntelligence";

function intensityClass(price: number, min: number, max: number): string {
  const ratio = max > min ? (price - min) / (max - min) : 0.5;
  if (ratio > 0.75) return "border-gold bg-gold/[0.08]";
  if (ratio > 0.5) return "border-gold/40 bg-gold/[0.03]";
  if (ratio > 0.25) return "border-line bg-charcoal/[0.015]";
  return "border-line dark:border-white/10 bg-white dark:bg-charcoal-soft";
}

export function PriceHeatMapGrid() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<StateHeatMapEntry[]>([]);

  useEffect(() => {
    marketIntelligenceService.getHeatMap().then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Grid cols={1} colsMd={2} colsLg={3} gap="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </Grid>
    );
  }

  const prices = entries.map((e) => e.averagePrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <Grid cols={1} colsMd={2} colsLg={3} gap="md">
      {entries.map((e) => (
        <GridItem key={e.state}>
          {/* Card supplies the outer shell (padding="none" avoids any collision);
              the intensity border/background lives on a new inner div, since
              overriding Card's own border-* classes via className is unreliable
              (Tailwind's generated stylesheet order, not JSX order, decides which
              same-property utility wins). */}
          <Card padding="none" className="h-full">
            <div className={`h-full rounded-sm border-2 p-5 ${intensityClass(e.averagePrice, min, max)}`}>
              <p className="font-display text-base text-charcoal dark:text-white">{e.state}</p>
              <p className="mt-3 font-mono text-2xl text-charcoal dark:text-white">{formatINR(e.averagePrice)}</p>
              <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">Average price</p>

              <div className="mt-4 pt-4 border-t border-line dark:border-white/10 grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-ink-faint dark:text-white/40">Highest</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{formatINR(e.highest)}</span>
                <span className="text-ink-faint dark:text-white/40">Lowest</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{formatINR(e.lowest)}</span>
                <span className="text-ink-faint dark:text-white/40">Mills</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{e.millCount}</span>
                <span className="text-ink-faint dark:text-white/40">Offers</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{e.offers}</span>
                <span className="text-ink-faint dark:text-white/40">Tenders</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{e.tenders}</span>
              </div>
            </div>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
