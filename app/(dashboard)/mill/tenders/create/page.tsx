import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { TenderForm } from "@/components/mill-tenders";

export default function CreateMillTenderPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: "Create" }]} className="mb-5" />
      <PageHeader title="Create Tender" description="Only verified mills can publish a tender." />
      <div className="max-w-4xl">
        <TenderForm mode="create" />
      </div>
    </>
  );
}
