import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { IndiaSpotMarketGrid } from "@/components/market-intel";

export default function IndiaSpotMarketPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "India Spot Market" }]} className="mb-5" />
      <PageHeader
        title="India Spot Market"
        description="State and city-level sugar spot prices, volume, and active buyer/seller counts — computed from live offers and requirements on TradeSucro."
      />
      <IndiaSpotMarketGrid />
    </>
  );
}
