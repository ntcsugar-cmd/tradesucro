"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { MillCompareSelector, MillCompareTable } from "@/components/market-intel";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";

export default function CompareMillsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [entries, setEntries] = useState<MillPriceEntry[]>([]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setEntries([]);
      return;
    }
    marketIntelligenceService.compareMills(selectedIds).then(setEntries);
  }, [selectedIds]);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Compare Mills" }]} className="mb-5" />
      <PageHeader title="Compare Mills" description="Compare up to 10 mills side by side on price, terms, and status." />

      <div className="space-y-6">
        <Card padding="lg">
          <CardBody>
            <MillCompareSelector selectedIds={selectedIds} onChange={setSelectedIds} />
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
          </CardHeader>
          <CardBody>
            <MillCompareTable entries={entries} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
