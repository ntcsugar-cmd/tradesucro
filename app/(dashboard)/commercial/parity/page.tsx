import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParityAnalysisView } from "@/components/commercial";

export default function ParityEnginePage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Commercial Decision Engine", href: "/commercial" }, { label: "Parity Engine" }]} className="mb-5" />
      <PageHeader
        title="Parity Engine"
        description="Purchase price against today's market, expected margin, and profit or loss — updated as you type."
      />
      <ParityAnalysisView />
    </>
  );
}
