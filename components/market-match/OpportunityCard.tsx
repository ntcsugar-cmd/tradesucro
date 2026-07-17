import Link from "next/link";
import { TrendingDown, Percent, Clock, Gavel, Package, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { formatINR } from "@/lib/utils/format";
import type { Opportunity, OpportunityCategory } from "@/lib/types/smartMatch";

const CATEGORY_META: Record<OpportunityCategory, { label: string; icon: LucideIcon; tone: "gold" | "verified" | "urgent" }> = {
  best_buy: { label: "Best Buy Today", icon: ArrowDownRight, tone: "verified" },
  best_sell: { label: "Best Sell Today", icon: ArrowUpRight, tone: "gold" },
  high_margin: { label: "High Margin Deal", icon: Percent, tone: "gold" },
  urgent_offer: { label: "Urgent Offer", icon: Clock, tone: "urgent" },
  tender_closing: { label: "Tender Closing Soon", icon: Gavel, tone: "urgent" },
  inventory_ready: { label: "Inventory Ready to Sell", icon: Package, tone: "verified" },
  price_drop: { label: "Price Drop Alert", icon: TrendingDown, tone: "urgent" },
};

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const meta = CATEGORY_META[opportunity.category];
  const Icon = meta.icon;

  return (
    <Card padding="lg" className="h-full">
      <CardBody className="flex h-full flex-col">
        <Badge tone={meta.tone}>
          <Icon size={11} /> {meta.label}
        </Badge>
        <p className="mt-3 text-[14px] font-semibold text-charcoal dark:text-white leading-snug">{opportunity.title}</p>
        <p className="mt-1.5 text-[13px] text-ink-soft dark:text-white/50 leading-relaxed flex-1">{opportunity.description}</p>
        <div className="mt-4 pt-4 border-t border-line dark:border-white/10 flex items-center justify-between">
          <div>
            <p className="font-mono text-lg text-charcoal dark:text-white">{opportunity.category === "high_margin" ? `${opportunity.value.toFixed(1)}%` : formatINR(opportunity.value)}</p>
            <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{opportunity.meta}</p>
          </div>
          <Link href={opportunity.actionHref} className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            {opportunity.actionLabel} →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
