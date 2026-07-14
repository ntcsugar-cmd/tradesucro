"use client";

import { useEffect, useState } from "react";
import { Scale, ArrowUp, ArrowDown, MapPin, Factory, Package, Gavel, TrendingUp, TrendingDown } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import { formatINR } from "@/lib/utils/format";
import type { MarketDashboardStats } from "@/lib/types/marketIntelligence";

export function MarketStatsGrid() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MarketDashboardStats | null>(null);

  useEffect(() => {
    marketIntelligenceService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={3} colsLg={5} gap="md">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={3} colsLg={5} gap="md">
      <StatisticsCard label="Average India Price" value={formatINR(stats.averageIndiaPrice)} icon={<Scale size={16} />} tone="dark" />
      <StatisticsCard label="Today's Highest" value={formatINR(stats.todaysHighest)} icon={<ArrowUp size={16} />} />
      <StatisticsCard label="Today's Lowest" value={formatINR(stats.todaysLowest)} icon={<ArrowDown size={16} />} />
      <StatisticsCard label="Most Active State" value={stats.mostActiveState} icon={<MapPin size={16} />} />
      <StatisticsCard label="Most Active Mill" value={stats.mostActiveMill} icon={<Factory size={16} />} />
      <StatisticsCard label="Offers Today" value={stats.offersToday} icon={<Package size={16} />} />
      <StatisticsCard label="Tenders Today" value={stats.tendersToday} icon={<Gavel size={16} />} />
      <StatisticsCard label="Price Up" value={stats.priceUpCount} icon={<TrendingUp size={16} />} tone="dark" />
      <StatisticsCard label="Price Down" value={stats.priceDownCount} icon={<TrendingDown size={16} />} tone="dark" />
    </Grid>
  );
}
