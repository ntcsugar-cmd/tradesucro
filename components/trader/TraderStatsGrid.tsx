"use client";

import { useEffect, useState } from "react";
import { Scale, ArrowDown, ArrowUp, Gavel, Clock, Handshake, Truck, Hourglass, Boxes, TrendingUp } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { traderDashboardService } from "@/services/traderDashboard.service";
import { formatINR } from "@/lib/utils/format";
import type { TraderDashboardStats } from "@/lib/types/traderWorkspace";

/** TraderStatsGrid — same data source and fields as before (traderDashboardService.getDashboardStats, unchanged), regrouped into two visual zones for readability: market context, then the trader's own book. */
export function TraderStatsGrid() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TraderDashboardStats | null>(null);

  useEffect(() => {
    traderDashboardService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Grid cols={2} colsMd={5} gap="md">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </Grid>
        <Grid cols={2} colsMd={5} gap="md">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`b-${i}`} className="h-24 w-full" />
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Today&rsquo;s Market</p>
        <Grid cols={2} colsMd={5} gap="md">
          <StatisticsCard label="Market Average" value={formatINR(stats.todaysMarketAverage)} icon={<Scale size={16} />} tone="dark" />
          <StatisticsCard label="Lowest Mill Price" value={formatINR(stats.lowestMillPrice)} icon={<ArrowDown size={16} />} />
          <StatisticsCard label="Highest Mill Price" value={formatINR(stats.highestMillPrice)} icon={<ArrowUp size={16} />} />
          <StatisticsCard label="Active Tenders" value={stats.activeTenders} icon={<Gavel size={16} />} />
          <StatisticsCard label="Offers Closing Today" value={stats.offersClosingToday} icon={<Clock size={16} />} />
        </Grid>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Your Book</p>
        <Grid cols={2} colsMd={5} gap="md">
          <StatisticsCard label="My Active Deals" value={stats.myActiveDeals} icon={<Handshake size={16} />} tone="dark" />
          <StatisticsCard label="Pending Dispatch" value={stats.pendingDispatch} icon={<Truck size={16} />} />
          <StatisticsCard label="Pending Payments" value={stats.pendingPayments} icon={<Hourglass size={16} />} />
          <StatisticsCard label="Inventory Value" value={formatINR(stats.inventoryValue)} icon={<Boxes size={16} />} tone="dark" />
          <StatisticsCard label="Today's Profit Estimate" value={formatINR(stats.todaysProfitEstimate)} icon={<TrendingUp size={16} />} tone="dark" />
        </Grid>
      </div>
    </div>
  );
}
