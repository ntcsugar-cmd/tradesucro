import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TraderSubNav, PurchaseAnalyticsView } from "@/components/trader";

export default function PurchaseAnalyticsPage() {
  return (
    <>
      <TraderSubNav />
      <PageHeader title="Purchase Analytics" description="Monthly, supplier-wise, and grade-wise purchase trends, drawn from your full purchase history." />
      <div className="flex items-center gap-1.5 mb-3">
        <BarChart3 size={13} className="text-gold-dim" />
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint">Excludes cancelled and draft purchases</p>
      </div>
      <PurchaseAnalyticsView />
    </>
  );
}
