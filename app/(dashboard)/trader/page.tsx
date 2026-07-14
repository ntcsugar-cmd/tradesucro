"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import {
  TraderSubNav,
  TraderStatsGrid,
  LiveMarketPanel,
  BuyingOpportunitiesPanel,
  TraderQuickActions,
  TraderKPIWidget,
  TraderNotificationsPanel,
} from "@/components/trader";
import { authService } from "@/services/auth.service";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TraderTradingDeskPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    const session = authService.getSession();
    setName(session?.fullName?.split(" ")[0] ?? "");
  }, []);

  return (
    <>
      <TraderSubNav />
      <PageHeader
        title="Daily Trading Desk"
        description={`${greeting()}${name ? `, ${name}` : ""} — here's your market snapshot, open positions, and today's best opportunities.`}
      />

      <div className="mb-8">
        <TraderStatsGrid />
      </div>

      <Grid cols={1} colsLg={3} gap="lg">
        <GridItem span={2}>
          <div className="space-y-8">
            <LiveMarketPanel />

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint">Buying Opportunities</p>
                <span className="text-xs text-ink-faint">Ranked by expected margin</span>
              </div>
              <BuyingOpportunitiesPanel />
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Trader KPI</p>
              <TraderKPIWidget />
            </div>
          </div>
        </GridItem>

        <GridItem span={1}>
          <div className="space-y-6 lg:sticky lg:top-24">
            <TraderQuickActions />
            <TraderNotificationsPanel />
          </div>
        </GridItem>
      </Grid>
    </>
  );
}
