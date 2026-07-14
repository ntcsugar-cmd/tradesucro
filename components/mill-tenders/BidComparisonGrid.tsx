import { Trophy, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillTenderBid } from "@/lib/types/millTender";

interface BidComparisonGridProps {
  bids: MillTenderBid[];
}

function scoreBid(bid: MillTenderBid, maxPrice: number, maxQty: number): number {
  const priceScore = maxPrice > 0 ? bid.price / maxPrice : 0;
  const qtyScore = maxQty > 0 ? bid.quantity / maxQty : 0;
  const emdScore = bid.emdStatus === "paid" || bid.emdStatus === "not_required" ? 1 : 0.5;
  const verifiedScore = bid.verified ? 1 : 0.7;
  return priceScore * 0.5 + qtyScore * 0.25 + emdScore * 0.15 + verifiedScore * 0.1;
}

/** BidComparisonGrid — a side-by-side comparison, not a submission list (see BidTable for that). */
export function BidComparisonGrid({ bids }: BidComparisonGridProps) {
  if (bids.length === 0) {
    return <p className="text-[13px] text-ink-faint italic">No bids to compare yet.</p>;
  }

  const maxPrice = Math.max(...bids.map((b) => b.price));
  const maxQty = Math.max(...bids.map((b) => b.quantity));
  const bestOverallId = [...bids].sort((a, b) => scoreBid(b, maxPrice, maxQty) - scoreBid(a, maxPrice, maxQty))[0]?.id;

  const rows: { label: string; render: (b: MillTenderBid) => React.ReactNode }[] = [
    {
      label: "Company",
      render: (b) => (
        <span className="flex items-center gap-1.5 font-medium text-charcoal">
          {b.companyName}
          {b.verified && <ShieldCheck size={12} className="text-success" />}
        </span>
      ),
    },
    {
      label: "Price",
      render: (b) => (
        <span className={`font-mono ${b.price === maxPrice ? "text-gold-dim font-semibold" : "text-charcoal"}`}>{formatINR(b.price)}</span>
      ),
    },
    {
      label: "Quantity",
      render: (b) => (
        <span className={`font-mono ${b.quantity === maxQty ? "text-gold-dim font-semibold" : "text-charcoal"}`}>{formatQuantityMt(b.quantity)}</span>
      ),
    },
    { label: "EMD", render: (b) => <span className="capitalize text-charcoal">{b.emdStatus.replace("_", " ")}</span> },
    { label: "Delivery", render: (b) => <span className="text-charcoal">{b.deliveryPreference}</span> },
    { label: "Payment", render: (b) => <span className="text-charcoal">{b.paymentPreference}</span> },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left py-2.5 pr-4 text-[11px] font-mono uppercase tracking-widest2 text-ink-faint w-32">Metric</th>
            {bids.map((b) => (
              <th key={b.id} className="text-left py-2.5 px-4 border-l border-line">
                <div className="flex items-center gap-1.5">
                  {b.id === bestOverallId && (
                    <span title="Best overall">
                      <Trophy size={13} className="text-gold-dim" />
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-ink-faint">{b.bidNumber}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <td className="py-2.5 pr-4 text-xs text-ink-faint">{row.label}</td>
              {bids.map((b) => (
                <td key={b.id} className="py-2.5 px-4 border-l border-line text-[13px]">
                  {row.render(b)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-line">
            <td className="py-2.5 pr-4 text-xs text-ink-faint">Highlights</td>
            {bids.map((b) => (
              <td key={b.id} className="py-2.5 px-4 border-l border-line">
                <div className="flex flex-wrap gap-1">
                  {b.price === maxPrice && <Badge tone="gold">Highest Price</Badge>}
                  {b.quantity === maxQty && <Badge tone="charcoal">Largest Quantity</Badge>}
                  {b.id === bestOverallId && <Badge tone="verified">Best Overall</Badge>}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
