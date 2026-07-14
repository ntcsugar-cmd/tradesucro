"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Scale, Trophy, LineChart } from "lucide-react";
import { MiniAreaChart } from "./MiniAreaChart";
import { traderPurchaseService } from "@/services/traderPurchase.service";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { PurchaseAnalyticsSummary } from "@/lib/types/traderWorkspace";

const MEDAL_TONE = ["text-gold-bright", "text-ink-soft", "text-gold-dim"];

/** BarRow — a labelled progress bar against the group's maximum, with an explicit share-of-total percentage so the visual isn't the only signal. */
function BarRow({ label, value, maxValue, totalValue, formatValue }: { label: string; value: number; maxValue: number; totalValue: number; formatValue: (n: number) => string }) {
  const pct = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0;
  const share = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between text-[13px] mb-1.5">
        <span className="text-charcoal">{label}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-charcoal">{formatValue(value)}</span>
          <span className="font-mono text-[11px] text-ink-faint">{share}%</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PurchaseAnalyticsView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PurchaseAnalyticsSummary | null>(null);

  useEffect(() => {
    traderPurchaseService.getAnalytics().then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <Grid cols={1} colsMd={2} gap="md">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Grid>
        <Grid cols={1} colsMd={2} gap="md">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </Grid>
      </div>
    );
  }

  const supplierTotal = summary.supplierWise.reduce((sum, s) => sum + s.totalValue, 0);
  const gradeTotal = summary.gradeWise.reduce((sum, g) => sum + g.totalValue, 0);
  const maxSupplier = Math.max(...summary.supplierWise.map((s) => s.totalValue), 1);
  const maxGrade = Math.max(...summary.gradeWise.map((g) => g.totalValue), 1);
  const maxTopSupplierValue = Math.max(...summary.topSuppliers.map((s) => s.totalValue), 1);

  return (
    <div className="space-y-6">
      <Grid cols={1} colsMd={2} gap="md">
        <StatisticsCard label="Average Purchase Price" value={formatINR(summary.averagePurchasePrice)} icon={<Scale size={16} />} tone="dark" />
        <StatisticsCard label="Top Supplier" value={summary.topSuppliers[0]?.supplier ?? "—"} icon={<Trophy size={16} />} />
      </Grid>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Purchase Trend (Monthly)</CardTitle>
          <span className="flex items-center gap-1.5 text-xs text-ink-faint">
            <LineChart size={13} /> Total purchase value
          </span>
        </CardHeader>
        <CardBody>
          <MiniAreaChart points={summary.monthly.map((m) => ({ label: m.month, value: m.totalValue }))} height={160} />
        </CardBody>
      </Card>

      <Grid cols={1} colsMd={2} gap="md">
        <GridItem>
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Grade-wise Purchases</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-line">
              {summary.gradeWise.map((g) => (
                <BarRow
                  key={g.grade}
                  label={`${g.grade} · ${formatQuantityMt(g.totalQuantity)}`}
                  value={g.totalValue}
                  maxValue={maxGrade}
                  totalValue={gradeTotal}
                  formatValue={formatINR}
                />
              ))}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Top Suppliers</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-line">
              {summary.topSuppliers.map((s, i) => (
                <div key={s.supplier} className="py-2.5">
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="flex items-center gap-2">
                      <Trophy size={13} className={i < 3 ? MEDAL_TONE[i] : "text-charcoal/20"} />
                      <span className="text-charcoal">{s.supplier}</span>
                    </span>
                    <span className="font-mono text-charcoal">{formatINR(s.totalValue)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden ml-[21px]">
                    <div className="h-full bg-gold/70 rounded-full" style={{ width: `${Math.max(4, Math.round((s.totalValue / maxTopSupplierValue) * 100))}%` }} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Supplier-wise Purchases</CardTitle>
        </CardHeader>
        <CardBody className="divide-y divide-line">
          {summary.supplierWise.map((s) => (
            <BarRow
              key={s.supplier}
              label={`${s.supplier} · ${formatQuantityMt(s.totalQuantity)}`}
              value={s.totalValue}
              maxValue={maxSupplier}
              totalValue={supplierTotal}
              formatValue={formatINR}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
