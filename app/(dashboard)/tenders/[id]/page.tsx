"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Gavel, Ban } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TenderStatusBadge, BidsTable } from "@/components/tenders";

import { tenderService } from "@/services/tender.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Tender, TenderBid } from "@/lib/types/tender";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="text-[13.5px] text-charcoal font-medium">{value}</span>
    </div>
  );
}

export default function TenderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<TenderBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [awarding, setAwarding] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([tenderService.getTenderById(params.id), tenderService.getBidsForTender(params.id)]).then(([t, b]) => {
      setTender(t ?? null);
      setBids(b);
      setLoading(false);
    });
  }, [params.id]);

  async function handleAward(bidId: string) {
    if (!tender) return;
    setAwarding(bidId);
    const updated = await tenderService.awardTender(tender.id, bidId);
    const refreshedBids = await tenderService.getBidsForTender(tender.id);
    setAwarding(null);
    if (updated) {
      setTender(updated);
      setBids(refreshedBids);
      toast({ variant: "success", title: "Tender awarded" });
    }
  }

  async function handleCancel() {
    if (!tender) return;
    const updated = await tenderService.cancelTender(tender.id);
    if (updated) {
      setTender(updated);
      toast({ variant: "info", title: "Tender cancelled" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading tender…" />
      </div>
    );
  }

  if (!tender) {
    return (
      <>
        <Breadcrumb items={[{ label: "Tender Management", href: "/tenders" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState icon={<Gavel size={20} />} title="Tender not found" action={{ label: "Back to Tender Board", onClick: () => router.push("/tenders") }} />
      </>
    );
  }

  const canAward = tender.status === "bidding_open" || tender.status === "under_evaluation";

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/tenders" }, { label: tender.tenderNumber }]} className="mb-5" />
      <PageHeader
        title={tender.tenderNumber}
        description={`${getProductLabel(tender.product)} · ${tender.grade}`}
        actions={
          tender.status !== "cancelled" && tender.status !== "awarded" ? (
            <Button variant="danger" size="md" onClick={handleCancel}>
              <Ban size={15} /> Cancel Tender
            </Button>
          ) : undefined
        }
      />

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={1}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Tender Details</CardTitle>
              <TenderStatusBadge status={tender.status} />
            </CardHeader>
            <CardBody>
              <Row label="Quantity" value={formatQuantityMt(tender.quantity)} />
              <Row label="Reserve price" value={formatINR(tender.reservePrice)} />
              <Row label="EMD amount" value={formatINR(tender.emdAmount)} />
              <Row label="Bid deadline" value={new Date(tender.bidDeadline).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={2}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Bids Received ({bids.length})</CardTitle>
            </CardHeader>
            <CardBody>
              <BidsTable bids={bids} canAward={canAward} onAward={handleAward} awarding={awarding} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
