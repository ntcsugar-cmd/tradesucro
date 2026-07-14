"use client";

import { useEffect, useState } from "react";
import { Package, FileEdit, AlertTriangle, Gavel, Scale, Truck } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { millDashboardService } from "@/services/millDashboard.service";
import { formatQuantityMt } from "@/lib/utils/format";
import type { MillDashboardSummary } from "@/lib/types/millOperations";

/** MillDashboardStatsGrid — the "Mill Dashboard" summary requested in the v0.7 brief, composed entirely from existing/new services (no stat computed here). */
export function MillDashboardStatsGrid() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MillDashboardSummary | null>(null);

  useEffect(() => {
    millDashboardService.getSummary().then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
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
      <StatisticsCard label="Today's Active Offers" value={summary.todaysActiveOffers} icon={<Package size={16} />} />
      <StatisticsCard label="Draft Offers" value={summary.draftOffers} icon={<FileEdit size={16} />} />
      <StatisticsCard label="Offers Expiring Today" value={summary.offersExpiringToday} icon={<AlertTriangle size={16} />} />
      <StatisticsCard label="Active Tenders" value={summary.todaysActiveTenders} icon={<Gavel size={16} />} tone="dark" />
      <StatisticsCard label="Available Stock" value={formatQuantityMt(summary.totalAvailableStock)} icon={<Scale size={16} />} tone="dark" />
      <StatisticsCard label="Pending Dispatches" value={summary.pendingDispatches} icon={<Truck size={16} />} tone="dark" />
    </Grid>
  );
}
