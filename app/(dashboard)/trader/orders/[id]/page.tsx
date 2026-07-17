"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { ResaleSubNav, OrderStatusBadge, OrderStatusActions } from "@/components/trader-resale";
import { MobileOrderTimeline } from "@/components/mobile";
import { useIsMobile } from "@/hooks/useMediaQuery";

import { traderResaleService } from "@/services/traderResale.service";
import { getProductLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { CustomerOrder, OrderStatus } from "@/lib/types/traderResale";

/** Maps the 7-stage OrderStatus lifecycle onto the mobile timeline's 6 spec'd stages (Ordered/Confirmed/Payment/Dispatch/Transit/Delivered). */
function timelineStageIndex(status: OrderStatus): number {
  const map: Record<OrderStatus, number> = {
    draft: 0,
    confirmed: 1,
    reserved: 2,
    ready_for_dispatch: 3,
    dispatched: 4,
    delivered: 5,
    completed: 5,
    cancelled: 0,
  };
  return map[status];
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function CustomerOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    traderResaleService.getOrderById(params.id).then((result) => {
      setOrder(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  async function handleAdvance(next: OrderStatus) {
    if (!order) return;
    const result = await traderResaleService.updateOrderStatus(order.id, next);
    if (!result.success) {
      toast({ variant: "danger", title: "Could not advance order", description: result.message });
      return;
    }
    setOrder(result.data!);
    toast({ variant: "success", title: "Order updated", description: `Now ${next.replace(/_/g, " ")}.` });
  }

  async function handleCancel() {
    if (!order) return;
    const result = await traderResaleService.updateOrderStatus(order.id, "cancelled");
    if (result.success) {
      setOrder(result.data!);
      toast({ variant: "info", title: "Order cancelled", description: "Reserved inventory has been released." });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading order…" />
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <ResaleSubNav />
        <EmptyState icon={<ClipboardList size={20} />} title="Order not found" action={{ label: "Back to Orders", onClick: () => router.push("/trader/orders") }} />
      </>
    );
  }

  return (
    <>
      <ResaleSubNav />
      <PageHeader title={order.orderNumber} description={`${order.customerName} · ${getProductLabel(order.product)} · ${order.grade}`} />

      <div className="mb-6">
        <OrderStatusActions order={order} onAdvance={handleAdvance} onCancel={handleCancel} />
      </div>

      {isMobile && (
        <Card padding="lg" className="mb-6">
          <CardBody>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-4">Order Timeline</p>
            <MobileOrderTimeline currentStageIndex={timelineStageIndex(order.status)} cancelled={order.status === "cancelled"} />
          </CardBody>
        </Card>
      )}

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <OrderStatusBadge status={order.status} />
            </CardHeader>
            <CardBody>
              <Row label="Customer" value={order.customerName} />
              <Row label="Inventory Lot" value={order.lotNumber} />
              <Row label="Quantity" value={formatQuantityMt(order.quantity)} />
              <Row label="Selling Price" value={formatINR(order.sellingPrice)} />
              <Row label="Taxes" value={formatINR(order.taxes)} />
              <Row label="Freight" value={formatINR(order.freight)} />
              <Row label="Brokerage" value={formatINR(order.brokerage)} />
              <Row label="Discount" value={formatINR(order.discount)} />
              <Row label="Delivery Date" value={new Date(order.deliveryDate).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
              <Row label="Payment Terms" value={getPaymentTermLabel(order.paymentTerms)} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={1}>
          <Card padding="lg" className={order.grossMargin >= 0 ? "ring-1 ring-rise/20" : "ring-1 ring-fall/20"}>
            <CardBody>
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-3">Financials</p>
              <Row label="Cost of Goods" value={formatINR(order.costOfGoods)} />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[13px] font-medium text-charcoal dark:text-white">Total Value</span>
                <span className="font-mono text-[15px] font-semibold text-charcoal dark:text-white">{formatINR(order.totalValue)}</span>
              </div>
              <div className={`mt-3 rounded-sm border p-3.5 ${order.grossMargin >= 0 ? "border-rise/30 bg-rise/[0.05]" : "border-fall/30 bg-fall/[0.05]"}`}>
                <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">Gross Margin</p>
                <p className={`font-mono text-xl mt-1 ${order.grossMargin >= 0 ? "text-rise" : "text-fall"}`}>{formatINR(order.grossMargin)}</p>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
