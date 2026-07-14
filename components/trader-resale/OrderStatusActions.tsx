"use client";

import { useState } from "react";
import { ArrowRight, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { orderStatusLabel, ORDER_STATUS_SEQUENCE } from "./ResaleBadges";
import type { CustomerOrder, OrderStatus } from "@/lib/types/traderResale";

interface OrderStatusActionsProps {
  order: CustomerOrder;
  onAdvance: (next: OrderStatus) => Promise<void>;
  onCancel: () => Promise<void>;
}

/** Business Rules live in the service (reserve on confirm, release on cancel, reduce on dispatch/complete) — this component only triggers the transition. */
export function OrderStatusActions({ order, onAdvance, onCancel }: OrderStatusActionsProps) {
  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(order.status);
  const nextStatus = currentIndex >= 0 && currentIndex < ORDER_STATUS_SEQUENCE.length - 1 ? ORDER_STATUS_SEQUENCE[currentIndex + 1] : null;
  const isTerminal = order.status === "completed" || order.status === "cancelled";

  async function handleAdvance() {
    if (!nextStatus) return;
    setAdvancing(true);
    await onAdvance(nextStatus);
    setAdvancing(false);
  }

  async function handleCancel() {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
  }

  if (isTerminal) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {nextStatus && (
        <Button variant="primary" size="md" loading={advancing} onClick={handleAdvance}>
          Advance to {orderStatusLabel(nextStatus)} <ArrowRight size={15} />
        </Button>
      )}
      <Button variant="danger" size="md" loading={cancelling} onClick={handleCancel}>
        <Ban size={15} /> Cancel Order
      </Button>
    </div>
  );
}
