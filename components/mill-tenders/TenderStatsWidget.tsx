"use client";

import { useEffect, useState } from "react";
import { Gavel, Clock, Hourglass, Trophy, Ban } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { millTenderService } from "@/services/millTender.service";
import type { TenderDashboardStats } from "@/lib/types/millTender";

export function TenderStatsWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TenderDashboardStats | null>(null);

  useEffect(() => {
    millTenderService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={5} gap="md">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={5} gap="md">
      <StatisticsCard label="Active Tenders" value={stats.activeTenders} icon={<Gavel size={16} />} />
      <StatisticsCard label="Closing Today" value={stats.closingToday} icon={<Clock size={16} />} />
      <StatisticsCard label="Award Pending" value={stats.awardPending} icon={<Hourglass size={16} />} tone="dark" />
      <StatisticsCard label="Awarded" value={stats.awarded} icon={<Trophy size={16} />} tone="dark" />
      <StatisticsCard label="Cancelled" value={stats.cancelled} icon={<Ban size={16} />} />
    </Grid>
  );
}
