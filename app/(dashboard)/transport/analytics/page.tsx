"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { TransportSubNav } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import { formatCompactINR } from "@/lib/utils/format";
import type { TransportAnalyticsSummary } from "@/lib/types/transport";

function MonthlyBarChart({ data, formatValue }: { data: { month: string; value: number }[]; formatValue: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-40 px-1">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-mono text-ink-faint dark:text-white/40">{formatValue(d.value)}</span>
          <div className="w-full rounded-t-sm bg-gold/70 dark:bg-gold/60" style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }} />
          <span className="text-[11px] text-ink-faint dark:text-white/40">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function TransportAnalyticsPage() {
  const [summary, setSummary] = useState<TransportAnalyticsSummary | null>(null);

  useEffect(() => {
    transportService.getAnalyticsSummary().then(setSummary);
  }, []);

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Transport Analytics" description="Delivery performance, fleet utilization, and route trends." />

      {!summary ? (
        <Grid cols={1} colsMd={2} colsLg={4} gap="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </Grid>
      ) : (
        <>
          <Grid cols={1} colsMd={2} colsLg={4} gap="md" className="mb-6">
            <GridItem>
              <StatisticsCard label="On-Time Delivery" value={summary.onTimeDeliveryRate} suffix="%" />
            </GridItem>
            <GridItem>
              <StatisticsCard label="Fleet Utilization" value={summary.vehicleUtilization} suffix="%" />
            </GridItem>
            <GridItem>
              <StatisticsCard
                label="Trips This Period"
                value={summary.monthlyTripCounts.reduce((sum, m) => sum + m.trips, 0)}
              />
            </GridItem>
            <GridItem>
              <StatisticsCard
                label="Earnings This Period"
                value={summary.monthlyEarnings.reduce((sum, m) => sum + m.earnings, 0)}
                compact
              />
            </GridItem>
          </Grid>

          <Grid cols={1} colsLg={2} gap="md" className="mb-6">
            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Trips per Month</CardTitle>
                </CardHeader>
                <CardBody>
                  <MonthlyBarChart data={summary.monthlyTripCounts.map((m) => ({ month: m.month, value: m.trips }))} formatValue={(v) => String(v)} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Earnings per Month</CardTitle>
                </CardHeader>
                <CardBody>
                  <MonthlyBarChart data={summary.monthlyEarnings.map((m) => ({ month: m.month, value: m.earnings }))} formatValue={(v) => formatCompactINR(v)} />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Top Routes</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="divide-y divide-line dark:divide-white/10">
                {summary.topRoutes.map((r) => (
                  <li key={r.route} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-[13.5px] text-charcoal dark:text-white">{r.route}</span>
                    <span className="font-mono text-[13px] text-ink-faint dark:text-white/40">{r.trips} trips</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
