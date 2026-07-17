"use client";

import { useEffect, useState } from "react";
import { Gavel, TrendingUp, TrendingDown, Radio } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/common/Badge";
import { PriceDelta } from "@/components/common/PriceDelta";
import { traderDashboardService } from "@/services/traderDashboard.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";
import type { Direction } from "@/lib/types";

const AUTO_REFRESH_MS = 30000;

/** Percent change is a display-only derivation of the same todaysPrice/previousPrice fields already returned by the (unmodified) service — no new data, just a friendlier presentation via the existing PriceDelta component. */
function percentChange(entry: MillPriceEntry): { change: number; direction: Direction } {
  const diff = entry.todaysPrice - entry.previousPrice;
  const pct = entry.previousPrice > 0 ? (diff / entry.previousPrice) * 100 : 0;
  return { change: pct, direction: diff > 0 ? "up" : diff < 0 ? "down" : "flat" };
}

export function LiveMarketPanel() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<MillPriceEntry[]>([]);
  const [changes, setChanges] = useState<MillPriceEntry[]>([]);
  const [tenders, setTenders] = useState<MillPriceEntry[]>([]);
  const [trending, setTrending] = useState<{ grade: string; priceUp: number; priceDown: number }[]>([]);
  const [movers, setMovers] = useState<{ biggestIncrease: MillPriceEntry | null; biggestDrop: MillPriceEntry | null }>({ biggestIncrease: null, biggestDrop: null });
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  async function load() {
    const [o, c, t, g, m] = await Promise.all([
      traderDashboardService.getLatestOffers(5),
      traderDashboardService.getLatestPriceChanges(5),
      traderDashboardService.getNewTenders(5),
      traderDashboardService.getTrendingGrades(),
      traderDashboardService.getPriceMovers(),
    ]);
    setOffers(o);
    setChanges(c);
    setTenders(t);
    setTrending(g);
    setMovers(m);
    setLoading(false);
    setLastRefreshed(new Date());
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40">Live Market Panel</p>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-faint dark:text-white/40">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rise opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rise" />
          </span>
          <Radio size={11} className="ml-0.5" /> Live &middot; refreshed {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <DashboardWidget title="Latest Mill Offers">
          <ul className="divide-y divide-line -my-1">
            {offers.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] text-charcoal dark:text-white truncate">{o.millName}</p>
                  <p className="text-[11px] text-ink-faint dark:text-white/40">{getProductLabel(o.product)} &middot; {o.grade}</p>
                </div>
                <span className="font-mono text-[13px] text-charcoal dark:text-white shrink-0">{formatINR(o.todaysPrice)}</span>
              </li>
            ))}
          </ul>
        </DashboardWidget>

        <DashboardWidget title="Latest Price Changes">
          <ul className="divide-y divide-line -my-1">
            {changes.map((c) => {
              const { change, direction } = percentChange(c);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal dark:text-white truncate">{c.millName}</p>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">{getMasterStateLabel(c.state)}</p>
                  </div>
                  <PriceDelta change={change} direction={direction} className="shrink-0" />
                </li>
              );
            })}
          </ul>
        </DashboardWidget>

        <DashboardWidget title="New Tender Notifications">
          {tenders.length === 0 ? (
            <p className="text-[13px] text-ink-faint dark:text-white/40 italic py-2">No open tenders right now.</p>
          ) : (
            <ul className="divide-y divide-line -my-1">
              {tenders.map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                    <Gavel size={12} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal dark:text-white truncate">{t.millName}</p>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">{getMasterStateLabel(t.state)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardWidget>

        <DashboardWidget title="Trending Sugar Grades">
          <ul className="divide-y divide-line -my-1">
            {trending.map((t) => (
              <li key={t.grade} className="flex items-center justify-between py-2.5">
                <span className="font-mono text-[13px] text-charcoal dark:text-white">{t.grade}</span>
                <span className="flex items-center gap-1.5">
                  <Badge tone="verified">
                    <TrendingUp size={10} /> {t.priceUp}
                  </Badge>
                  <Badge tone="urgent">
                    <TrendingDown size={10} /> {t.priceDown}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        </DashboardWidget>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {movers.biggestIncrease && (
          <div className="flex items-center gap-3 rounded-sm border border-rise/25 bg-rise/[0.05] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rise/10 text-rise">
              <TrendingUp size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">Highest Price Increase</p>
              <p className="text-[13.5px] font-medium text-charcoal dark:text-white truncate">{movers.biggestIncrease.millName}</p>
            </div>
            <p className="ml-auto font-mono text-sm text-rise shrink-0">+{formatINR(movers.biggestIncrease.todaysPrice - movers.biggestIncrease.previousPrice)}</p>
          </div>
        )}
        {movers.biggestDrop && (
          <div className="flex items-center gap-3 rounded-sm border border-fall/25 bg-fall/[0.05] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-fall/10 text-fall">
              <TrendingDown size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">Highest Price Drop</p>
              <p className="text-[13.5px] font-medium text-charcoal dark:text-white truncate">{movers.biggestDrop.millName}</p>
            </div>
            <p className="ml-auto font-mono text-sm text-fall shrink-0">{formatINR(movers.biggestDrop.todaysPrice - movers.biggestDrop.previousPrice)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
