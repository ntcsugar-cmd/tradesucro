import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { PriceHeatMapGrid } from "@/components/market-intel";

export default function PriceHeatMapPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Price Heat Map" }]} className="mb-5" />
      <PageHeader title="Price Heat Map" description="State-wise average, highest, lowest, mills, offers, and tenders." />
      <PriceHeatMapGrid />
    </>
  );
}
