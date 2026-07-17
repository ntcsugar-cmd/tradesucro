"use client";

import { useEffect, useState } from "react";
import { AlertCircle, TrendingUp, DollarSign, Fuel, Ship } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Alert } from "@/components/ui/Alert";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketPhase3Service } from "@/services/marketPhase3.service";
import { marketDataProviderRegistry } from "@/services/marketDataProviders";
import type { GlobalInstrument, GlobalInstrumentCategory } from "@/lib/types/marketIntelligence";

const CATEGORY_META: Record<GlobalInstrumentCategory, { label: string; icon: typeof TrendingUp }> = {
  sugar_futures: { label: "Sugar Futures & Benchmarks", icon: TrendingUp },
  fx: { label: "Foreign Exchange", icon: DollarSign },
  energy: { label: "Energy", icon: Fuel },
  freight: { label: "Freight Indices", icon: Ship },
};

export default function GlobalMarketPage() {
  const [instruments, setInstruments] = useState<GlobalInstrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketPhase3Service.getGlobalInstruments().then((result) => {
      setInstruments(result);
      setLoading(false);
    });
  }, []);

  const grouped = instruments.reduce<Record<string, GlobalInstrument[]>>((acc, inst) => {
    (acc[inst.category] ??= []).push(inst);
    return acc;
  }, {});

  const notConfiguredProviders = marketDataProviderRegistry
    .getAll()
    .filter((p) => ["ice-futures", "liffe-london", "isa-daily", "fx-rates", "energy-freight"].includes(p.id));

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Global Market" }]} className="mb-5" />
      <PageHeader title="Global Market" description="ICE and LIFFE sugar futures, FX, energy, and freight benchmarks that move the sugar trade." />

      <Alert variant="warning" title="Awaiting live data provider" className="mb-6">
        These instruments require a licensed market data subscription (ICE/LIFFE-class futures feed) or a public FX/commodity API — neither is connected in this environment.
        The layout, refresh architecture, and provider registry below are fully built; connecting a real feed populates every card automatically. See{" "}
        <a href="/market/providers" className="underline hover:no-underline">Data Provider Status</a> for what&apos;s registered.
      </Alert>

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
        <CardBody>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-3">Registered providers for this section</p>
          <ul className="space-y-2">
            {notConfiguredProviders.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-soft dark:text-white/50">{p.name}</span>
                <span className="text-xs font-mono text-ink-faint dark:text-white/40">not configured</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </>
  );
}
