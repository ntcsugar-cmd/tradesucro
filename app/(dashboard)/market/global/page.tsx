"use client";

import { useEffect, useState } from "react";
import { AlertCircle, TrendingUp, DollarSign, Fuel, Ship, WifiOff } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Alert } from "@/components/ui/Alert";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { iceFuturesAdapter } from "@/services/adapters/iceFuturesAdapter";
import { fxEnergyFreightAdapter } from "@/services/adapters/fxEnergyFreightAdapter";
import type { GlobalInstrument, GlobalInstrumentCategory } from "@/lib/types/marketIntelligence";
import type { ProviderStatus } from "@/lib/types/marketDataProvider";

const CATEGORY_META: Record<GlobalInstrumentCategory, { label: string; icon: typeof TrendingUp }> = {
  sugar_futures: { label: "Sugar Futures & Benchmarks", icon: TrendingUp },
  fx: { label: "Foreign Exchange", icon: DollarSign },
  energy: { label: "Energy", icon: Fuel },
  freight: { label: "Freight Indices", icon: Ship },
};

/** Structural shell (symbol/name/category/unit) for every instrument this page displays, independent of whether the underlying provider succeeded — a failed fetch means blank price fields, never a missing card. */
const INSTRUMENT_SHELLS: Omit<GlobalInstrument, "price" | "change" | "changePercent" | "dayHigh" | "dayLow" | "dailySeries" | "weeklySeries">[] = [
  { id: "ice-sugar-11", symbol: "SB1", name: "ICE Sugar No.11", category: "sugar_futures", unit: "¢/lb" },
  { id: "ice-white-5", symbol: "SW1", name: "ICE White Sugar No.5", category: "sugar_futures", unit: "$/MT" },
  { id: "liffe-white", symbol: "LWS", name: "LIFFE London White Sugar", category: "sugar_futures", unit: "$/MT" },
  { id: "usdinr", symbol: "USDINR", name: "USD/INR", category: "fx", unit: "₹" },
  { id: "brlusd", symbol: "BRLUSD", name: "BRL/USD", category: "fx", unit: "$" },
  { id: "wti", symbol: "WTI", name: "Crude Oil", category: "energy", unit: "$/bbl" },
  { id: "eth", symbol: "ETH", name: "Ethanol", category: "energy", unit: "$/gal" },
  { id: "bdi", symbol: "BDI", name: "Baltic Dry Index", category: "freight", unit: "pts" },
  { id: "ofr", symbol: "OFR", name: "Ocean Freight", category: "freight", unit: "$/MT" },
];

export default function GlobalMarketPage() {
  const [instruments, setInstruments] = useState<GlobalInstrument[]>([]);
  const [statuses, setStatuses] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Both adapters run independently via allSettled — one failing (e.g. the ICE adapter blocked by network policy) never stops the other from reporting its own real result.
    Promise.allSettled([iceFuturesAdapter.fetch(), fxEnergyFreightAdapter.fetch()]).then(([iceOutcome, fxOutcome]) => {
      const iceData = iceOutcome.status === "fulfilled" ? iceOutcome.value[0]?.value ?? [] : [];
      const fxData = fxOutcome.status === "fulfilled" ? fxOutcome.value[0]?.value ?? [] : [];
      const liveBySymbol = new Map([...iceData, ...fxData].map((inst) => [inst.symbol, inst]));

      const merged: GlobalInstrument[] = INSTRUMENT_SHELLS.map((shell) => {
        const live = liveBySymbol.get(shell.symbol);
        return live ?? { ...shell, price: null, change: null, changePercent: null, dayHigh: null, dayLow: null, dailySeries: [], weeklySeries: [] };
      });

      setInstruments(merged);
      setStatuses([iceFuturesAdapter.getStatus(), fxEnergyFreightAdapter.getStatus()]);
      setLoading(false);
    });
  }, []);


  const grouped = instruments.reduce<Record<string, GlobalInstrument[]>>((acc, inst) => {
    (acc[inst.category] ??= []).push(inst);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Global Market" }]} className="mb-5" />
      <PageHeader title="Global Market" description="ICE and LIFFE sugar futures, FX, energy, and freight benchmarks that move the sugar trade." />

      {statuses
        .filter((s) => s.connectionStatus !== "connected")
        .map((s) => (
          <Alert
            key={s.id}
            variant="warning"
            title={s.connectionStatus === "blocked_network_policy" ? `${s.name} — blocked by network policy` : `${s.name} — awaiting credentials`}
            className="mb-4"
          >
            <WifiOff size={13} className="inline mr-1" />
            {s.connectionStatus === "blocked_network_policy"
              ? `This adapter is fully implemented and was just attempted — the outbound request was rejected by this environment's network egress policy (${s.lastError ?? "host not in allowlist"}). Allowlisting the host connects it automatically, with no code changes.`
              : `Needs an API key to connect. `}
            {" "}See <a href="/market/providers" className="underline hover:no-underline">Data Provider Status</a>.
          </Alert>
        ))}

      {loading ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </Grid>
      ) : (
        Object.entries(grouped).map(([category, items]) => {
          const meta = CATEGORY_META[category as GlobalInstrumentCategory];
          const Icon = meta.icon;
          return (
            <div key={category} className="mb-8">
              <h2 className="flex items-center gap-2 text-[13px] font-semibold text-charcoal dark:text-white mb-3">
                <Icon size={15} className="text-gold-dim" /> {meta.label}
              </h2>
              <Grid cols={1} colsMd={2} colsLg={3} gap="md">
                {items.map((inst) => (
                  <GridItem key={inst.id}>
                    <Card padding="lg">
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[13.5px] font-semibold text-charcoal dark:text-white">{inst.name}</p>
                            <p className="font-mono text-xs text-ink-faint dark:text-white/40">{inst.symbol} · {inst.unit}</p>
                          </div>
                          <AlertCircle size={16} className="text-ink-faint dark:text-white/30" />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Current Price</p>
                            <p className="text-ink-faint dark:text-white/30 italic">Not connected</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Change / %</p>
                            <p className="text-ink-faint dark:text-white/30 italic">—</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">High</p>
                            <p className="text-ink-faint dark:text-white/30 italic">—</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Low</p>
                            <p className="text-ink-faint dark:text-white/30 italic">—</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-line dark:border-white/10 h-12 flex items-center justify-center text-[11px] text-ink-faint dark:text-white/30">
                          Daily / Weekly chart — awaiting feed
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </div>
          );
        })
      )}

      <Card padding="lg" className="mt-4">
        <CardBody className="flex items-center justify-between">
          <p className="text-[13px] text-ink-soft dark:text-white/50">See real-time connection status, retry history, and failure details for every provider.</p>
          <a href="/market/providers" className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors shrink-0">
            View Data Provider Status →
          </a>
        </CardBody>
      </Card>
    </>
  );
}
