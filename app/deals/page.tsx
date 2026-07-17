"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { DealTable, DealFilterPanel, DealStatsWidget } from "@/components/deals";

import { dealService } from "@/services/deal.service";
import type { Deal, DealFilters } from "@/lib/types/deal";

export default function DealsBoardPage() {
  const [filters, setFilters] = useState<DealFilters>({});
  const [search, setSearch] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dealService.getDeals({ ...filters, search: search || undefined }).then((result) => {
      setDeals(result);
      setLoading(false);
    });
  }, [filters, search]);

  return (
    <>
      <PageHeader
        title="Deals"
        description="The complete lifecycle of every sugar deal, from inquiry to delivery."
        actions={
          <Link href="/deals/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> Create Deal
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <DealStatsWidget />
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by deal number, mill, buyer, trader, broker…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <DealFilterPanel onApply={setFilters} />
        </GridItem>
        <GridItem span={3}>
          <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${deals.length} deals`}</p>
          <DealTable deals={deals} loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}
