"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Ban, Users, Gavel } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TenderStatusBadge, TenderTypeBadge, TenderTimelineView } from "@/components/mill-tenders";

import { millTenderService, resolveEffectiveTenderStatus } from "@/services/millTender.service";
import { getProductLabel, getPackagingLabel, getDispatchTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillTender } from "@/lib/types/millTender";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium">{value}</span>
    </div>
  );
}

export default function MillTenderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [tender, setTender] = useState<MillTender | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    millTenderService.getTenderById(params.id).then((result) => {
      setTender(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  async function handleCancel() {
    if (!tender) return;
    const updated = await millTenderService.cancelTender(tender.id);
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
        <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState icon={<Gavel size={20} />} title="Tender not found" action={{ label: "Back to Tender Board", onClick: () => router.push("/mill/tenders") }} />
      </>
    );
  }

  const effectiveStatus = resolveEffectiveTenderStatus(tender);

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: tender.tenderNumber }]} className="mb-5" />
      <PageHeader
        title={tender.title}
        description={tender.tenderNumber}
        actions={
          <>
            <Link href={`/mill/tenders/${tender.id}/bids`}>
              <Button variant="outline" size="md">
                <Users size={15} /> Bids &amp; Award
              </Button>
            </Link>
            {tender.status === "draft" && (
              <Link href={`/mill/tenders/${tender.id}/edit`}>
                <Button variant="outline" size="md">
                  <Pencil size={15} /> Edit
                </Button>
              </Link>
            )}
            {(tender.status === "draft" || tender.status === "published") && (
              <Button variant="danger" size="md" onClick={handleCancel}>
                <Ban size={15} /> Cancel Tender
              </Button>
            )}
          </>
        }
      />

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Tender Summary</CardTitle>
                <div className="flex gap-2">
                  <TenderTypeBadge type={tender.type} />
                  <TenderStatusBadge tender={tender} />
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Tender date" value={new Date(tender.tenderDate).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
                <Row label="Opening" value={new Date(tender.openingDateTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
                <Row label="Closing" value={new Date(tender.closingDateTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
                <Row label="Award date" value={tender.awardDate ? new Date(tender.awardDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"} />
                <Row label="Visibility" value={tender.bidConditions.visibility.replace("_", " ")} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                {tender.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-sm border border-line dark:border-white/10 p-3">
                    <div>
                      <p className="text-[13px] font-medium text-charcoal dark:text-white">
                        {getProductLabel(p.product)} · <span className="font-mono">{p.grade}</span>
                      </p>
                      <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
                        {formatQuantityMt(p.quantity)} · {getPackagingLabel(p.packaging)} {p.emdRequired && `· EMD ${formatINR(p.emdAmount)}`}
                      </p>
                    </div>
                    <p className="font-mono text-sm text-gold-dim">{formatINR(p.reservePrice)}</p>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Payment &amp; Dispatch Terms</CardTitle>
              </CardHeader>
              <CardBody>
                <Row label="Advance / Balance" value={`${tender.paymentTerms.advancePercent}% / ${tender.paymentTerms.balancePercent}%`} />
                <Row label="Payment due" value={tender.paymentTerms.paymentDue || "—"} />
                <Row label="Credit days" value={String(tender.paymentTerms.creditDays)} />
                <Row label="Dispatch window" value={`${new Date(tender.dispatchTerms.dispatchStart).toLocaleDateString("en-IN")} – ${new Date(tender.dispatchTerms.dispatchEnd).toLocaleDateString("en-IN")}`} />
                <Row label="Delivery terms" value={getDispatchTermLabel(tender.dispatchTerms.deliveryTerms)} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Tender Notice", doc: tender.documents.tenderNotice },
                    { label: "Terms & Conditions", doc: tender.documents.termsAndConditions },
                    { label: "Quality Certificate", doc: tender.documents.qualityCertificate },
                    { label: "Lab Report", doc: tender.documents.labReport },
                  ].map(({ label, doc }) => (
                    <Badge key={label} tone={doc.fileName ? "verified" : "charcoal"}>
                      {label}
                      {doc.fileName ? " ✓" : ""}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </GridItem>

        <GridItem span={1}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Tender Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <TenderTimelineView tenderId={tender.id} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {effectiveStatus === "closed" && (
        <div className="mt-6">
          <Link href={`/mill/tenders/${tender.id}/bids`}>
            <Button variant="primary" size="md">
              <Gavel size={15} /> Go to Award
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
