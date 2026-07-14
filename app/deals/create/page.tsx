import { PageHeader } from "@/components/layout/PageHeader";
import { DealForm } from "@/components/deals";

export default function CreateDealPage() {
  return (
    <>
      <PageHeader title="Create Deal" description="A deal can originate from a Mill Offer, Tender Award, Direct Negotiation, or Marketplace Offer. Only verified companies can create deals." />
      <div className="max-w-4xl">
        <DealForm mode="create" />
      </div>
    </>
  );
}
