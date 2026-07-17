"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Handshake } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { DealStatusBadge, DealTimelineView, DealStageActions } from "@/components/deals";

import { dealService } from "@/services/deal.service";
import { getProductLabel, getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Deal, DealStatus } from "@/lib/types/deal";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium text-right">{value || "—"}</span>
    </div>
  );
}

const ORIGIN_LABELS: Record<Deal["originType"], string> = {
  mill_offer: "Mill Offer",
  tender_award: "Tender Award",
  direct_negotiation: "Direct Negotiation",
  marketplace_offer: "Marketplace Offer",
};

export default function DealDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealService.getDealById(params.id).then((result) => {
      setDeal(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  async function handleAdvance(nextStatus: DealStatus) {
    if (!deal) return;
    const updated = await dealService.updateDealStatus(deal.id, nextStatus);
    if (updated) {
      setDeal(updated);
      toast({ variant: "success", title: "Deal advanced", description: `Now ${nextStatus.replace(/_/g, " ")}.` });
    }
  }

  async function handleCancel() {
    if (!deal) return;
    const updated = await dealService.updateDealStatus(deal.id, "cancelled");
    if (updated) {
      setDeal(updated);
      toast({ variant: "info", title: "Deal cancelled" });
    }
  }

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

  const charges =
    deal.commercialTerms.brokerage +
    deal.commercialTerms.commission +
    deal.commercialTerms.insurance +
    deal.commercialTerms.freight +
    deal.commercialTerms.loadingCharges;

  return (
    <>
      <PageHeader
        title={deal.dealNumber}
        description={`${deal.mill} → ${deal.buyer}`}
        actions={
          <Link href={`/deals/${deal.id}/edit`}>
            <Button variant="outline" size="md">
              <Pencil size={15} /> Edit
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <DealStageActions deal={deal} onAdvance={handleAdvance} onCancel={handleCancel} />
      </div>

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Deal Summary</CardTitle>
                <DealStatusBadge status={deal.status} />
              </CardHeader>
              <CardBody>
                <Row label="Deal date" value={new Date(deal.dealDate).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
                <Row label="Origin" value={`${ORIGIN_LABELS[deal.originType]} (${deal.originReference})`} />
                <Row label="Mill / Seller" value={`${deal.mill} / ${deal.seller}`} />
                <Row label="Buyer" value={deal.buyer} />
                {deal.trader && <Row label="Trader" value={deal.trader} />}
                {deal.broker && <Row label="Broker" value={deal.broker} />}
                <Row label="Product / Grade" value={`${getProductLabel(deal.product)} · ${deal.grade}`} />
                <Row label="Quantity" value={formatQuantityMt(deal.quantity)} />
                <Row label="Rate" value={formatINR(deal.rate)} />
                <Row label="Total Value" value={formatINR(deal.totalValue)} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Commercial Terms</CardTitle>
              </CardHeader>
              <CardBody>
                <Row label="Payment type" value={getPaymentTermLabel(deal.commercialTerms.paymentType)} />
                <Row label="Advance / Credit days" value={`${deal.commercialTerms.advancePercent}% / ${deal.commercialTerms.creditDays} days`} />
                <Row label="EMD amount" value={formatINR(deal.commercialTerms.emdAmount)} />
                <Row label="Balance payment" value={deal.commercialTerms.balancePayment} />
                <Row label="GST" value={`${deal.commercialTerms.gstPercent}%`} />
                <Row label="Brokerage + Commission + Insurance + Freight + Loading" value={formatINR(charges)} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Dispatch</CardTitle>
              </CardHeader>
              <CardBody>
                <Row label="Dispatch window" value={`${new Date(deal.dispatch.dispatchStart).toLocaleDateString("en-IN")} – ${new Date(deal.dispatch.dispatchEnd).toLocaleDateString("en-IN")}`} />
                <Row label="Daily dispatch quantity" value={formatQuantityMt(deal.dispatch.dailyDispatchQuantity)} />
                <Row label="Loading point" value={deal.dispatch.loadingPoint} />
                <Row label="Destination" value={`${deal.dispatch.destinationCity}, ${getMasterStateLabel(deal.dispatch.destinationState)}`} />
                <Row label="Transporter" value={deal.dispatch.transporter} />
                <Row label="Vehicle" value={deal.dispatch.vehicleDetails} />
                <Row label="LR Number" value={deal.dispatch.lrNumber} />
                <Row label="E-way Bill" value={deal.dispatch.ewayBill} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["Purchase Order", deal.documents.purchaseOrder],
                      ["Sale Confirmation", deal.documents.saleConfirmation],
                      ["Invoice", deal.documents.invoice],
                      ["Tax Invoice", deal.documents.taxInvoice],
                      ["Delivery Order", deal.documents.deliveryOrder],
                      ["E-way Bill", deal.documents.ewayBill],
                      ["LR / GR", deal.documents.lrGr],
                      ["Payment Receipt", deal.documents.paymentReceipt],
                      ["Quality Certificate", deal.documents.qualityCertificate],
                    ] as const
                  ).map(([label, doc]) => (
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
              <CardTitle>Deal Timeline</CardTitle>
            </CardHeader>
            <CardBody>
              <DealTimelineView dealId={deal.id} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
