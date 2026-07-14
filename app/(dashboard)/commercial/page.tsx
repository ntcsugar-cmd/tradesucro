import Link from "next/link";
import { Scale, Trophy, Columns3, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { ParityDashboardWidget, LandedCostCalculator } from "@/components/commercial";

const QUICK_LINKS = [
  { label: "Parity Engine", description: "Purchase vs. market price, margins, and profit/loss in one view.", href: "/commercial/parity", icon: Scale },
  { label: "Opportunities", description: "Best buys, best margins, cheapest landed cost, fastest dispatch.", href: "/commercial/opportunities", icon: Trophy },
  { label: "Supplier Comparison", description: "Rank every published mill offer by commercial score.", href: "/commercial/comparison", icon: Columns3 },
];

export default function CommercialOverviewPage() {
  return (
    <>
      <PageHeader
        title="Commercial Decision Engine"
        description="Landed cost, parity, and opportunity analysis — the numbers you used to work out in Excel, computed the instant an offer changes."
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Parity Dashboard</p>
        <ParityDashboardWidget />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {QUICK_LINKS.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card padding="lg" interactive className="h-full">
              <CardBody className="flex h-full flex-col">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
                  <Icon size={17} />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-charcoal">{label}</p>
                <p className="mt-1 text-[13px] text-ink-soft leading-relaxed flex-1">{description}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-gold-dim">
                  Open <ArrowRight size={12} />
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Landed Cost Engine</p>
        <LandedCostCalculator />
      </div>
    </>
  );
}
