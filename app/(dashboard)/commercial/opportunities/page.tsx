"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CommercialOpportunityCard } from "@/components/commercial";
import { commercialDecisionService } from "@/services/commercialDecision.service";
import type { CommercialOpportunity } from "@/lib/types/commercial";

export default function CommercialOpportunitiesPage() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);

  useEffect(() => {
    commercialDecisionService.getOpportunities().then((result) => {
      setOpportunities(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Commercial Decision Engine", href: "/commercial" }, { label: "Opportunities" }]} className="mb-5" />
      <PageHeader
        title="Smart Opportunities"
        description="Best buy, best margin, cheapest landed cost, fastest dispatch, lowest freight, and highest profit — ranked automatically across every published offer."
      />

      {loading ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </Grid>
      ) : opportunities.length === 0 ? (
        <EmptyState icon={<Trophy size={20} />} title="No opportunities right now" description="No published mill offers to analyze yet." />
      ) : (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {opportunities.map((opp) => (
            <GridItem key={opp.id}>
              <CommercialOpportunityCard opportunity={opp} />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
