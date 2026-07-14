import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequirementForm } from "@/components/marketplace";

export default function BuySugarPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Buy Sugar" }]} className="mb-5" />
      <PageHeader title="Post Buy Requirement" description="Tell sellers what you need — grade, quantity, and destination." />
      <div className="max-w-3xl">
        <RequirementForm />
      </div>
    </>
  );
}
