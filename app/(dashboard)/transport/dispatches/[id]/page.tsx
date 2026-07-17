"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, UserRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TransportDispatchStatusBadge } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatINR } from "@/lib/utils/format";
import type { TransportDispatch, Vehicle, Driver } from "@/lib/types/transport";

const NEXT_STATUS: Record<string, { next: "in-transit" | "delivered"; label: string; note: string } | null> = {
  assigned: { next: "in-transit", label: "Mark as In Transit", note: "Vehicle departed from pickup location." },
  "in-transit": { next: "delivered", label: "Mark as Delivered", note: "Delivered and confirmed by consignee." },
  delayed: { next: "in-transit", label: "Resume — Mark as In Transit", note: "Delay resolved, vehicle moving again." },
  delivered: null,
};

export default function DispatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [dispatch, setDispatch] = useState<TransportDispatch | null | undefined>(undefined);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [updating, setUpdating] = useState(false);

  async function load() {
    const id = params.id as string;
    const found = await transportService.getDispatchById(id);
    setDispatch(found ?? null);
    if (found) {
      const [vehicles, drivers] = await Promise.all([transportService.getVehicles(), transportService.getDrivers()]);
      setVehicle(vehicles.find((v) => v.id === found.vehicleId) ?? null);
      setDriver(drivers.find((d) => d.id === found.driverId) ?? null);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleAdvanceStatus() {
    if (!dispatch) return;
    const transition = NEXT_STATUS[dispatch.status];
    if (!transition) return;
    setUpdating(true);
    try {
      await transportService.updateDispatchStatus(dispatch.id, transition.next, transition.note);
      toast({ variant: "success", title: `Dispatch marked ${transition.next === "delivered" ? "delivered" : "in transit"}` });
      await load();
    } finally {
      setUpdating(false);
    }
  }

  async function handleMarkDelayed() {
    if (!dispatch) return;
    setUpdating(true);
    try {
      await transportService.updateDispatchStatus(dispatch.id, "delayed", "Marked delayed by transporter.");
      toast({ variant: "warning", title: "Dispatch marked delayed" });
      await load();
    } finally {
      setUpdating(false);
    }
  }

  if (dispatch === undefined) {
    return (
      <>
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }

  if (dispatch === null) {
    return <EmptyState title="Dispatch not found" description="This dispatch may have been removed or the link is incorrect." />;
  }

  const transition = NEXT_STATUS[dispatch.status];

  return (
    <>
      <button
        onClick={() => router.push("/transport/dispatches")}
        className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-ink-soft dark:text-white/50 hover:text-charcoal dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dispatches
      </button>

      <PageHeader
        title={dispatch.dispatchNumber}
        description={`${getProductLabel(dispatch.product)} · ${dispatch.grade} · ${formatQuantityMt(dispatch.quantity)}`}
        actions={<TransportDispatchStatusBadge status={dispatch.status} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Route</CardTitle>
            </CardHeader>
            <CardBody className="flex items-center justify-between text-[14px]">
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Pickup</p>
                <p className="font-medium text-charcoal dark:text-white">{dispatch.pickup.city}, {getMasterStateLabel(dispatch.pickup.state)}</p>
              </div>
              <div className="text-ink-faint dark:text-white/40">→</div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Delivery</p>
                <p className="font-medium text-charcoal dark:text-white">{dispatch.delivery.city}, {getMasterStateLabel(dispatch.delivery.state)}</p>
              </div>
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4">
                {dispatch.statusHistory.map((event, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                      <CheckCircle2 size={14} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-charcoal dark:text-white capitalize">{event.status.replace("-", " ")}</p>
                      <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
                        {new Date(event.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      {event.note && <p className="text-xs text-ink-soft dark:text-white/50 mt-1">{event.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Assigned Fleet</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-gold-dim shrink-0" />
                <span className="text-[13.5px] text-charcoal dark:text-white">{vehicle ? vehicle.registrationNumber : "Not assigned"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <UserRound size={16} className="text-gold-dim shrink-0" />
                <span className="text-[13.5px] text-charcoal dark:text-white">{driver ? driver.name : "Not assigned"}</span>
              </div>
              <div className="pt-3 border-t border-line dark:border-white/10 text-[13px] text-ink-soft dark:text-white/50">
                Rate: <span className="font-mono text-charcoal dark:text-white">{formatINR(dispatch.rate)}</span>
              </div>
            </CardBody>
          </Card>

          {dispatch.status !== "delivered" && (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardBody className="space-y-2.5">
                {transition && (
                  <Button variant="primary" size="md" fullWidth loading={updating} onClick={handleAdvanceStatus}>
                    {transition.label}
                  </Button>
                )}
                {dispatch.status !== "delayed" && (
                  <Button variant="outline" size="md" fullWidth loading={updating} onClick={handleMarkDelayed}>
                    <AlertTriangle size={14} /> Mark as Delayed
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
