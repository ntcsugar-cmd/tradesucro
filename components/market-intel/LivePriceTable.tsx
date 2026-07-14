import { ArrowUpRight, ArrowDownRight, Minus, Check, X } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";

interface LivePriceTableProps {
  entries: MillPriceEntry[];
  loading?: boolean;
}

export function LivePriceTable({ entries, loading = false }: LivePriceTableProps) {
  const columns: DataTableColumn<MillPriceEntry>[] = [
    { key: "millName", header: "Mill Name", render: (e) => <span className="font-medium">{e.millName}</span> },
    { key: "state", header: "State", render: (e) => getMasterStateLabel(e.state) },
    { key: "grade", header: "Grade", render: (e) => <span className="font-mono">{e.grade}</span> },
    { key: "todaysPrice", header: "Today's Price", render: (e) => <span className="font-mono">{formatINR(e.todaysPrice)}</span> },
    { key: "previousPrice", header: "Previous Price", render: (e) => <span className="font-mono text-ink-faint">{formatINR(e.previousPrice)}</span> },
    {
      key: "change",
      header: "Change",
      render: (e) => {
        const diff = e.todaysPrice - e.previousPrice;
        return (
          <span className={`flex items-center gap-1 font-mono text-xs ${diff > 0 ? "text-rise" : diff < 0 ? "text-fall" : "text-ink-faint"}`}>
            {diff > 0 ? <ArrowUpRight size={13} /> : diff < 0 ? <ArrowDownRight size={13} /> : <Minus size={13} />}
            {formatINR(Math.abs(diff))}
          </span>
        );
      },
    },
    { key: "timeUpdated", header: "Time Updated", render: (e) => new Date(e.timeUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
    { key: "offerAvailable", header: "Offer", render: (e) => (e.offerAvailable ? <Check size={14} className="text-success" /> : <X size={14} className="text-ink-faint" />) },
    { key: "tenderOpen", header: "Tender", render: (e) => (e.tenderOpen ? <Check size={14} className="text-success" /> : <X size={14} className="text-ink-faint" />) },
    { key: "quantityAvailable", header: "Quantity", render: (e) => <span className="font-mono">{formatQuantityMt(e.quantityAvailable)}</span> },
    { key: "dispatchDate", header: "Dispatch Date", render: (e) => new Date(e.dispatchDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { key: "paymentTerms", header: "Payment Terms", render: (e) => getPaymentTermLabel(e.paymentTerms) },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      getRowId={(e) => e.id}
      loading={loading}
      pageSize={15}
      emptyTitle="No mills match your filters"
      emptyDescription="Try widening your filters or searching a different state, mill, or grade."
    />
  );
}
