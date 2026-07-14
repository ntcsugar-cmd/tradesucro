import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { OfferForm } from "@/components/marketplace";

export default function SellSugarPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Sell Sugar" }]} className="mb-5" />
      <PageHeader title="Post Sell Offer" description="List your sugar stock for buyers across India." />
      <div className="max-w-3xl">
        <OfferForm />
      </div>
    </>
  );
}
