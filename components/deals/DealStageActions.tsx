"use client";

import { useState } from "react";
import { ArrowRight, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { dealStatusLabel } from "./DealStatusBadge";
import { DEAL_STATUS_SEQUENCE } from "@/lib/types/deal";
import type { Deal, DealStatus } from "@/lib/types/deal";

interface DealStageActionsProps {
  deal: Deal;
  onAdvance: (nextStatus: DealStatus) => Promise<void>;
  onCancel: () => Promise<void>;
}

/** DealStageActions — one "Advance to next stage" action following DEAL_STATUS_SEQUENCE, plus Cancel (available until the deal is Closed or already Cancelled). */
export function DealStageActions({ deal, onAdvance, onCancel }: DealStageActionsProps) {
  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const currentIndex = DEAL_STATUS_SEQUENCE.indexOf(deal.status);
  const nextStatus = currentIndex >= 0 && currentIndex < DEAL_STATUS_SEQUENCE.length - 1 ? DEAL_STATUS_SEQUENCE[currentIndex + 1] : null;
  const isTerminal = deal.status === "closed" || deal.status === "cancelled";

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
          Advance to {dealStatusLabel(nextStatus)} <ArrowRight size={15} />
        </Button>
      )}
      <Button variant="danger" size="md" loading={cancelling} onClick={handleCancel}>
        <Ban size={15} /> Cancel Deal
      </Button>
    </div>
  );
}
