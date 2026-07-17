"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trophy } from "lucide-react";
import { MiniAreaChart } from "@/components/trader";
import { traderResaleService } from "@/services/traderResale.service";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { SalesAnalyticsSummary } from "@/lib/types/traderResale";

const MEDAL_TONE = ["text-gold-bright", "text-ink-soft dark:text-white/50", "text-gold-dim dark:text-gold-bright"];

function BarRow({ label, value, maxValue, totalValue, formatValue }: { label: string; value: number; maxValue: number; totalValue: number; formatValue: (n: number) => string }) {
  const pct = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0;
  const share = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between text-[13px] mb-1.5">
        <span className="text-charcoal dark:text-white">{label}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-charcoal dark:text-white">{formatValue(value)}</span>
          <span className="font-mono text-[11px] text-ink-faint dark:text-white/40">{share}%</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SalesAnalyticsView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SalesAnalyticsSummary | null>(null);

  useEffect(() => {
    traderResaleService.getSalesAnalytics().then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Grid cols={1} colsMd={2} gap="md">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </Grid>
      </div>
    );
  }

  const customerTotal = summary.customerWise.reduce((sum, c) => sum + c.totalValue, 0);
  const gradeTotal = summary.gradeWise.reduce((sum, g) => sum + g.totalValue, 0);
  const maxCustomer = Math.max(...summary.customerWise.map((c) => c.totalValue), 1);
  const maxGrade = Math.max(...summary.gradeWise.map((g) => g.totalValue), 1);
  const maxTopCustomer = Math.max(...summary.topCustomers.map((c) => c.totalValue), 1);

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardBody>
          <MiniAreaChart points={summary.monthly.map((m) => ({ label: m.month, value: m.totalValue }))} height={160} />
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Profit Analysis</CardTitle>
          <span className="text-xs text-ink-faint dark:text-white/40">Revenue − cost of goods sold, by month</span>
        </CardHeader>
        <CardBody className="divide-y divide-line">
          {summary.profitAnalysis.map((p) => (
            <div key={p.month} className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-charcoal dark:text-white">{p.month}</span>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-ink-faint dark:text-white/40">Rev {formatINR(p.revenue)}</span>
                <span className="text-ink-faint dark:text-white/40">Cost {formatINR(p.cost)}</span>
                <span className={p.profit >= 0 ? "text-rise font-semibold" : "text-fall font-semibold"}>{formatINR(p.profit)}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Grid cols={1} colsMd={2} gap="md">
        <GridItem>
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Grade-wise Sales</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-line">
              {summary.gradeWise.map((g) => (
                <BarRow key={g.grade} label={`${g.grade} · ${formatQuantityMt(g.totalQuantity)}`} value={g.totalValue} maxValue={maxGrade} totalValue={gradeTotal} formatValue={formatINR} />
              ))}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-line">
              {summary.topCustomers.map((c, i) => (
                <div key={c.customer} className="py-2.5">
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="flex items-center gap-2">
                      <Trophy size={13} className={i < 3 ? MEDAL_TONE[i] : "text-charcoal/20 dark:text-white"} />
                      <span className="text-charcoal dark:text-white">{c.customer}</span>
                    </span>
                    <span className="font-mono text-charcoal dark:text-white">{formatINR(c.totalValue)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden ml-[21px]">
                    <div className="h-full bg-gold/70 rounded-full" style={{ width: `${Math.max(4, Math.round((c.totalValue / maxTopCustomer) * 100))}%` }} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Customer-wise Sales</CardTitle>
        </CardHeader>
        <CardBody className="divide-y divide-line">
          {summary.customerWise.map((c) => (
            <BarRow key={c.customer} label={`${c.customer} · ${formatQuantityMt(c.totalQuantity)}`} value={c.totalValue} maxValue={maxCustomer} totalValue={customerTotal} formatValue={formatINR} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
