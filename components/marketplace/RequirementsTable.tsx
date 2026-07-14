"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import { LISTING_STATUS_META } from "./statusMeta";
import type { MarketplaceRequirement } from "@/lib/types/marketplace";

interface RequirementsTableProps {
  requirements: MarketplaceRequirement[];
  loading?: boolean;
}

export function RequirementsTable({ requirements, loading = false }: RequirementsTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<MarketplaceRequirement>[] = [
    { key: "id", header: "Requirement ID", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    {
      key: "company",
      header: "Company",
      render: (r) => (
        <span className="flex items-center gap-1.5 font-medium">
          {r.company.name}
          {r.company.verified === "verified" && <ShieldCheck size={13} className="text-success" />}
        </span>
      ),
    },
    { key: "product", header: "Product", render: (r) => getProductLabel(r.product) },
    { key: "grade", header: "Grade" },
    { key: "quantity", header: "Quantity", render: (r) => <span className="font-mono">{formatQuantityMt(r.quantity)}</span> },
    { key: "expectedPrice", header: "Expected Price", render: (r) => <span className="font-mono">{formatINR(r.expectedPrice)}</span> },
    {
      key: "destination",
      header: "Destination",
      render: (r) => `${r.destination.city}, ${getMasterStateLabel(r.destination.state)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const meta = LISTING_STATUS_META[r.status];
        return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={`View requirement ${r.id}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/marketplace/requirement/${r.id}`);
          }}
        >
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={requirements}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={10}
      onRowClick={(r) => router.push(`/marketplace/requirement/${r.id}`)}
      emptyTitle="No requirements"
      emptyDescription="No buy requirements match your search or filters right now."
    />
  );
}
