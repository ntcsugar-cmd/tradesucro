import Link from "next/link";
import { ArrowDownRight, Percent, PackageCheck, Truck, Fuel, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { formatINR } from "@/lib/utils/format";
import type { CommercialOpportunity, CommercialOpportunityCategory } from "@/lib/types/commercial";

const CATEGORY_META: Record<CommercialOpportunityCategory, { label: string; icon: LucideIcon }> = {
  best_buy: { label: "Best Buy Today", icon: ArrowDownRight },
  best_margin: { label: "Best Margin Today", icon: Percent },
  cheapest_landed_cost: { label: "Cheapest Landed Cost", icon: PackageCheck },
  fastest_dispatch: { label: "Fastest Dispatch", icon: Truck },
  lowest_freight: { label: "Lowest Freight", icon: Fuel },
  highest_profit: { label: "Highest Profit Opportunity", icon: Trophy },
};

function formatValue(opportunity: CommercialOpportunity): string {
  if (opportunity.category === "fastest_dispatch") return `${opportunity.value} days`;
  return formatINR(opportunity.value);
}

export function CommercialOpportunityCard({ opportunity }: { opportunity: CommercialOpportunity }) {
  const meta = CATEGORY_META[opportunity.category];
  const Icon = meta.icon;

  return (
    <Card padding="lg" className="h-full">
      <CardBody className="flex h-full flex-col">
        <Badge tone="gold">
          <Icon size={11} /> {meta.label}
        </Badge>
        <p className="mt-3 text-[14px] font-semibold text-charcoal dark:text-white leading-snug">{opportunity.title}</p>
        <p className="mt-1.5 text-[13px] text-ink-soft dark:text-white/50 leading-relaxed flex-1">{opportunity.description}</p>
        <div className="mt-4 pt-4 border-t border-line dark:border-white/10 flex items-center justify-between">
          <div>
            <p className="font-mono text-lg text-charcoal dark:text-white">{formatValue(opportunity)}</p>
            <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{opportunity.meta}</p>
          </div>
          <Link href={opportunity.href} className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            View Offer →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
