"use client";

import { useState } from "react";
import { Check, X, MapPin, Calendar } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { LoadRequestStatusBadge } from "./TransportBadges";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatPricePerUnit } from "@/lib/utils/format";
import type { LoadRequest } from "@/lib/types/transport";

interface LoadRequestCardProps {
  request: LoadRequest;
  onRespond: (id: string, accept: boolean) => Promise<void>;
}

export function LoadRequestCard({ request, onRespond }: LoadRequestCardProps) {
  const [responding, setResponding] = useState<"accept" | "reject" | null>(null);

  async function handleRespond(accept: boolean) {
    setResponding(accept ? "accept" : "reject");
    await onRespond(request.id, accept);
    setResponding(null);
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-ink-faint dark:text-white/40">{request.requestNumber}</p>
            <p className="text-[14px] font-semibold text-charcoal dark:text-white mt-0.5">{request.requestedBy}</p>
          </div>
          <LoadRequestStatusBadge status={request.status} />
        </div>

        <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-soft dark:text-white/60">
          <MapPin size={13} className="shrink-0 text-gold-dim" />
          {getMasterStateLabel(request.pickup.state)} ({request.pickup.city}) → {getMasterStateLabel(request.delivery.state)} ({request.delivery.city})
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-sm bg-charcoal/[0.03] dark:bg-white/[0.04] p-3">
          <div>
            <p className="text-[10px] text-ink-faint dark:text-white/40">Product</p>
            <p className="text-[12.5px] text-charcoal dark:text-white mt-0.5">{getProductLabel(request.product)} · {request.grade}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-faint dark:text-white/40">Quantity</p>
            <p className="font-mono text-[12.5px] text-charcoal dark:text-white mt-0.5">{formatQuantityMt(request.quantity)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-faint dark:text-white/40">Rate</p>
            <p className="font-mono text-[12.5px] text-charcoal dark:text-white mt-0.5">{formatPricePerUnit(request.proposedRate)}</p>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint dark:text-white/40">
          <Calendar size={12} /> Pickup by {new Date(request.pickupDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </p>

        {request.status === "pending" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="md" loading={responding === "reject"} onClick={() => handleRespond(false)}>
              <X size={15} /> Reject
            </Button>
            <Button variant="primary" size="md" loading={responding === "accept"} onClick={() => handleRespond(true)}>
              <Check size={15} /> Accept
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
