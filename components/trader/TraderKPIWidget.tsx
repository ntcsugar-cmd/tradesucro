"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Scale, TrendingUp, FolderOpen, Hourglass, Truck } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { traderDashboardService } from "@/services/traderDashboard.service";
import { formatINR } from "@/lib/utils/format";
import type { TraderKPI } from "@/lib/types/traderWorkspace";

export function TraderKPIWidget() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<TraderKPI | null>(null);

  useEffect(() => {
    traderDashboardService.getTraderKPI().then((result) => {
      setKpi(result);
      setLoading(false);
    });
  }, []);

  if (loading || !kpi) {
    return (
      <Grid cols={2} colsMd={3} colsLg={6} gap="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={3} colsLg={6} gap="md">
      <StatisticsCard label="Today's Purchases" value={kpi.todaysPurchases} icon={<ShoppingBag size={16} />} />
      <StatisticsCard label="Avg. Purchase Price" value={formatINR(kpi.averagePurchasePrice)} icon={<Scale size={16} />} />
      <StatisticsCard label="Margin" value={formatINR(kpi.margin)} icon={<TrendingUp size={16} />} tone="dark" />
      <StatisticsCard label="Open Deals" value={kpi.openDeals} icon={<FolderOpen size={16} />} />
      <StatisticsCard label="Pending Payments" value={kpi.pendingPayments} icon={<Hourglass size={16} />} />
      <StatisticsCard label="Pending Deliveries" value={kpi.pendingDeliveries} icon={<Truck size={16} />} />
    </Grid>
  );
}
