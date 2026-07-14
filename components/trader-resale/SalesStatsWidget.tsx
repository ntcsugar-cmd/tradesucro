"use client";

import { useEffect, useState } from "react";
import { TrendingUp, FolderOpen, Truck, AlertCircle, Scale, PiggyBank, Trophy } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { traderResaleService } from "@/services/traderResale.service";
import { formatINR } from "@/lib/utils/format";
import type { SalesDashboardStats } from "@/lib/types/traderResale";

export function SalesStatsWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SalesDashboardStats | null>(null);

  useEffect(() => {
    traderResaleService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={4} gap="md">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={4} gap="md">
      <StatisticsCard label="Today's Sales" value={formatINR(stats.todaysSales)} icon={<TrendingUp size={16} />} tone="dark" />
      <StatisticsCard label="Open Orders" value={stats.openOrders} icon={<FolderOpen size={16} />} />
      <StatisticsCard label="Pending Dispatch" value={stats.pendingDispatch} icon={<Truck size={16} />} />
      <StatisticsCard label="Outstanding Amount" value={formatINR(stats.outstandingAmount)} icon={<AlertCircle size={16} />} />
      <StatisticsCard label="Gross Margin" value={formatINR(stats.grossMargin)} icon={<Scale size={16} />} tone="dark" />
      <StatisticsCard label="Net Margin" value={formatINR(stats.netMargin)} icon={<PiggyBank size={16} />} tone="dark" />
      <StatisticsCard label="Best Customer" value={stats.bestCustomer} icon={<Trophy size={16} />} />
    </Grid>
  );
}
