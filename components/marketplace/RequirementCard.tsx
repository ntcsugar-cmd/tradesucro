import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import { LISTING_STATUS_META } from "./statusMeta";
import type { MarketplaceRequirement } from "@/lib/types/marketplace";

interface RequirementCardProps {
  requirement: MarketplaceRequirement;
}

export function RequirementCard({ requirement }: RequirementCardProps) {
  const statusMeta = LISTING_STATUS_META[requirement.status];

  return (
    <Link
      href={`/marketplace/requirement/${requirement.id}`}
      className="block bg-white border border-line p-5 hover:border-gold/40 hover:shadow-card transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13.5px] font-semibold text-charcoal truncate">{requirement.company.name}</p>
            {requirement.company.verified === "verified" && <ShieldCheck size={13} className="text-success shrink-0" />}
          </div>
          <p className="text-xs text-ink-faint mt-0.5">
            {requirement.destination.city}, {getMasterStateLabel(requirement.destination.state)}
          </p>
        </div>
        <StatusBadge status={statusMeta.badgeStatus} dot={false}>
          {statusMeta.label}
        </StatusBadge>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-lg text-charcoal">{getProductLabel(requirement.product)} · {requirement.grade}</p>
          <p className="text-xs text-ink-faint mt-0.5">{formatQuantityMt(requirement.quantity)} needed · {requirement.season}</p>
        </div>
        <p className="font-mono text-[15px] text-gold-dim">{formatPricePerUnit(requirement.expectedPrice)}</p>
      </div>
    </Link>
  );
}
