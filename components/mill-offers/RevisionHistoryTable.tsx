"use client";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import type { MillOfferRevision } from "@/lib/types/millOffer";

interface RevisionHistoryTableProps {
  revisions: (MillOfferRevision & { offerNumber?: string })[];
  loading?: boolean;
  showOfferColumn?: boolean;
}

export function RevisionHistoryTable({ revisions, loading = false, showOfferColumn = false }: RevisionHistoryTableProps) {
  const columns: DataTableColumn<MillOfferRevision & { offerNumber?: string }>[] = [
    ...(showOfferColumn
      ? [{ key: "offerNumber", header: "Offer No", render: (r: MillOfferRevision & { offerNumber?: string }) => <span className="font-mono text-xs">{r.offerNumber}</span> } as DataTableColumn<MillOfferRevision & { offerNumber?: string }>]
      : []),
    { key: "revisionNumber", header: "Revision Number", render: (r) => <span className="font-mono">Rev {r.revisionNumber}</span> },
    { key: "changedBy", header: "Changed By" },
    {
      key: "changedOn",
      header: "Changed On",
      render: (r) => new Date(r.changedOn).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    },
    { key: "fieldsModified", header: "Fields Modified", render: (r) => r.fieldsModified.join(", ") },
  ];

  return (
    <DataTable
      columns={columns}
      data={revisions}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={15}
      emptyTitle="No revisions"
      emptyDescription="No changes have been recorded yet."
    />
  );
}
