import { FileCheck2, FileX2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import type { Deal, DealDocuments } from "@/lib/types/deal";

interface DocumentRow {
  id: string;
  dealNumber: string;
  buyer: string;
  label: string;
  fileName: string | null;
  uploadedAt: string | null;
}

const DOCUMENT_LABELS: { key: keyof DealDocuments; label: string }[] = [
  { key: "purchaseOrder", label: "Purchase Order" },
  { key: "saleConfirmation", label: "Sale Confirmation" },
  { key: "invoice", label: "Invoice" },
  { key: "taxInvoice", label: "Tax Invoice" },
  { key: "deliveryOrder", label: "Delivery Order" },
  { key: "ewayBill", label: "E-way Bill" },
  { key: "lrGr", label: "LR / GR" },
  { key: "paymentReceipt", label: "Payment Receipt" },
  { key: "qualityCertificate", label: "Quality Certificate" },
];

interface DealDocumentsCenterProps {
  deals: Deal[];
  loading?: boolean;
}

export function DealDocumentsCenter({ deals, loading = false }: DealDocumentsCenterProps) {
  const rows: DocumentRow[] = deals.flatMap((deal) =>
    DOCUMENT_LABELS.map(({ key, label }) => ({
      id: `${deal.id}-${key}`,
      dealNumber: deal.dealNumber,
      buyer: deal.buyer,
      label,
      fileName: deal.documents[key].fileName,
      uploadedAt: deal.documents[key].uploadedAt,
    }))
  ).filter((r) => r.fileName);

  const columns: DataTableColumn<DocumentRow>[] = [
    { key: "dealNumber", header: "Deal No", render: (r) => <span className="font-mono text-xs">{r.dealNumber}</span> },
    { key: "buyer", header: "Buyer" },
    {
      key: "label",
      header: "Document",
      render: (r) => (
        <span className="flex items-center gap-2">
          <FileCheck2 size={14} className="text-success" /> {r.label}
        </span>
      ),
    },
    { key: "fileName", header: "File" },
    { key: "uploadedAt", header: "Uploaded", render: (r) => (r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—") },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={20}
      emptyTitle="No documents"
      emptyDescription="No documents have been uploaded across any deal yet."
    />
  );
}

/** Exported for callers that want an icon-only "missing document" indicator elsewhere. */
export const MissingDocumentIcon = FileX2;
