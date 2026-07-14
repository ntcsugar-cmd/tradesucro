"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealDocumentsCenter, DealReportsPanel } from "@/components/deals";
import { dealService } from "@/services/deal.service";
import type { Deal } from "@/lib/types/deal";

export default function DealDocumentsPage() {
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
      <PageHeader title="Deal Documents & Reports" description="Every document uploaded across every deal, plus deal reporting." />

      <DealDocumentsCenter deals={deals} loading={loading} />

      <p className="text-eyebrow mt-10 mb-3">Reports</p>
      <DealReportsPanel />
    </>
  );
}
