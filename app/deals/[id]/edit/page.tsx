"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Handshake } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { DealForm } from "@/components/deals";

import { dealService } from "@/services/deal.service";
import type { Deal } from "@/lib/types/deal";

export default function EditDealPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealService.getDealById(params.id).then((result) => {
      setDeal(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading deal…" />
      </div>
    );
  }

  if (!deal) {
    return <EmptyState icon={<Handshake size={20} />} title="Deal not found" action={{ label: "Back to Deals", onClick: () => router.push("/deals") }} />;
  }

  return (
    <>
      <PageHeader title={`Edit ${deal.dealNumber}`} description={`${deal.mill} → ${deal.buyer}`} />
      <div className="max-w-4xl">
        <DealForm mode="edit" initialDeal={deal} />
      </div>
    </>
  );
}
