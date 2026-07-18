"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { physicalMarketAdapter } from "@/services/adapters/physicalMarketAdapter";
import type { InternationalPhysicalQuote } from "@/lib/types/marketIntelligence";

export default function InternationalPhysicalMarketPage() {
  const [quotes, setQuotes] = useState<InternationalPhysicalQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    physicalMarketAdapter.fetch().then(([result]) => {
      setQuotes(result.value ?? []);
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<InternationalPhysicalQuote>[] = [
    { key: "country", header: "Country", sortable: true, render: (q) => <span className="font-medium text-charcoal dark:text-white">{q.country}</span> },
    { key: "basis", header: "Basis", render: (q) => <Badge tone="charcoal">{q.basis}</Badge> },
    { key: "currency", header: "Currency", render: (q) => q.currency },
    { key: "price", header: "Price", align: "right", render: (q) => q.price !== null ? <span className="font-mono text-charcoal dark:text-white">{q.price}</span> : <span className="text-ink-faint dark:text-white/30">—</span> },
    { key: "change", header: "Change", align: "right", render: (q) => q.change !== null ? <span className="font-mono">{q.change}</span> : <span className="text-ink-faint dark:text-white/30">—</span> },
    { key: "lastUpdated", header: "Last Updated", render: (q) => q.lastUpdated ? new Date(q.lastUpdated).toLocaleString("en-IN") : <span className="text-ink-faint dark:text-white/30">—</span> },
  ];

  const anyPending = quotes.some((q) => q.price === null);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "International Market" }]} className="mb-5" />
      <PageHeader title="International Physical Market" description="Export/import FOB and CIF prices from the world's major sugar origins." />

      {!loading && anyPending && (
        <Card padding="lg" className="mb-6">
          <CardBody className="text-[13.5px] text-ink-soft dark:text-white/60 leading-relaxed">
            Live market feed is currently being connected. This section will automatically update once verified market data becomes available.
          </CardBody>
        </Card>
      )}

      <ResponsiveTable
        columns={columns}
        data={quotes}
        getRowId={(q) => q.id}
        loading={loading}
        pageSize={15}
        emptyTitle="No quotes available"
        emptyDescription="Export/import quotes will appear here once market data becomes available."
        renderMobileCard={(q) => (
          <MobileDataCard
            title={q.country}
            subtitle={`${q.basis} · ${q.currency}`}
            fields={[
              { label: "Price", value: q.price !== null ? String(q.price) : "—" },
              { label: "Last Updated", value: q.lastUpdated ? new Date(q.lastUpdated).toLocaleDateString("en-IN") : "—", secondary: true },
            ]}
          />
        )}
      />
    </>
  );
}
