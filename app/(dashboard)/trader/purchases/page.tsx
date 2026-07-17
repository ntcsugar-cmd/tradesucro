"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, ShoppingBag, Scale, TrendingUp, Handshake } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { TraderSubNav, PurchaseTable, PurchaseFilterPanel } from "@/components/trader";
import { traderPurchaseService } from "@/services/traderPurchase.service";
import { formatINR } from "@/lib/utils/format";
import type { Purchase, PurchaseFilters } from "@/lib/types/traderWorkspace";

export default function PurchaseRegisterPage() {
  const [filters, setFilters] = useState<PurchaseFilters>({});
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    traderPurchaseService.getPurchases({ ...filters, search: search || undefined }).then((result) => {
      setPurchases(result);
      setLoading(false);
    });
  }, [filters, search]);

  /** Purely a display-side aggregation of the already-fetched list — no new data source, no service change. */
  const summary = useMemo(() => {
    const active = purchases.filter((p) => p.status !== "cancelled");
    const totalValue = active.reduce((sum, p) => sum + p.totalCost, 0);
    const totalMargin = active.reduce((sum, p) => sum + p.expectedMargin, 0);
    const dealsCreated = purchases.filter((p) => p.status === "deal_created").length;
    return { count: purchases.length, totalValue, totalMargin, dealsCreated };
  }, [purchases]);

  return (
    <>
      <TraderSubNav />
      <PageHeader
        title="Purchase Register"
        description="Every purchase you've made, from mill offers, tender awards, direct purchases, and marketplace offers."
        actions={
          <Link href="/trader/purchases/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> New Purchase
            </Button>
          </Link>
        }
      />

      <Grid cols={2} colsMd={4} gap="md" className="mb-6">
        <StatisticsCard label="Total Purchases" value={summary.count} icon={<ShoppingBag size={16} />} />
        <StatisticsCard label="Total Value" value={formatINR(summary.totalValue)} icon={<Scale size={16} />} tone="dark" />
        <StatisticsCard label="Projected Margin" value={formatINR(summary.totalMargin)} icon={<TrendingUp size={16} />} />
        <StatisticsCard label="Deals Created" value={summary.dealsCreated} icon={<Handshake size={16} />} />
      </Grid>

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by purchase number, mill, supplier, broker…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <PurchaseFilterPanel onApply={setFilters} />
        </GridItem>
        <GridItem span={3}>
          <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${purchases.length} purchases`}</p>
          <PurchaseTable purchases={purchases} loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}
