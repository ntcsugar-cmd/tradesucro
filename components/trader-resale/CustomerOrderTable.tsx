"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { OrderStatusBadge } from "./ResaleBadges";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { CustomerOrder } from "@/lib/types/traderResale";

interface CustomerOrderTableProps {
  orders: CustomerOrder[];
  loading?: boolean;
}

export function CustomerOrderTable({ orders, loading = false }: CustomerOrderTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<CustomerOrder>[] = [
    { key: "orderNumber", header: "Order No", render: (o) => <span className="font-mono text-xs">{o.orderNumber}</span> },
    { key: "customerName", header: "Customer", render: (o) => <span className="font-medium">{o.customerName}</span> },
    { key: "grade", header: "Grade", render: (o) => <span className="font-mono">{getProductLabel(o.product)} · {o.grade}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (o) => <span className="font-mono">{formatQuantityMt(o.quantity)}</span> },
    { key: "totalValue", header: "Total Value", align: "right", render: (o) => <span className="font-mono font-medium">{formatINR(o.totalValue)}</span> },
    { key: "grossMargin", header: "Gross Margin", align: "right", render: (o) => <span className={`font-mono ${o.grossMargin >= 0 ? "text-rise" : "text-fall"}`}>{formatINR(o.grossMargin)}</span> },
    { key: "deliveryDate", header: "Delivery Date", render: (o) => new Date(o.deliveryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${o.orderNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/trader/orders/${o.id}`); }}>
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      getRowId={(o) => o.id}
      loading={loading}
      pageSize={12}
      onRowClick={(o) => router.push(`/trader/orders/${o.id}`)}
      emptyTitle="No customer orders"
      emptyDescription="Orders you confirm against resale offers will appear here."
    />
  );
}
