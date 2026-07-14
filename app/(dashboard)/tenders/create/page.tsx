import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { TenderForm } from "@/components/tenders";

export default function CreateTenderPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/tenders" }, { label: "Create" }]} className="mb-5" />
      <PageHeader title="Create Tender" description="Open a bulk lot to bidding. Only verified mills can publish a tender." />
      <div className="max-w-2xl">
        <TenderForm />
      </div>
    </>
  );
}
