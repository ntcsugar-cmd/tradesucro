import { PageHeader } from "@/components/layout/PageHeader";
import { ResaleSubNav, SalesStatsWidget, SalesAnalyticsView } from "@/components/trader-resale";

export default function SalesAnalyticsPage() {
  return (
    <>
      <ResaleSubNav />
      <PageHeader title="Sales Analytics" description="Sales performance, margins, and customer/grade breakdowns across every order." />

      <div className="mb-8">
        <SalesStatsWidget />
      </div>

      <p className="text-eyebrow mb-3">Analytics</p>
      <SalesAnalyticsView />
    </>
  );
}
