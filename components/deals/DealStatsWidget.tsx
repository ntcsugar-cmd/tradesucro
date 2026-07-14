"use client";

import { useEffect, useState } from "react";
import { Handshake, Truck, Hourglass, PackageCheck, CheckCircle2, Ban, Scale, AlertCircle } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { dealService } from "@/services/deal.service";
import { formatINR } from "@/lib/utils/format";
import type { DealDashboardStats } from "@/lib/types/deal";

export function DealStatsWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DealDashboardStats | null>(null);

  useEffect(() => {
    dealService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={4} gap="md">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={4} gap="md">
      <StatisticsCard label="Total Active Deals" value={stats.totalActiveDeals} icon={<Handshake size={16} />} tone="dark" />
      <StatisticsCard label="Today's Dispatch" value={stats.todaysDispatch} icon={<Truck size={16} />} />
      <StatisticsCard label="Pending Payments" value={stats.pendingPayments} icon={<Hourglass size={16} />} />
      <StatisticsCard label="Pending Deliveries" value={stats.pendingDeliveries} icon={<PackageCheck size={16} />} />
      <StatisticsCard label="Completed Deals" value={stats.completedDeals} icon={<CheckCircle2 size={16} />} />
      <StatisticsCard label="Cancelled Deals" value={stats.cancelledDeals} icon={<Ban size={16} />} />
      <StatisticsCard label="Total Deal Value" value={formatINR(stats.totalDealValue)} icon={<Scale size={16} />} tone="dark" />
      <StatisticsCard label="Outstanding Amount" value={formatINR(stats.outstandingAmount)} icon={<AlertCircle size={16} />} tone="dark" />
    </Grid>
  );
}
