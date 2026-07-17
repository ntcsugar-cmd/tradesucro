"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { MarketplaceSearchBar, SortSelect, FilterPanel, RequirementsTable } from "@/components/marketplace";

import { marketplaceService } from "@/services/marketplace.service";
import type { MarketplaceRequirement, MarketplaceFilters } from "@/lib/types/marketplace";

function RequirementsListContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [filters, setFilters] = useState<MarketplaceFilters>({ search: initialSearch, sort: "newest" });
  const [requirements, setRequirements] = useState<MarketplaceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketplaceService.getRequirements(filters).then((result) => {
      setRequirements(result);
      setLoading(false);
    });
  }, [filters]);

  return (
    <>
      <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Requirements" }]} className="mb-5" />
      <PageHeader title="Buy Requirements" description="Live buying needs from companies across India." />

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
            <p className="text-[13px] text-ink-faint dark:text-white/40">{loading ? "Loading…" : `${requirements.length} requirements`}</p>
            <SortSelect value={filters.sort ?? "newest"} onChange={(sort) => setFilters((f) => ({ ...f, sort }))} />
          </div>

          <RequirementsTable requirements={requirements} loading={loading} />
        </GridItem>
      </Grid>
    </>
  );
}

export default function RequirementsListPage() {
  return (
    <Suspense fallback={null}>
      <RequirementsListContent />
    </Suspense>
  );
}
