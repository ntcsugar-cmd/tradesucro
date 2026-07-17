"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Handshake, Share2, ClipboardX } from "lucide-react";

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
import { CompanySummaryCard, RequirementCard, ExpressInterestModal } from "@/components/marketplace";

import { useDisclosure } from "@/hooks/useDisclosure";
import { marketplaceService } from "@/services/marketplace.service";
import { getProductLabel, getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { MarketplaceRequirement } from "@/lib/types/marketplace";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium">{value}</span>
    </div>
  );
}

export default function RequirementDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const interestModal = useDisclosure(false);

  const [requirement, setRequirement] = useState<MarketplaceRequirement | null>(null);
  const [related, setRelated] = useState<MarketplaceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    marketplaceService.getRequirementById(params.id).then(async (result) => {
      if (cancelled) return;
      setRequirement(result ?? null);
      if (result) {
        const all = await marketplaceService.getRequirements({ product: result.product });
        setRelated(all.filter((r) => r.id !== result.id).slice(0, 3));
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
    toast({ variant: "success", title: "Link copied", description: "Share this requirement with your team." });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading requirement…" />
      </div>
    );
  }

  if (!requirement) {
    return (
      <>
        <Breadcrumb
          items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Requirements", href: "/marketplace/requirements" }, { label: "Not found" }]}
          className="mb-5"
        />
        <EmptyState
          icon={<ClipboardX size={20} />}
          title="Requirement not found"
          description="This requirement may have expired or been removed."
          action={{ label: "Back to requirements", onClick: () => router.push("/marketplace/requirements") }}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Marketplace", href: "/marketplace" }, { label: "Requirements", href: "/marketplace/requirements" }, { label: requirement.id }]}
        className="mb-5"
      />
      <PageHeader
        title={`${getProductLabel(requirement.product)} — ${requirement.grade}`}
        description={`Requirement from ${requirement.company.name}`}
        actions={
          <>
            <Button variant="ghost" size="md" onClick={handleShare}>
              <Share2 size={15} /> Share
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
                <CardTitle>Requirement Details</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge tone="gold">{getProductLabel(requirement.product)}</Badge>
                    <Badge tone="charcoal">{requirement.grade}</Badge>
                    <Badge tone="charcoal">{requirement.season}</Badge>
                  </div>
                  <PriceUnitToggle priceInQtl={requirement.expectedPrice} />
                </div>
                <DetailRow label="Quantity required" value={formatQuantityMt(requirement.quantity)} />
                <DetailRow label="Delivery required by" value={new Date(requirement.deliverBy).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Destination</CardTitle>
              </CardHeader>
              <CardBody>
                <DetailRow label="Deliver to" value={`${requirement.destination.city}, ${getMasterStateLabel(requirement.destination.state)}`} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardBody>
                <DetailRow label="Terms" value={getPaymentTermLabel(requirement.paymentTerms)} />
              </CardBody>
            </Card>

            {requirement.remarks && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Remarks</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-[13.5px] text-ink-soft dark:text-white/50 leading-relaxed">{requirement.remarks}</p>
                </CardBody>
              </Card>
            )}
          </div>
        </GridItem>

        <GridItem span={1}>
          <CompanySummaryCard company={requirement.company} />
        </GridItem>
      </Grid>

      {related.length > 0 && (
        <div className="mt-8">
          <p className="text-eyebrow mb-3">Related Requirements</p>
          <Grid cols={1} colsMd={3} gap="md">
            {related.map((r) => (
              <RequirementCard key={r.id} requirement={r} />
            ))}
          </Grid>
        </div>
      )}

      <ExpressInterestModal
        open={interestModal.isOpen}
        onClose={interestModal.close}
        listingId={requirement.id}
        listingType="requirement"
        listingLabel={`${getProductLabel(requirement.product)} · ${requirement.grade} · ${requirement.company.name}`}
      />
    </>
  );
}
