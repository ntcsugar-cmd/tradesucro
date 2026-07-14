import { PageHeader } from "@/components/layout/PageHeader";
import { ResaleSubNav, ResaleOfferForm } from "@/components/trader-resale";

export default function CreateResaleOfferPage() {
  return (
    <>
      <ResaleSubNav />
      <PageHeader title="Create Resale Offer" description="Select an inventory lot, set your price, and publish it for sale." />
      <ResaleOfferForm />
    </>
  );
}
