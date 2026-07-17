"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComparisonFilterBar, SupplierComparisonTable } from "@/components/commercial";
import { commercialDecisionService } from "@/services/commercialDecision.service";
import type { SupplierComparisonRow } from "@/lib/types/commercial";

export default function SupplierComparisonPage() {
  const [rows, setRows] = useState<SupplierComparisonRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function runComparison(grade: string | undefined, quantity: number) {
    setLoading(true);
    const result = await commercialDecisionService.getSupplierComparison(grade, quantity);
    setRows(result);
    setLoading(false);
  }

  useEffect(() => {
    runComparison(undefined, 100);
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Commercial Decision Engine", href: "/commercial" }, { label: "Supplier Comparison" }]} className="mb-5" />
      <PageHeader
        title="Supplier Comparison"
        description="Every published mill offer, ranked by Commercial Score — price, freight, quality, trust, dispatch speed, payment terms, and availability, all in one number."
      />

      <div className="mb-6">
        <ComparisonFilterBar onApply={runComparison} />
      </div>

      <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Ranking suppliers…" : `${rows.length} offers ranked`}</p>
      <SupplierComparisonTable rows={rows} loading={loading} />
    </>
  );
}
