"use client";

import { useEffect, useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { marketPhase3Service } from "@/services/marketPhase3.service";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { StateSpotSummary } from "@/lib/types/marketIntelligence";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };
const TREND_COLOR = { up: "text-rise", down: "text-fall", flat: "text-ink-faint dark:text-white/40" };

export function IndiaSpotMarketGrid() {
  const [states, setStates] = useState<StateSpotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    marketPhase3Service.getIndiaSpotMarket().then((result) => {
      setStates(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (states.length === 0) {
    return <EmptyState title="No spot market activity yet" description="India Spot Market prices are derived from live offers on TradeSucro — post or browse offers to populate this view." />;
  }

  return (
    <div className="border border-line dark:border-white/10 rounded-sm divide-y divide-line dark:divide-white/10">
      {states.map((s) => {
        const isOpen = expanded === s.state;
        return (
          <div key={s.state}>
            <button
              onClick={() => setExpanded(isOpen ? null : s.state)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-charcoal/[0.02] dark:hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ChevronDown size={15} className={`shrink-0 text-ink-faint dark:text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                <div>
                  <p className="text-[14px] font-semibold text-charcoal dark:text-white">{getMasterStateLabel(s.state)}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40">{s.cities.length} {s.cities.length === 1 ? "city" : "cities"} reporting</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="font-mono text-[14px] text-charcoal dark:text-white">{formatPricePerUnit(s.averagePrice)}</p>
                  <p className={`text-xs font-mono ${s.priceChange > 0 ? "text-rise" : s.priceChange < 0 ? "text-fall" : "text-ink-faint dark:text-white/40"}`}>
                    {s.priceChange > 0 ? "+" : ""}
                    {s.priceChange}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-ink-faint dark:text-white/40">Volume</p>
                  <p className="font-mono text-[13px] text-charcoal dark:text-white">{formatQuantityMt(s.totalVolumeMt)}</p>
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-line dark:border-white/10 bg-charcoal/[0.015] dark:bg-white/[0.02] overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono">
                      <th className="px-5 py-2.5 font-medium">City</th>
                      <th className="px-5 py-2.5 font-medium text-right">Spot Price</th>
                      <th className="px-5 py-2.5 font-medium text-right">Change</th>
                      <th className="px-5 py-2.5 font-medium text-right">Volume</th>
                      <th className="px-5 py-2.5 font-medium text-right">Active Buyers</th>
                      <th className="px-5 py-2.5 font-medium text-right">Active Sellers</th>
                      <th className="px-5 py-2.5 font-medium text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line dark:divide-white/10">
                    {s.cities.map((c) => {
                      const TrendIcon = TREND_ICON[c.trend];
                      return (
                        <tr key={c.city}>
                          <td className="px-5 py-3 text-charcoal dark:text-white font-medium">{c.city}</td>
                          <td className="px-5 py-3 text-right font-mono text-charcoal dark:text-white">{formatPricePerUnit(c.spotPrice)}</td>
                          <td className={`px-5 py-3 text-right font-mono ${c.priceChange > 0 ? "text-rise" : c.priceChange < 0 ? "text-fall" : "text-ink-faint dark:text-white/40"}`}>
                            {c.priceChange > 0 ? "+" : ""}
                            {c.priceChange}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-ink-soft dark:text-white/50">{formatQuantityMt(c.volumeMt)}</td>
                          <td className="px-5 py-3 text-right font-mono text-ink-soft dark:text-white/50">{c.activeBuyers}</td>
                          <td className="px-5 py-3 text-right font-mono text-ink-soft dark:text-white/50">{c.activeSellers}</td>
                          <td className="px-5 py-3 text-right">
                            <TrendIcon size={14} className={`inline ${TREND_COLOR[c.trend]}`} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
