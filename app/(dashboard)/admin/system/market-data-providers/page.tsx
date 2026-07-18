"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Database, CheckCircle2, CircleDashed, WifiOff, RefreshCw, KeyRound } from "lucide-react";
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

/** Never shows an actual key value, even here — only whether one is configured. Plaintext secrets don't belong in any UI, admin or not. */
function apiConfigLabel(status: ProviderStatus): string {
  if (status.sourceType === "tradesucro_internal") return "No external credentials required";
  if (status.connectionStatus === "not_configured") return "API key missing";
  return "API key configured";
}

export default function AdminMarketDataProvidersPage() {
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
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "System" }, { label: "Market Data Providers" }]} className="mb-5" />
      <PageHeader
        title="Market Data Providers"
        description="Provider diagnostics, connection health, and sync history for every Market Intelligence data source. Internal use only — this detail is never shown to traders."
        actions={
          <Button variant="outline" size="md" loading={refreshing} onClick={handleRefresh}>
            <RefreshCw size={14} /> Refresh All
          </Button>
        }
      />

      <div className="space-y-4">
        {providers.map((p) => {
          const Icon = STATUS_ICON[p.connectionStatus];
          const health = providerHistoryStore.getHealthMetrics(p.id);
          const recentAttempts = providerHistoryStore.getForProvider(p.id).slice(0, 5);

          return (
            <Card key={p.id} padding="lg">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                    <Icon size={16} />
                  </span>
                  <div>
                    <CardTitle>{p.name}</CardTitle>
                    <p className="text-[12.5px] text-ink-soft dark:text-white/50 mt-0.5">{p.coverage}</p>
                    <p className="text-[11px] font-mono text-ink-faint dark:text-white/40 mt-1 uppercase tracking-widest2">{p.sourceType.replace("_", " ")}</p>
                  </div>
                </div>
                <StatusBadge status={STATUS_META[p.connectionStatus].status}>{STATUS_META[p.connectionStatus].label}</StatusBadge>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px] pb-4 border-b border-line dark:border-white/10">
                  <div>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">Last Sync</p>
                    <p className="text-charcoal dark:text-white">
                      {p.lastSyncedAt ? new Date(p.lastSyncedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">Success Rate</p>
                    <p className="font-mono text-charcoal dark:text-white">{health.totalAttempts > 0 ? `${health.successRatePercent}%` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">Records Imported</p>
                    <p className="font-mono text-charcoal dark:text-white">{health.recordsImportedLatest}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint dark:text-white/40">Health Status</p>
                    <p className={`font-mono capitalize ${health.dataQuality === "good" ? "text-rise" : health.dataQuality === "degraded" ? "text-gold-dim" : "text-fall"}`}>
                      {health.dataQuality}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[13px] py-4 border-b border-line dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <KeyRound size={13} className="text-ink-faint dark:text-white/40 shrink-0" />
                    <span className="text-ink-soft dark:text-white/50">{apiConfigLabel(p)}</span>
                  </div>
                  <div>
                    {p.consecutiveFailures > 0 ? (
                      <span className="text-fall">{p.consecutiveFailures} consecutive failure{p.consecutiveFailures === 1 ? "" : "s"} — retrying automatically</span>
                    ) : (
                      <span className="text-ink-soft dark:text-white/50">Retry status: nominal</span>
                    )}
                  </div>
                </div>

                {recentAttempts.length > 0 && (
                  <div className="pt-4">
                    <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-2">Recent Sync Log</p>
                    <ul className="space-y-1.5">
                      {recentAttempts.map((entry, i) => (
                        <li key={i} className="flex items-center justify-between text-[12.5px]">
                          <span className="text-ink-soft dark:text-white/50">{new Date(entry.attemptedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                          <span className={entry.succeeded ? "text-rise" : "text-fall"}>
                            {entry.succeeded ? `Success · ${entry.recordCount} records` : `Failed${entry.retryCount > 0 ? ` after ${entry.retryCount} retries` : ""} · ${entry.errorMessage ?? "Unknown error"}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
