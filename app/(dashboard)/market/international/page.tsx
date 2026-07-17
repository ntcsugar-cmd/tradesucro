"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/common/Badge";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { marketPhase3Service } from "@/services/marketPhase3.service";
import type { InternationalPhysicalQuote } from "@/lib/types/marketIntelligence";

export default function InternationalPhysicalMarketPage() {
  const [quotes, setQuotes] = useState<InternationalPhysicalQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketPhase3Service.getInternationalPhysicalQuotes().then((result) => {
      setQuotes(result);
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<InternationalPhysicalQuote>[] = [
    { key: "country", header: "Country", sortable: true, render: (q) => <span className="font-medium text-charcoal dark:text-white">{q.country}</span> },
    { key: "basis", header: "Basis", render: (q) => <Badge tone="charcoal">{q.basis}</Badge> },
    { key: "currency", header: "Currency", render: (q) => q.currency },
    { key: "price", header: "Price", align: "right", render: () => <span className="text-ink-faint dark:text-white/30 italic">Not connected</span> },
    { key: "change", header: "Change", align: "right", render: () => <span className="text-ink-faint dark:text-white/30 italic">—</span> },
    { key: "lastUpdated", header: "Last Updated", render: () => <span className="text-ink-faint dark:text-white/30 italic">Never</span> },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "International Market" }]} className="mb-5" />
      <PageHeader title="International Physical Market" description="Export/import FOB and CIF prices from the world's major sugar origins." />

      <Alert variant="warning" title="Awaiting live data provider" className="mb-6">
        Physical export/import quotes require a licensed trade data feed. None is connected in this environment — the table structure and refresh
        architecture are ready for one.
      </Alert>

      <ResponsiveTable
        columns={columns}
        data={quotes}
        getRowId={(q) => q.id}
        loading={loading}
        pageSize={15}
        emptyTitle="No quotes"
        emptyDescription="Connect a physical market data provider to populate this table."
        renderMobileCard={(q) => (
          <MobileDataCard
            title={q.country}
            subtitle={`${q.basis} · ${q.currency}`}
            fields={[
              { label: "Price", value: "Not connected" },
              { label: "Last Updated", value: "Never", secondary: true },
            ]}
          />
        )}
      />
    </>
  );
}
