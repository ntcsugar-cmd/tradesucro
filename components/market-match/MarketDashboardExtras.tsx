"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Handshake } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketplaceService } from "@/services/marketplace.service";
import { dealService } from "@/services/deal.service";

export function MarketDashboardExtras() {
  const [loading, setLoading] = useState(true);
  const [buyRequirements, setBuyRequirements] = useState(0);
  const [liveDeals, setLiveDeals] = useState(0);

  useEffect(() => {
    Promise.all([marketplaceService.getStats(), dealService.getDeals()]).then(([stats, deals]) => {
      setBuyRequirements(stats.activeBuyRequirements);
      setLiveDeals(deals.filter((d) => d.status !== "closed" && d.status !== "cancelled").length);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Grid cols={2} gap="md">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </Grid>
    );
  }

  return (
    <Grid cols={2} gap="md">
      <StatisticsCard label="Buy Requirements" value={buyRequirements} icon={<ClipboardList size={16} />} />
      <StatisticsCard label="Live Deals" value={liveDeals} icon={<Handshake size={16} />} tone="dark" />
    </Grid>
  );
}
