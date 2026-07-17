"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { TransportDispatchStatusBadge } from "./TransportBadges";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { TransportDispatch } from "@/lib/types/transport";

interface DispatchTableProps {
  dispatches: TransportDispatch[];
  loading?: boolean;
}

export function DispatchTable({ dispatches, loading = false }: DispatchTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<TransportDispatch>[] = [
    { key: "dispatchNumber", header: "Dispatch No.", sortable: true, render: (d) => <span className="font-mono text-[13px] font-medium text-charcoal dark:text-white">{d.dispatchNumber}</span> },
    { key: "product", header: "Product", render: (d) => <span>{getProductLabel(d.product)} · {d.grade}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (d) => <span className="font-mono">{formatQuantityMt(d.quantity)}</span> },
    { key: "route", header: "Route", render: (d) => <span className="text-[13px]">{getMasterStateLabel(d.pickup.state)} → {getMasterStateLabel(d.delivery.state)}</span> },
    { key: "status", header: "Status", render: (d) => <TransportDispatchStatusBadge status={d.status} /> },
    {
      key: "estimatedDelivery",
      header: "ETA",
      sortable: true,
      render: (d) => new Date(d.estimatedDelivery).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
    { key: "actions", header: "", align: "right", render: () => <ArrowRight size={15} className="text-ink-faint dark:text-white/40" /> },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      data={dispatches}
      getRowId={(d) => d.id}
      loading={loading}
      pageSize={10}
      onRowClick={(d) => router.push(`/transport/dispatches/${d.id}`)}
      emptyTitle="No dispatches"
      emptyDescription="Accepted loads will appear here once assigned to a vehicle."
      renderMobileCard={(d) => (
        <MobileDataCard
          title={d.dispatchNumber}
          subtitle={`${getProductLabel(d.product)} · ${d.grade}`}
          badge={<TransportDispatchStatusBadge status={d.status} />}
          onClick={() => router.push(`/transport/dispatches/${d.id}`)}
          fields={[
            { label: "Route", value: `${getMasterStateLabel(d.pickup.state)} → ${getMasterStateLabel(d.delivery.state)}` },
            { label: "Quantity", value: formatQuantityMt(d.quantity) },
            { label: "ETA", value: new Date(d.estimatedDelivery).toLocaleDateString("en-IN", { dateStyle: "medium" }), secondary: true },
          ]}
        />
      )}
    />
  );
}
