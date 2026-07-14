import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { MillOfferForm } from "@/components/mill-offers";

export default function CreateMillOfferPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: "Create" }]} className="mb-5" />
      <PageHeader title="Create Mill Offer" description="Publish a new fixed-price daily offer for a sugar mill." />
      <div className="max-w-4xl">
        <MillOfferForm mode="create" />
      </div>
    </>
  );
}
