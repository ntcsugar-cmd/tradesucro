"use client";

import { useEffect, useState } from "react";
import { Scale, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { commercialDecisionService } from "@/services/commercialDecision.service";
import { formatINR } from "@/lib/utils/format";
import type { ParityDashboardStats } from "@/lib/types/commercial";

export function ParityDashboardWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ParityDashboardStats | null>(null);

  useEffect(() => {
    commercialDecisionService.getParityDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
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
      <StatisticsCard label="Today's Average Parity" value={formatINR(stats.todaysAverageParity)} icon={<Scale size={16} />} tone="dark" />
      <StatisticsCard label="Highest Margin" value={formatINR(stats.highestMargin)} icon={<TrendingUp size={16} />} />
      <StatisticsCard label="Lowest Margin" value={formatINR(stats.lowestMargin)} icon={<TrendingDown size={16} />} />
      <StatisticsCard label="Top Buying Opportunity" value={stats.topBuyingOpportunity} icon={<ArrowDownRight size={16} />} />
      <StatisticsCard label="Top Selling Opportunity" value={stats.topSellingOpportunity} icon={<ArrowUpRight size={16} />} />
      <StatisticsCard label="Nearby Suppliers" value={stats.nearbySuppliers} icon={<MapPin size={16} />} tone="dark" />
    </Grid>
  );
}
