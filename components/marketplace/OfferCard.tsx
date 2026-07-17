import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import { LISTING_STATUS_META } from "./statusMeta";
import type { MarketplaceOffer } from "@/lib/types/marketplace";

interface OfferCardProps {
  offer: MarketplaceOffer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const statusMeta = LISTING_STATUS_META[offer.status];

  return (
    <Link
      href={`/marketplace/offer/${offer.id}`}
      className="block bg-white dark:bg-charcoal-soft border border-line dark:border-white/10 p-5 hover:border-gold/40 dark:hover:border-gold/40 hover:shadow-card transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13.5px] font-semibold text-charcoal dark:text-white truncate">{offer.company.name}</p>
            {offer.company.verified === "verified" && <ShieldCheck size={13} className="text-success shrink-0" />}
          </div>
          <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
            {offer.dispatchFrom.city}, {getMasterStateLabel(offer.dispatchFrom.state)}
          </p>
        </div>
        <StatusBadge status={statusMeta.badgeStatus} dot={false}>
          {statusMeta.label}
        </StatusBadge>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-lg text-charcoal dark:text-white">{getProductLabel(offer.product)} · {offer.grade}</p>
          <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{formatQuantityMt(offer.quantity)} available · {offer.season}</p>
        </div>
        <p className="font-mono text-[15px] text-gold-dim">{formatPricePerUnit(offer.price)}</p>
      </div>
    </Link>
  );
}
