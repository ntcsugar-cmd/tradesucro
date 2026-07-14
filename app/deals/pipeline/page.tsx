"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { DealPipelineBoard } from "@/components/deals";
import { dealService } from "@/services/deal.service";
import type { Deal } from "@/lib/types/deal";

export default function DealPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealService.getDeals().then((result) => {
      setDeals(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader title="Deal Pipeline" description="Every active deal, staged by lifecycle. Cancelled deals are excluded from this view." />
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading pipeline…" />
        </div>
      ) : (
        <DealPipelineBoard deals={deals} />
      )}
    </>
  );
}
