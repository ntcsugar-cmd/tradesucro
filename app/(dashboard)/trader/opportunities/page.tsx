"use client";

import { useEffect, useState } from "react";
import { Sparkles, Layers, TrendingUp, Flame } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { TraderSubNav, BuyingOpportunitiesPanel } from "@/components/trader";
import { traderDashboardService } from "@/services/traderDashboard.service";
import { formatINR } from "@/lib/utils/format";
import type { BuyingOpportunity } from "@/lib/types/traderWorkspace";

export default function BuyingOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<BuyingOpportunity[]>([]);

  useEffect(() => {
    traderDashboardService.getBuyingOpportunities(8).then(setOpportunities);
  }, []);

  const avgMargin = opportunities.length > 0 ? Math.round(opportunities.reduce((sum, o) => sum + o.expectedMargin, 0) / opportunities.length) : 0;
  const bestMargin = opportunities[0]?.expectedMargin ?? 0;

  return (
    <>
      <TraderSubNav />
      <PageHeader
        title="Buying Opportunities"
        description="Mills currently offering, ranked by expected margin against today's market average."
      />

      <Grid cols={1} colsMd={3} gap="md" className="mb-6">
        <StatisticsCard label="Open Opportunities" value={opportunities.length} icon={<Layers size={16} />} />
        <StatisticsCard label="Average Expected Margin" value={formatINR(avgMargin)} icon={<TrendingUp size={16} />} />
        <StatisticsCard label="Best Margin Available" value={formatINR(bestMargin)} icon={<Flame size={16} />} tone="dark" />
      </Grid>

      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={13} className="text-gold-dim" />
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40">Ranked by expected margin</p>
      </div>
      <BuyingOpportunitiesPanel />
    </>
  );
}
