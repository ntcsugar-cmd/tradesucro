import { StatusBadge } from "@/components/ui/StatusBadge";
import { MillNameScroll } from "@/components/common";
import { getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillPriceEntry } from "@/lib/types/marketIntelligence";

interface MillCompareTableProps {
  entries: MillPriceEntry[];
}

export function MillCompareTable({ entries }: MillCompareTableProps) {
  if (entries.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">Add mills above to compare them side by side.</p>;
  }

  const rows: { label: string; render: (e: MillPriceEntry) => React.ReactNode }[] = [
    { label: "State", render: (e) => getMasterStateLabel(e.state) },
    { label: "Grade", render: (e) => <span className="font-mono">{e.grade}</span> },
    { label: "Price", render: (e) => <span className="font-mono text-gold-dim font-semibold">{formatINR(e.todaysPrice)}</span> },
    { label: "Dispatch", render: (e) => new Date(e.dispatchDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { label: "Payment Terms", render: (e) => getPaymentTermLabel(e.paymentTerms) },
    { label: "Tender Status", render: (e) => <StatusBadge status={e.tenderOpen ? "success" : "neutral"}>{e.tenderOpen ? "Open" : "None"}</StatusBadge> },
    { label: "Offer Status", render: (e) => <StatusBadge status={e.offerAvailable ? "success" : "neutral"}>{e.offerAvailable ? "Available" : "None"}</StatusBadge> },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr>
            <th className="text-left py-2.5 pr-4 text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40 w-32">Metric</th>
            {entries.map((e) => (
              <th key={e.id} className="text-left py-2.5 px-4 border-l border-line dark:border-white/10 font-medium text-[13px] text-charcoal dark:text-white w-44 max-w-[176px]">
                <MillNameScroll name={e.millName} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line dark:border-white/10">
              <td className="py-2.5 pr-4 text-xs text-ink-faint dark:text-white/40">{row.label}</td>
              {entries.map((e) => (
                <td key={e.id} className="py-2.5 px-4 border-l border-line dark:border-white/10 text-[13px]">
                  {row.render(e)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
