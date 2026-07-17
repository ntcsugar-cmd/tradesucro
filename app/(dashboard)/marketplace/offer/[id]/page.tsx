"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Handshake, Share2, FileDown, ShieldCheck, PackageX } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/common/Badge";
import { PriceUnitToggle } from "@/components/common/PriceUnitToggle";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { CompanySummaryCard, OfferCard, ExpressInterestModal } from "@/components/marketplace";

import { useDisclosure } from "@/hooks/useDisclosure";
import { marketplaceService } from "@/services/marketplace.service";
import {
  getProductLabel,
  getMasterStateLabel,
  getPackagingLabel,
  getPaymentTermLabel,
  getDispatchTermLabel,
} from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { MarketplaceOffer } from "@/lib/types/marketplace";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium">{value}</span>
    </div>
  );
}

export default function OfferDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const interestModal = useDisclosure(false);

  const [offer, setOffer] = useState<MarketplaceOffer | null>(null);
  const [related, setRelated] = useState<MarketplaceOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    marketplaceService.getOfferById(params.id).then(async (result) => {
      if (cancelled) return;
      setOffer(result ?? null);
      if (result) {
        const all = await marketplaceService.getOffers({ product: result.product });
        setRelated(all.filter((o) => o.id !== result.id).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    toast({ variant: "success", title: "Link copied", description: "Share this offer with your team." });
  }

  function handleDownloadPdf() {
    toast({ variant: "info", title: "Coming soon", description: "PDF export isn't wired up yet — this is a placeholder." });
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
        <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Offers", href: "/marketplace/offers" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState
          icon={<PackageX size={20} />}
          title="Offer not found"
          description="This offer may have expired or been removed."
          action={{ label: "Back to offers", onClick: () => router.push("/marketplace/offers") }}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Offers", href: "/marketplace/offers" }, { label: offer.id }]}
        className="mb-5"
      />
      <PageHeader
        title={`${getProductLabel(offer.product)} — ${offer.grade}`}
        description={`Offered by ${offer.company.name}`}
        actions={
          <>
            <Button variant="ghost" size="md" onClick={handleShare}>
              <Share2 size={15} /> Share
            </Button>
            <Button variant="outline" size="md" onClick={handleDownloadPdf}>
              <FileDown size={15} /> Download PDF
            </Button>
            <Button variant="primary" size="md" onClick={interestModal.open}>
              <Handshake size={15} /> Express Interest
            </Button>
          </>
        }
      />

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                {offer.company.verified === "verified" && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <ShieldCheck size={13} /> Verified seller
                  </span>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge tone="gold">{getProductLabel(offer.product)}</Badge>
                    <Badge tone="charcoal">{offer.grade}</Badge>
                    <Badge tone="charcoal">{offer.season}</Badge>
                  </div>
                  <PriceUnitToggle priceInQtl={offer.price} />
                </div>
                <DetailRow label="Quantity available" value={formatQuantityMt(offer.quantity)} />
                <DetailRow label="Packaging" value={getPackagingLabel(offer.packaging)} />
                <DetailRow label="GST" value={offer.gstIncluded ? "Included" : "Excluded"} />
                <DetailRow label="Ready stock" value={offer.readyStock ? "Yes" : "No"} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Dispatch Details</CardTitle>
              </CardHeader>
              <CardBody>
                <DetailRow label="Dispatch from" value={`${offer.dispatchFrom.city}, ${getMasterStateLabel(offer.dispatchFrom.state)}`} />
                <DetailRow label="Dispatch date" value={new Date(offer.dispatchDate).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
                <DetailRow label="Dispatch terms" value={getDispatchTermLabel(offer.dispatchTerms)} />
                <DetailRow label="Validity" value={new Date(offer.validity).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardBody>
                <DetailRow label="Terms" value={getPaymentTermLabel(offer.paymentTerms)} />
              </CardBody>
            </Card>

            {offer.remarks && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Remarks</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-[13.5px] text-ink-soft dark:text-white/50 leading-relaxed">{offer.remarks}</p>
                </CardBody>
              </Card>
            )}
          </div>
        </GridItem>

        <GridItem span={1}>
          <CompanySummaryCard company={offer.company} />
        </GridItem>
      </Grid>

      {related.length > 0 && (
        <div className="mt-8">
          <p className="text-eyebrow mb-3">Related Offers</p>
          <Grid cols={1} colsMd={3} gap="md">
            {related.map((r) => (
              <OfferCard key={r.id} offer={r} />
            ))}
          </Grid>
        </div>
      )}

      <ExpressInterestModal
        open={interestModal.isOpen}
        onClose={interestModal.close}
        listingId={offer.id}
        listingType="offer"
        listingLabel={`${getProductLabel(offer.product)} · ${offer.grade} · ${offer.company.name}`}
      />
    </>
  );
}
