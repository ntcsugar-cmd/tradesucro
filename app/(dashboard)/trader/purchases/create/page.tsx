import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TraderSubNav, PurchaseForm } from "@/components/trader";

export default function CreatePurchasePage() {
  return (
    <>
      <TraderSubNav />
      <PageHeader
        title="New Purchase"
        description="A trader can purchase from Mill Offers, Tender Awards, Marketplace, or a Direct Supplier. Confirming creates a Deal automatically."
      />
      <div className="max-w-5xl">
        <Suspense fallback={null}>
          <PurchaseForm />
        </Suspense>
      </div>
    </>
  );
}
