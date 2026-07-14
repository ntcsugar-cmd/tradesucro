"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Ban, Tag, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { ResaleSubNav, ResaleOfferStatusBadge } from "@/components/trader-resale";

import { traderResaleService } from "@/services/traderResale.service";
import { getProductLabel, getPaymentTermLabel, getDispatchTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { ResaleOffer } from "@/lib/types/traderResale";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="text-[13.5px] text-charcoal font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function ResaleOfferDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [offer, setOffer] = useState<ResaleOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    traderResaleService.getResaleOfferById(params.id).then((result) => {
      setOffer(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  async function handleWithdraw() {
    if (!offer) return;
    const updated = await traderResaleService.withdrawResaleOffer(offer.id);
    if (updated) {
      setOffer(updated);
      toast({ variant: "info", title: "Offer withdrawn" });
    }
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
        <ResaleSubNav />
        <EmptyState icon={<Tag size={20} />} title="Offer not found" action={{ label: "Back to Resale Offers", onClick: () => router.push("/trader/resale") }} />
      </>
    );
  }

  const marginPct = offer.sellingPrice > 0 ? ((offer.sellingPrice - offer.averageCost) / offer.sellingPrice) * 100 : 0;
  const marginPositive = marginPct >= 0;

  return (
    <>
      <ResaleSubNav />
      <PageHeader
        title={offer.offerNumber}
        description={`${getProductLabel(offer.product)} · ${offer.grade} · Lot ${offer.lotNumber}`}
        actions={
          <>
            {(offer.status === "active" || offer.status === "partially_sold") && (
              <Link href={`/trader/orders?new=1&offer=${offer.id}`}>
                <Button variant="primary" size="md">
                  <ShoppingCart size={15} /> Create Order
                </Button>
              </Link>
            )}
            {(offer.status === "active" || offer.status === "draft") && (
              <Button variant="danger" size="md" onClick={handleWithdraw}>
                <Ban size={15} /> Withdraw
              </Button>
            )}
          </>
        }
      />

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Offer Details</CardTitle>
              <ResaleOfferStatusBadge status={offer.status} />
            </CardHeader>
            <CardBody>
              <Row label="Lot Number" value={offer.lotNumber} />
              <Row label="Warehouse" value={offer.warehouse} />
              <Row label="Purchase Rate" value={formatPricePerUnit(offer.purchaseRate)} />
              <Row label="Average Cost" value={formatPricePerUnit(offer.averageCost)} />
              <Row label="Selling Price" value={formatPricePerUnit(offer.sellingPrice)} />
              <Row label="Available Quantity" value={formatQuantityMt(offer.offeredQuantity)} />
              <Row label="Payment Terms" value={getPaymentTermLabel(offer.paymentTerms)} />
              <Row label="Dispatch Terms" value={getDispatchTermLabel(offer.dispatchTerms)} />
              <Row label="Valid Till" value={offer.validTill ? new Date(offer.validTill).toLocaleDateString("en-IN", { dateStyle: "medium" }) : ""} />
              {offer.remarks && <Row label="Remarks" value={offer.remarks} />}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={1}>
          <Card padding="lg" className={marginPositive ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint">Expected Margin</p>
                {marginPositive ? <TrendingUp size={14} className="text-rise" /> : <TrendingDown size={14} className="text-fall" />}
              </div>
              <p className={`font-mono text-2xl mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>{marginPct.toFixed(1)}%</p>
              <p className="text-[11px] text-ink-faint mt-1">
                {formatPricePerUnit(offer.sellingPrice - offer.averageCost)} × {formatQuantityMt(offer.offeredQuantity)}
              </p>
              <div className="mt-4 pt-4 border-t border-line">
                <p className="text-[11px] text-ink-faint">Total Expected Profit</p>
                <p className={`font-mono text-lg mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>
                  {formatINR((offer.sellingPrice - offer.averageCost) * offer.offeredQuantity)}
                </p>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
