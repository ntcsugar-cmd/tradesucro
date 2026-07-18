"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Fuel, Ship } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { iceFuturesAdapter } from "@/services/adapters/iceFuturesAdapter";
import { fxEnergyFreightAdapter } from "@/services/adapters/fxEnergyFreightAdapter";
import type { GlobalInstrument, GlobalInstrumentCategory } from "@/lib/types/marketIntelligence";

const CATEGORY_META: Record<GlobalInstrumentCategory, { label: string; icon: typeof TrendingUp }> = {
  sugar_futures: { label: "Sugar Futures & Benchmarks", icon: TrendingUp },
  fx: { label: "Foreign Exchange", icon: DollarSign },
  energy: { label: "Energy", icon: Fuel },
  freight: { label: "Freight Indices", icon: Ship },
};

/** Structural shell (symbol/name/category/unit) for every instrument this page displays, independent of whether the live feed responded — a quiet moment means blank price fields, never a missing card. */
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([iceFuturesAdapter.fetch(), fxEnergyFreightAdapter.fetch()]).then(([iceOutcome, fxOutcome]) => {
      const iceData = iceOutcome.status === "fulfilled" ? iceOutcome.value[0]?.value ?? [] : [];
      const fxData = fxOutcome.status === "fulfilled" ? fxOutcome.value[0]?.value ?? [] : [];
      const liveBySymbol = new Map([...iceData, ...fxData].map((inst) => [inst.symbol, inst]));

      const merged: GlobalInstrument[] = INSTRUMENT_SHELLS.map((shell) => {
        const live = liveBySymbol.get(shell.symbol);
        return live ?? { ...shell, price: null, change: null, changePercent: null, dayHigh: null, dayLow: null, dailySeries: [], weeklySeries: [] };
      });

      setInstruments(merged);
      setLoading(false);
    });
  }, []);

  const grouped = instruments.reduce<Record<string, GlobalInstrument[]>>((acc, inst) => {
    (acc[inst.category] ??= []).push(inst);
    return acc;
  }, {});
  const anyPending = instruments.some((i) => i.price === null);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Global Market" }]} className="mb-5" />
      <PageHeader title="Global Market" description="ICE and LIFFE sugar futures, FX, energy, and freight benchmarks that move the sugar trade." />

      {!loading && anyPending && (
        <Card padding="lg" className="mb-6">
          <CardBody className="text-[13.5px] text-ink-soft dark:text-white/60 leading-relaxed">
            Live market feed is currently being connected. This section will automatically update once verified market data becomes available.
          </CardBody>
        </Card>
      )}

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
                        <div>
                          <p className="text-[13.5px] font-semibold text-charcoal dark:text-white">{inst.name}</p>
                          <p className="font-mono text-xs text-ink-faint dark:text-white/40">{inst.symbol} · {inst.unit}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Current Price</p>
                            <p className="text-ink-faint dark:text-white/30">{inst.price !== null ? inst.price : "—"}</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Change / %</p>
                            <p className="text-ink-faint dark:text-white/30">{inst.change !== null ? inst.change : "—"}</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">High</p>
                            <p className="text-ink-faint dark:text-white/30">{inst.dayHigh !== null ? inst.dayHigh : "—"}</p>
                          </div>
                          <div>
                            <p className="text-ink-faint dark:text-white/40 text-xs">Low</p>
                            <p className="text-ink-faint dark:text-white/30">{inst.dayLow !== null ? inst.dayLow : "—"}</p>
                          </div>
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
    </>
  );
}
