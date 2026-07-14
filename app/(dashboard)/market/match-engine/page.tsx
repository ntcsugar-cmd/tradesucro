"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { MatchCriteriaForm, MatchCandidateTable, RequirementQuickPicker } from "@/components/market-match";
import { smartMatchService } from "@/services/smartMatch.service";
import type { MatchCandidate, MatchCriteria } from "@/lib/types/smartMatch";

export default function MatchEnginePage() {
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  async function handleRun(criteria: MatchCriteria) {
    setRunning(true);
    const result = await smartMatchService.matchCandidates(criteria);
    setCandidates(result);
    setRunning(false);
    setHasRun(true);
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Smart Match Engine" }]} className="mb-5" />
      <PageHeader
        title="Smart Match Engine"
        description="Automatically ranks Mill Offers, Trader Resale inventory, and recent Tender Awards against your requirement — by price, distance, quantity, dispatch speed, payment terms, supplier rating, verification, and expected margin."
      />

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Open Buy Requirements</CardTitle>
            </CardHeader>
            <CardBody>
              <RequirementQuickPicker onPick={handleRun} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <div className="space-y-6">
            <MatchCriteriaForm onRun={handleRun} running={running} />

            {hasRun && (
              <div>
                <p className="text-[13px] text-ink-faint mb-4">{running ? "Scoring candidates…" : `${candidates.length} ranked matches`}</p>
                <MatchCandidateTable candidates={candidates} loading={running} />
              </div>
            )}
          </div>
        </GridItem>
      </Grid>
    </>
  );
}
