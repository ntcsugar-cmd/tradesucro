"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Sparkline } from "@/components/charts/Sparkline";
import { PriceHistoryTable } from "@/components/pricing";
import { millPricingService } from "@/services/millPricing.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import type { PriceRevision, PriceHistoryPoint } from "@/lib/types/millPricing";

function PriceHistoryContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quote") ?? undefined;

  const [revisions, setRevisions] = useState<PriceRevision[]>([]);
  const [series, setSeries] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      millPricingService.getRevisionHistory(quoteId),
      quoteId ? millPricingService.getPriceHistorySeries(quoteId) : Promise.resolve([]),
    ]).then(([rev, pts]) => {
      setRevisions(rev);
      setSeries(pts);
      setLoading(false);
    });
  }, [quoteId]);

  const direction = series.length >= 2 && series[series.length - 1].price > series[0].price ? "up" : series.length >= 2 && series[series.length - 1].price < series[0].price ? "down" : "flat";

  return (
    <>
      <Breadcrumb items={[{ label: "Price History", href: "/price-board" }, { label: "Revision History" }]} className="mb-5" />
      <PageHeader
        title="Price Revision History"
        description={quoteId ? `Filtered to ${getProductLabel(revisions[0]?.product ?? "")}` : "Every price revision across all grades."}
      />

      {quoteId && series.length > 1 && (
        <Card padding="lg" className="mb-6">
          <CardBody>
            <p className="text-eyebrow mb-3">Price Trend</p>
            <Sparkline data={series.map((p) => p.price)} direction={direction} className="h-16 w-full" />
          </CardBody>
        </Card>
      )}

      <PriceHistoryTable revisions={revisions} loading={loading} />
    </>
  );
}

export default function PriceHistoryPage() {
  return (
    <Suspense fallback={null}>
      <PriceHistoryContent />
    </Suspense>
  );
}
