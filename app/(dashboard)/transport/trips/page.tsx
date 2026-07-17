"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { TransportSubNav, TransportDispatchStatusBadge } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatINR } from "@/lib/utils/format";
import type { TransportDispatch } from "@/lib/types/transport";

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TransportDispatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transportService.getCompletedTrips().then((result) => {
      setTrips(result);
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<TransportDispatch>[] = [
    { key: "dispatchNumber", header: "Trip No.", sortable: true, render: (d) => <span className="font-mono text-[13px] font-medium text-charcoal dark:text-white">{d.dispatchNumber}</span> },
    { key: "product", header: "Product", render: (d) => <span>{getProductLabel(d.product)} · {d.grade}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (d) => <span className="font-mono">{formatQuantityMt(d.quantity)}</span> },
    { key: "route", header: "Route", render: (d) => <span className="text-[13px]">{getMasterStateLabel(d.pickup.state)} → {getMasterStateLabel(d.delivery.state)}</span> },
    { key: "rate", header: "Rate", align: "right", render: (d) => <span className="font-mono">{formatINR(d.rate)}</span> },
    {
      key: "actualDelivery",
      header: "Delivered On",
      sortable: true,
      render: (d) => (d.actualDelivery ? new Date(d.actualDelivery).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"),
    },
    { key: "status", header: "Status", render: (d) => <TransportDispatchStatusBadge status={d.status} /> },
  ];

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Completed Trips" description="Every dispatch that's been delivered and confirmed." />

      {!loading && trips.length === 0 ? (
        <EmptyState icon={<CheckCircle2 size={20} />} title="No completed trips yet" description="Trips will appear here once a dispatch is marked delivered." />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={trips}
          getRowId={(d) => d.id}
          loading={loading}
          pageSize={12}
          onRowClick={(d) => router.push(`/transport/dispatches/${d.id}`)}
          emptyTitle="No completed trips yet"
          emptyDescription="Trips will appear here once a dispatch is marked delivered."
          renderMobileCard={(d) => (
            <MobileDataCard
              title={d.dispatchNumber}
              subtitle={`${getProductLabel(d.product)} · ${d.grade}`}
              badge={<TransportDispatchStatusBadge status={d.status} />}
              onClick={() => router.push(`/transport/dispatches/${d.id}`)}
              fields={[
                { label: "Route", value: `${getMasterStateLabel(d.pickup.state)} → ${getMasterStateLabel(d.delivery.state)}` },
                { label: "Rate", value: formatINR(d.rate) },
                { label: "Delivered", value: d.actualDelivery ? new Date(d.actualDelivery).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—", secondary: true },
              ]}
            />
          )}
        />
      )}
    </>
  );
}
