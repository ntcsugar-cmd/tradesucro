"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { MarketplaceSearchBar, SortSelect, FilterPanel, OffersTable } from "@/components/marketplace";

import { marketplaceService } from "@/services/marketplace.service";
import type { MarketplaceOffer, MarketplaceFilters } from "@/lib/types/marketplace";

function OffersListContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [filters, setFilters] = useState<MarketplaceFilters>({ search: initialSearch, sort: "newest" });
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketplaceService.getOffers(filters).then((result) => {
      setOffers(result);
      setLoading(false);
    });
  }, [filters]);

  return (
    <>
      <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Offers" }]} className="mb-5" />
      <PageHeader title="Sell Offers" description="Live sugar stock listed by mills and traders across India." />

      <div className="mb-6">
        <MarketplaceSearchBar
          defaultValue={initialSearch}
          onSearch={(q) => setFilters((f) => ({ ...f, search: q || undefined }))}
        />
      </div>

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <FilterPanel onApply={(f) => setFilters((prev) => ({ ...f, search: prev.search, sort: prev.sort }))} />
        </GridItem>

        <GridItem span={3}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-ink-faint dark:text-white/40">{loading ? "Loading…" : `${offers.length} offers`}</p>
            <SortSelect value={filters.sort ?? "newest"} onChange={(sort) => setFilters((f) => ({ ...f, sort }))} />
          </div>

          <OffersTable offers={offers} loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}

export default function OffersListPage() {
  return (
    <Suspense fallback={null}>
      <OffersListContent />
    </Suspense>
  );
}
