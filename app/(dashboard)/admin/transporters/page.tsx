"use client";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Star, ShieldCheck, Truck } from "lucide-react";
import { freightService } from "@/services/freight.service";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";

const VEHICLE_LABEL: Record<string, string> = { "open-truck": "Open Truck", "covered-truck": "Covered Truck", trailer: "Trailer", container: "Container" };

export default function TransporterDirectoryPage() {
  const transporters = freightService.getTransporterDirectory();

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "Transporter Directory" }]} className="mb-5" />
      <PageHeader title="Transporter Directory" description="Every transporter company TradeSucro coordinates freight through — coverage, fleet types, and verification status." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {transporters.map((t) => (
          <Card key={t.id} padding="lg">
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                  <Truck size={17} />
                </span>
                {t.verified ? <StatusBadge status="success">Verified</StatusBadge> : <StatusBadge status="neutral">Unverified</StatusBadge>}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[14px] font-semibold text-charcoal dark:text-white">
                {t.companyName}
                {t.verified && <ShieldCheck size={13} className="text-success" />}
              </p>
              <p className="flex items-center gap-1 text-xs text-ink-faint dark:text-white/40 mt-0.5">
                <Star size={11} className="fill-gold-dim text-gold-dim" /> {t.rating.toFixed(1)} rating
              </p>

              <div className="mt-4 pt-4 border-t border-line dark:border-white/10">
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1.5">Coverage</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.coverageStates.map((s) => (
                    <Badge key={s} tone="charcoal">{getMasterStateLabel(s)}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1.5">Fleet Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.vehicleTypes.map((v) => (
                    <Badge key={v} tone="gold">{VEHICLE_LABEL[v]}</Badge>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
