"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles } from "lucide-react";
import { OpportunityCard } from "@/components/market-match";
import { marketOpportunitiesService } from "@/services/marketOpportunities.service";
import type { Opportunity } from "@/lib/types/smartMatch";

export default function MarketOpportunitiesPage() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    marketOpportunitiesService.getOpportunities().then((result) => {
      setOpportunities(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Opportunities" }]} className="mb-5" />
      <PageHeader
        title="Opportunities"
        description="Best buys, best sells, high-margin deals, urgent offers, tenders closing soon, unlisted inventory, and price drops — surfaced automatically."
      />

      {loading ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </Grid>
      ) : opportunities.length === 0 ? (
        <EmptyState icon={<Sparkles size={20} />} title="No opportunities right now" description="Check back shortly — the market updates throughout the day." />
      ) : (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {opportunities.map((opp) => (
            <GridItem key={opp.id}>
              <OpportunityCard opportunity={opp} />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
