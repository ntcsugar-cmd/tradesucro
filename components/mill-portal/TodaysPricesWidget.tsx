"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { millPricingService } from "@/services/millPricing.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillPriceQuote } from "@/lib/types/millPricing";

export function TodaysPricesWidget() {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<MillPriceQuote[]>([]);

  useEffect(() => {
    millPricingService.getTodaysPrices().then((result) => {
      setQuotes(result.slice(0, 5));
      setLoading(false);
    });
  }, []);

  return (
    <DashboardWidget
      title="Today's Sugar Prices"
      action={
        <Link href="/price-board" className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
          View board
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {quotes.map((q) => {
            const diff = q.todaysPrice - q.yesterdayPrice;
            return (
              <li key={q.id} className="flex items-center justify-between">
                <span className="text-[13px] text-charcoal">{getProductLabel(q.product)} <span className="text-ink-faint">· {q.grade}</span></span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[13px] text-charcoal">{formatINR(q.todaysPrice)}</span>
                  <span className={`flex items-center font-mono text-[11px] ${diff > 0 ? "text-rise" : diff < 0 ? "text-fall" : "text-ink-faint"}`}>
                    {diff > 0 ? <ArrowUpRight size={12} /> : diff < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardWidget>
  );
}
