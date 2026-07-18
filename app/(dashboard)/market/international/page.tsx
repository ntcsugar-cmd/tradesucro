"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/common/Badge";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { physicalMarketAdapter } from "@/services/adapters/physicalMarketAdapter";
import type { InternationalPhysicalQuote } from "@/lib/types/marketIntelligence";
import type { ProviderStatus } from "@/lib/types/marketDataProvider";

export default function InternationalPhysicalMarketPage() {
  const [quotes, setQuotes] = useState<InternationalPhysicalQuote[]>([]);
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    physicalMarketAdapter.fetch().then(([result]) => {
      setQuotes(result.value ?? []);
      setStatus(physicalMarketAdapter.getStatus());
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<InternationalPhysicalQuote>[] = [
    { key: "country", header: "Country", sortable: true, render: (q) => <span className="font-medium text-charcoal dark:text-white">{q.country}</span> },
    { key: "basis", header: "Basis", render: (q) => <Badge tone="charcoal">{q.basis}</Badge> },
    { key: "currency", header: "Currency", render: (q) => q.currency },
    { key: "price", header: "Price", align: "right", render: (q) => q.price !== null ? <span className="font-mono text-charcoal dark:text-white">{q.price}</span> : <span className="text-ink-faint dark:text-white/30 italic">Not connected</span> },
    { key: "change", header: "Change", align: "right", render: (q) => q.change !== null ? <span className="font-mono">{q.change}</span> : <span className="text-ink-faint dark:text-white/30 italic">—</span> },
    { key: "lastUpdated", header: "Last Updated", render: (q) => q.lastUpdated ? new Date(q.lastUpdated).toLocaleString("en-IN") : <span className="text-ink-faint dark:text-white/30 italic">Never</span> },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "International Market" }]} className="mb-5" />
      <PageHeader title="International Physical Market" description="Export/import FOB and CIF prices from the world's major sugar origins." />

      {status && status.connectionStatus !== "connected" && (
        <Alert variant="warning" title={status.connectionStatus === "blocked_network_policy" ? "Provider blocked by network policy" : "Awaiting API credentials"} className="mb-6">
          The physical market adapter is fully implemented and was just attempted —{" "}
          {status.connectionStatus === "blocked_network_policy"
            ? `the outbound request was rejected by this environment's network egress policy (${status.lastError ?? "host not in allowlist"}).`
            : "it needs a licensed trade-data API key to connect."}{" "}
          See <a href="/market/providers" className="underline hover:no-underline">Data Provider Status</a>.
        </Alert>
      )}

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
