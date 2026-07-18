"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Database, CheckCircle2, CircleDashed, WifiOff, RefreshCw } from "lucide-react";
import { marketDataProviderRegistry } from "@/services/marketDataProviders";
import { providerHistoryStore } from "@/services/providerRuntime";
import type { ProviderConnectionStatus, ProviderStatus } from "@/lib/types/marketDataProvider";

const STATUS_META: Record<ProviderConnectionStatus, { label: string; status: "success" | "neutral" | "danger" | "warning" }> = {
  connected: { label: "Connected", status: "success" },
  not_configured: { label: "Not Configured", status: "neutral" },
  blocked_network_policy: { label: "Blocked by Network Policy", status: "warning" },
  error: { label: "Error", status: "danger" },
};

const STATUS_ICON = { connected: CheckCircle2, not_configured: CircleDashed, blocked_network_policy: WifiOff, error: Database };

export default function DataProviderStatusPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>(marketDataProviderRegistry.getAll());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await marketDataProviderRegistry.refreshAll();
    } finally {
      setProviders(marketDataProviderRegistry.getAll());
      setRefreshing(false);
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Data Provider Status" }]} className="mb-5" />
      <PageHeader
        title="Data Provider Status"
        description="Every data source Market Intelligence is architected to support, and its real, just-attempted connection status. One provider failing never stops the others from updating."
        actions={
          <Button variant="outline" size="md" loading={refreshing} onClick={handleRefresh}>
            <RefreshCw size={14} /> Refresh All
          </Button>
        }
      />

      <div className="space-y-3">
        {providers.map((p) => {
          const Icon = STATUS_ICON[p.connectionStatus];
          return (
            <Card key={p.id} padding="lg">
              <CardBody className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-charcoal dark:text-white">{p.name}</p>
                    <p className="text-[12.5px] text-ink-soft dark:text-white/50 mt-0.5">{p.coverage}</p>
                    <p className="text-[11px] font-mono text-ink-faint dark:text-white/40 mt-1 uppercase tracking-widest2">{p.sourceType.replace("_", " ")}</p>
                    {p.lastError && p.connectionStatus !== "connected" && (
                      <p className="text-[11px] text-fall mt-1.5 max-w-md truncate" title={p.lastError}>
                        {p.lastError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={STATUS_META[p.connectionStatus].status}>{STATUS_META[p.connectionStatus].label}</StatusBadge>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-1.5">
                    {p.lastSyncedAt ? `Synced ${new Date(p.lastSyncedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : "Never synced"}
                  </p>
                  {p.consecutiveFailures > 0 && (
                    <p className="text-xs text-fall mt-0.5">{p.consecutiveFailures} consecutive failure{p.consecutiveFailures === 1 ? "" : "s"}</p>
                  )}
                </div>
              </CardBody>
              {(() => {
                const health = providerHistoryStore.getHealthMetrics(p.id);
                if (health.totalAttempts === 0) return null;
                return (
                  <div className="grid grid-cols-3 gap-3 px-6 pb-5 -mt-2 text-[13px]">
                    <div>
                      <p className="text-[11px] text-ink-faint dark:text-white/40">Success Rate</p>
                      <p className="font-mono text-charcoal dark:text-white">{health.successRatePercent}%</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-ink-faint dark:text-white/40">Records Imported</p>
                      <p className="font-mono text-charcoal dark:text-white">{health.recordsImportedLatest}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-ink-faint dark:text-white/40">Data Quality</p>
                      <p className={`font-mono capitalize ${health.dataQuality === "good" ? "text-rise" : health.dataQuality === "degraded" ? "text-gold-dim" : "text-fall"}`}>
                        {health.dataQuality}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </Card>
          );
        })}
      </div>
    </>
  );
}
