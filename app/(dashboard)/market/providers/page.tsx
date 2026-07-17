"use client";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Database, CheckCircle2, CircleDashed } from "lucide-react";
import { marketDataProviderRegistry } from "@/services/marketDataProviders";
import type { ProviderConnectionStatus } from "@/lib/types/marketDataProvider";

const STATUS_META: Record<ProviderConnectionStatus, { label: string; status: "success" | "neutral" | "danger" }> = {
  connected: { label: "Connected", status: "success" },
  not_configured: { label: "Not Configured", status: "neutral" },
  error: { label: "Error", status: "danger" },
};

export default function DataProviderStatusPage() {
  const providers = marketDataProviderRegistry.getAll();

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Data Provider Status" }]} className="mb-5" />
      <PageHeader
        title="Data Provider Status"
        description="Every data source Market Intelligence is architected to support, and its real connection status. TradeSucro is not tied to a single source — each provider below can be connected independently."
      />

      <div className="space-y-3">
        {providers.map((p) => (
          <Card key={p.id} padding="lg">
            <CardBody className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                  {p.connectionStatus === "connected" ? <CheckCircle2 size={16} /> : p.connectionStatus === "not_configured" ? <CircleDashed size={16} /> : <Database size={16} />}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-charcoal dark:text-white">{p.name}</p>
                  <p className="text-[12.5px] text-ink-soft dark:text-white/50 mt-0.5">{p.coverage}</p>
                  <p className="text-[11px] font-mono text-ink-faint dark:text-white/40 mt-1 uppercase tracking-widest2">{p.sourceType.replace("_", " ")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={STATUS_META[p.connectionStatus].status}>{STATUS_META[p.connectionStatus].label}</StatusBadge>
                <p className="text-xs text-ink-faint dark:text-white/40 mt-1.5">
                  {p.lastSyncedAt ? `Synced ${new Date(p.lastSyncedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : "Never synced"}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
