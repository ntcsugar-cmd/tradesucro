"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Tabs } from "@/components/navigation/Tabs";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendChart } from "@/components/market-intel";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import { formatINR } from "@/lib/utils/format";
import type { TrendPoint, GradeTrend, TrendWindow } from "@/lib/types/marketIntelligence";

const WINDOW_TABS = [
  { value: "7", label: "7 Day Trend" },
  { value: "30", label: "30 Day Trend" },
  { value: "90", label: "90 Day Trend" },
];

export default function MarketTrendsPage() {
  const [activeWindow, setActiveWindow] = useState<TrendWindow>(7);
  const [loading, setLoading] = useState(true);
  const [averageTrend, setAverageTrend] = useState<TrendPoint[]>([]);
  const [gradeTrends, setGradeTrends] = useState<GradeTrend[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([marketIntelligenceService.getTrend(activeWindow), marketIntelligenceService.getGradeTrends(activeWindow)]).then(([avg, grades]) => {
      setAverageTrend(avg);
      setGradeTrends(grades);
      setLoading(false);
    });
  }, [activeWindow]);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Market Trends" }]} className="mb-5" />
      <PageHeader title="Market Trends" description="Price movement over time — average and grade-wise." />

      <Tabs tabs={WINDOW_TABS} defaultValue="7" onChange={(v) => setActiveWindow(Number(v) as TrendWindow)}>
        {() => (
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Average Trend</CardTitle>
              </CardHeader>
              <CardBody>
                {loading ? <Skeleton className="h-56 w-full" /> : <TrendChart points={averageTrend} />}
              </CardBody>
            </Card>

            <div>
              <p className="text-eyebrow mb-3">Grade-wise Trend</p>
              <Grid cols={1} colsMd={2} gap="md">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <GridItem key={i}>
                        <Skeleton className="h-56 w-full" />
                      </GridItem>
                    ))
                  : gradeTrends.map((gt) => (
                      <GridItem key={gt.grade}>
                        <Card padding="lg">
                          <CardHeader>
                            <CardTitle>{gt.grade}</CardTitle>
                            <span className="font-mono text-xs text-ink-faint">{formatINR(gt.points[gt.points.length - 1]?.averagePrice ?? 0)}</span>
                          </CardHeader>
                          <CardBody>
                            <TrendChart points={gt.points} height={140} />
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
              </Grid>
            </div>
          </div>
        )}
      </Tabs>
    </>
  );
}
