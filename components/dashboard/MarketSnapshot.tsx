"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { MarketPriceCard } from "@/components/cards/MarketPriceCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketService } from "@/services/market.service";
import type { MarketIndex } from "@/lib/types";

/** MarketSnapshot — reuses MarketPriceCard (same component the homepage dashboard uses) via marketService. */
export function MarketSnapshot() {
  const [loading, setLoading] = useState(true);
  const [indices, setIndices] = useState<MarketIndex[]>([]);

  useEffect(() => {
    let cancelled = false;
    marketService.getMarketIndices().then((result) => {
      if (cancelled) return;
      setIndices(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Market snapshot</CardTitle>
        </div>
        <Link href="/#dashboard" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
          Full market data <ArrowUpRight size={13} />
        </Link>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {indices.slice(0, 2).map((idx) => (
              <MarketPriceCard
                key={idx.grade}
                grade={idx.grade}
                region={idx.region}
                price={idx.price}
                unit={idx.unit}
                change={idx.change}
                direction={idx.direction}
                sparkline={idx.sparkline}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
