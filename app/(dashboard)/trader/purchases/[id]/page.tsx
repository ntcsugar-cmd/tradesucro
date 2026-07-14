"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Ban, ExternalLink, ShoppingBag, ArrowDownRight, ArrowUpRight, Package } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TraderSubNav, PurchaseStatusBadge } from "@/components/trader";

import { traderPurchaseService } from "@/services/traderPurchase.service";
import { dealService } from "@/services/deal.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Purchase } from "@/lib/types/traderWorkspace";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="text-[13.5px] text-charcoal font-medium text-right">{value || "—"}</span>
    </div>
  );
}

const SOURCE_LABELS: Record<Purchase["source"], string> = {
  mill_offer: "Mill Offer",
  tender_award: "Tender Award",
  direct_purchase: "Direct Purchase",
  marketplace_offer: "Marketplace Offer",
};

export default function PurchaseDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [dealNumber, setDealNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  async function load() {
    const result = await traderPurchaseService.getPurchaseById(params.id);
    setPurchase(result ?? null);
    if (result?.dealReference) {
      const deal = await dealService.getDealById(result.dealReference);
      setDealNumber(deal?.dealNumber ?? null);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleConfirm() {
    if (!purchase) return;
    setConfirming(true);
    const updated = await traderPurchaseService.confirmAndCreateDeal(purchase.id);
    setConfirming(false);
    if (updated) {
      setPurchase(updated);
      if (updated.dealReference) {
        const deal = await dealService.getDealById(updated.dealReference);
        setDealNumber(deal?.dealNumber ?? null);
        toast({ variant: "success", title: "Deal created", description: deal?.dealNumber });
      }
    }
  }

  async function handleCancel() {
    if (!purchase) return;
    const updated = await traderPurchaseService.cancelPurchase(purchase.id);
    if (updated) {
      setPurchase(updated);
      toast({ variant: "info", title: "Purchase cancelled" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading purchase…" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <>
        <TraderSubNav />
        <EmptyState icon={<ShoppingBag size={20} />} title="Purchase not found" action={{ label: "Back to Purchases", onClick: () => router.push("/trader/purchases") }} />
      </>
    );
  }

  const marginPositive = purchase.expectedMargin >= 0;

  return (
    <>
      <TraderSubNav />
      <PageHeader
        title={purchase.purchaseNumber}
        description={`${purchase.supplier} · ${purchase.mill}`}
        actions={
          <>
            {purchase.status === "draft" && (
              <Button variant="primary" size="md" loading={confirming} onClick={handleConfirm}>
                Confirm &amp; Create Deal
              </Button>
            )}
            {purchase.status !== "cancelled" && purchase.status !== "deal_created" && (
              <Button variant="danger" size="md" onClick={handleCancel}>
                <Ban size={15} /> Cancel
              </Button>
            )}
          </>
        }
      />

      {/* Hero summary strip */}
      <Card padding="lg" className="mb-6">
        <CardBody className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-charcoal/[0.04] text-ink-faint">
              <Package size={20} />
            </span>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Status</p>
              <div className="mt-1">
                <PurchaseStatusBadge status={purchase.status} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Quantity</p>
            <p className="font-mono text-lg text-charcoal mt-1">{formatQuantityMt(purchase.quantity)}</p>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Total Cost</p>
            <p className="font-mono text-lg text-charcoal mt-1">{formatINR(purchase.totalCost)}</p>
          </div>

          <div className="ml-auto">
            <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">Expected Margin</p>
            <p className={`flex items-center gap-1 font-mono text-lg mt-1 ${marginPositive ? "text-rise" : "text-fall"}`}>
              {marginPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {formatINR(purchase.expectedMargin)}
            </p>
          </div>
        </CardBody>
      </Card>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardBody>
              <Row label="Purchase date" value={new Date(purchase.purchaseDate).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
              <Row label="Source" value={SOURCE_LABELS[purchase.source]} />
              <Row label="Supplier" value={purchase.supplier} />
              <Row label="Mill" value={purchase.mill} />
              {purchase.broker && <Row label="Broker" value={purchase.broker} />}
              <Row label="Product / Grade" value={`${getProductLabel(purchase.product)} · ${purchase.grade}`} />
              <Row label="Rate" value={formatINR(purchase.rate)} />
              {purchase.dealReference && (
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-ink-faint">Deal Reference</span>
                  <Link href={`/deals/${purchase.dealReference}`} className="text-[13.5px] font-mono text-gold-dim hover:text-gold-bright flex items-center gap-1">
                    {dealNumber ?? purchase.dealReference} <ExternalLink size={12} />
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Cost &amp; Margin</CardTitle>
            </CardHeader>
            <CardBody>
              <Row label="Taxes" value={formatINR(purchase.taxes)} />
              <Row label="Freight" value={formatINR(purchase.freight)} />
              <Row label="Insurance" value={formatINR(purchase.insurance)} />
              <Row label="Brokerage" value={formatINR(purchase.brokerage)} />
              <Row label="Total Cost" value={formatINR(purchase.totalCost)} />
              <Row label="Expected Selling Price" value={formatINR(purchase.expectedSellingPrice)} />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs text-ink-faint">Expected Margin</span>
                <span className={`font-mono text-sm font-semibold ${marginPositive ? "text-rise" : "text-fall"}`}>{formatINR(purchase.expectedMargin)}</span>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
