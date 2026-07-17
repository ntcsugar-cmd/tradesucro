import { ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { TenderBid } from "@/lib/types/tender";

interface BidsTableProps {
  bids: TenderBid[];
  canAward: boolean;
  onAward: (bidId: string) => void;
  awarding?: string | null;
}

const BID_STATUS_META = {
  submitted: { label: "Submitted", badgeStatus: "pending" as const },
  under_review: { label: "Under Review", badgeStatus: "info" as const },
  shortlisted: { label: "Shortlisted", badgeStatus: "warning" as const },
  awarded: { label: "Awarded", badgeStatus: "success" as const },
  rejected: { label: "Rejected", badgeStatus: "danger" as const },
};

export function BidsTable({ bids, canAward, onAward, awarding }: BidsTableProps) {
  if (bids.length === 0) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">No bids received yet.</p>;
  }

  return (
    <div className="divide-y divide-line">
      {bids.map((bid) => {
        const meta = BID_STATUS_META[bid.status];
        return (
          <div key={bid.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13.5px] font-medium text-charcoal dark:text-white">{bid.bidderName}</p>
                {bid.bidderVerified && <ShieldCheck size={13} className="text-success" />}
              </div>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
                {formatQuantityMt(bid.bidQuantity)} · Submitted {new Date(bid.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <p className="font-mono text-sm text-gold-dim">{formatINR(bid.bidPrice)}</p>
              <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>
              {canAward && bid.status === "submitted" && (
                <Button variant="primary" size="sm" loading={awarding === bid.id} onClick={() => onAward(bid.id)}>
                  <Trophy size={13} /> Award
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
