"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Gavel } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { BidTable, BidComparisonGrid, AwardPanel } from "@/components/mill-tenders";

import { millTenderService, resolveEffectiveTenderStatus } from "@/services/millTender.service";
import type { MillTender, MillTenderBid, AwardDetails } from "@/lib/types/millTender";

export default function TenderBidsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [tender, setTender] = useState<MillTender | null>(null);
  const [bids, setBids] = useState<MillTenderBid[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [t, b] = await Promise.all([millTenderService.getTenderById(params.id), millTenderService.getBidsForTender(params.id)]);
    setTender(t ?? null);
    setBids(b);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleAward(details: AwardDetails) {
    const result = await millTenderService.awardTender(details);
    if (!result.success) {
      toast({ variant: "danger", title: "Could not award", description: result.message });
      return;
    }
    toast({ variant: "success", title: "Tender awarded" });
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading bids…" />
      </div>
    );
  }

  if (!tender) {
    return (
      <>
        <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState icon={<Gavel size={20} />} title="Tender not found" action={{ label: "Back to Tender Board", onClick: () => router.push("/mill/tenders") }} />
      </>
    );
  }

  const effectiveStatus = resolveEffectiveTenderStatus(tender);
  const canAward = effectiveStatus === "closed";

  return (
    <>
      <Breadcrumb
        items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: tender.tenderNumber, href: `/mill/tenders/${tender.id}` }, { label: "Bids" }]}
        className="mb-5"
      />
      <PageHeader title={`Bids — ${tender.tenderNumber}`} description={`${bids.length} bid${bids.length === 1 ? "" : "s"} received`} />

      <div className="space-y-6">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Bid List</CardTitle>
          </CardHeader>
          <CardBody>
            <BidTable bids={bids} />
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Bid Comparison</CardTitle>
          </CardHeader>
          <CardBody>
            <BidComparisonGrid bids={bids} />
          </CardBody>
        </Card>

        <AwardPanel tender={tender} bids={bids} canAward={canAward} onAward={handleAward} />
      </div>
    </>
  );
}
