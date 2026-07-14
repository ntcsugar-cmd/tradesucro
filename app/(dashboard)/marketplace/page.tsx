"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Package, ClipboardList, ShieldCheck, Handshake } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { MarketplaceSearchBar, OfferCard, RequirementCard, TrendingProductsWidget, MarketplaceActivityFeed } from "@/components/marketplace";

import { marketplaceService } from "@/services/marketplace.service";
import type { MarketplaceOffer, MarketplaceRequirement, MarketplaceStats } from "@/lib/types/marketplace";

export default function MarketplacePage() {
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [requirements, setRequirements] = useState<MarketplaceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      marketplaceService.getStats(),
      marketplaceService.getOffers({ sort: "newest" }),
      marketplaceService.getRequirements({ sort: "newest" }),
    ]).then(([statsResult, offersResult, requirementsResult]) => {
      setStats(statsResult);
      setOffers(offersResult.slice(0, 4));
      setRequirements(requirementsResult.slice(0, 4));
      setLoading(false);
    });
  }, []);

  function handleSearch(query: string) {
    window.location.href = `/marketplace/offers?search=${encodeURIComponent(query)}`;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Marketplace" }]} className="mb-5" />
      <PageHeader
        title="Marketplace"
        description="India's B2B sugar marketplace — live offers and requirements from verified companies."
        actions={
          <>
            <Link href="/marketplace/buy">
              <Button variant="outline" size="md">
                <ClipboardList size={15} /> Post Buy Requirement
              </Button>
            </Link>
            <Link href="/marketplace/sell">
              <Button variant="primary" size="md">
                <Package size={15} /> Post Sell Offer
              </Button>
            </Link>
          </>
        }
      />

      <div className="mb-6">
        <MarketplaceSearchBar onSearch={handleSearch} />
      </div>

      <Grid cols={2} colsMd={4} gap="md" className="mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatisticsCard label="Active Sell Offers" value={stats?.activeSellOffers ?? 0} icon={<Package size={16} />} />
            <StatisticsCard label="Active Buy Requirements" value={stats?.activeBuyRequirements ?? 0} icon={<ClipboardList size={16} />} />
            <StatisticsCard label="Verified Companies" value={stats?.verifiedCompanies ?? 0} icon={<ShieldCheck size={16} />} tone="dark" />
            <StatisticsCard label="Today's Deals" value={stats?.todaysDeals ?? 0} icon={<Handshake size={16} />} tone="dark" />
          </>
        )}
      </Grid>

      <Grid cols={1} colsLg={2} gap="md" className="mb-6">
        <GridItem>
          <MarketplaceActivityFeed />
        </GridItem>
        <GridItem>
          <TrendingProductsWidget />
        </GridItem>
      </Grid>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-eyebrow">Latest Offers</p>
          <Link href="/marketplace/offers" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            View all offers <ArrowUpRight size={13} />
          </Link>
        </div>
        {loading ? (
          <Grid cols={1} colsMd={2} colsLg={4} gap="md">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
          </Grid>
        ) : offers.length > 0 ? (
          <Grid cols={1} colsMd={2} colsLg={4} gap="md">
            {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
          </Grid>
        ) : (
          <EmptyState icon={<Package size={20} />} title="No offers yet" description="Be the first to post a sell offer." />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-eyebrow">Latest Requirements</p>
          <Link href="/marketplace/requirements" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            View all requirements <ArrowUpRight size={13} />
          </Link>
        </div>
        {loading ? (
          <Grid cols={1} colsMd={2} colsLg={4} gap="md">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
          </Grid>
        ) : requirements.length > 0 ? (
          <Grid cols={1} colsMd={2} colsLg={4} gap="md">
            {requirements.map((req) => <RequirementCard key={req.id} requirement={req} />)}
          </Grid>
        ) : (
          <EmptyState icon={<ClipboardList size={20} />} title="No requirements yet" description="Be the first to post a buy requirement." />
        )}
      </div>
    </>
  );
}
