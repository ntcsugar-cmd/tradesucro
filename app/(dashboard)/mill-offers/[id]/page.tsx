"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Send, Ban, Copy, Printer, PackageX } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { OfferStatusBadge, OfferPreview, OfferTimeline } from "@/components/mill-offers";

import { millOfferService } from "@/services/millOffer.service";
import { toMillOfferDraft } from "@/lib/utils/millOfferDraft";
import type { MillOffer } from "@/lib/types/millOffer";

export default function MillOfferDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [offer, setOffer] = useState<MillOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<"publish" | "withdraw" | "duplicate" | null>(null);

  useEffect(() => {
    millOfferService.getOfferById(params.id).then((result) => {
      setOffer(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  async function handlePublish() {
    if (!offer) return;
    setActing("publish");
    const updated = await millOfferService.publishOffer(offer.id);
    setActing(null);
    if (updated) {
      setOffer(updated);
      toast({ variant: "success", title: "Offer published" });
    }
  }

  async function handleWithdraw() {
    if (!offer) return;
    setActing("withdraw");
    const updated = await millOfferService.withdrawOffer(offer.id);
    setActing(null);
    if (updated) {
      setOffer(updated);
      toast({ variant: "info", title: "Offer withdrawn" });
    }
  }

  async function handleDuplicate() {
    if (!offer) return;
    setActing("duplicate");
    const copy = await millOfferService.duplicateOffer(offer.id);
    setActing(null);
    if (copy) {
      toast({ variant: "success", title: "Offer duplicated", description: copy.offerNumber });
      router.push(`/mill-offers/${copy.id}/edit`);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading offer…" />
      </div>
    );
  }

  if (!offer) {
    return (
      <>
        <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState
          icon={<PackageX size={20} />}
          title="Offer not found"
          description="This mill offer may have been removed."
          action={{ label: "Back to Mill Offers", onClick: () => router.push("/mill-offers") }}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: offer.offerNumber }]} className="mb-5" />
      <PageHeader
        title={offer.offerNumber}
        description={`${offer.millName} · ${offer.city}`}
        actions={
          <>
            <Button variant="ghost" size="md" onClick={handlePrint} className="print:hidden">
              <Printer size={15} /> Print
            </Button>
            {offer.status === "draft" && (
              <Button variant="outline" size="md" onClick={() => router.push(`/mill-offers/${offer.id}/edit`)} className="print:hidden">
                <Pencil size={15} /> Edit
              </Button>
            )}
            {offer.status === "draft" && (
              <Button variant="primary" size="md" loading={acting === "publish"} onClick={handlePublish} className="print:hidden">
                <Send size={15} /> Publish
              </Button>
            )}
            {offer.status === "published" && (
              <Button variant="danger" size="md" loading={acting === "withdraw"} onClick={handleWithdraw} className="print:hidden">
                <Ban size={15} /> Withdraw Offer
              </Button>
            )}
            <Button variant="outline" size="md" loading={acting === "duplicate"} onClick={handleDuplicate} className="print:hidden">
              <Copy size={15} /> Duplicate Offer
            </Button>
          </>
        }
      />

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Offer Summary</CardTitle>
              <OfferStatusBadge offer={offer} />
            </CardHeader>
            <CardBody>
              <OfferPreview data={toMillOfferDraft(offer)} offerNumber={offer.offerNumber} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={1}>
          <Card padding="lg" className="print:hidden">
            <CardHeader>
              <CardTitle>Offer Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <OfferTimeline offerId={offer.id} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
