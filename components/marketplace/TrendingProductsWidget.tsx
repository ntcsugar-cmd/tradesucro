"use client";

import { useEffect, useState } from "react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketplaceService } from "@/services/marketplace.service";

interface TrendingProduct {
  product: string;
  label: string;
  listingCount: number;
}

export function TrendingProductsWidget() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<TrendingProduct[]>([]);

  useEffect(() => {
    marketplaceService.getTrendingProducts().then((result) => {
      setProducts(result);
      setLoading(false);
    });
  }, []);

  const maxCount = Math.max(1, ...products.map((p) => p.listingCount));

  return (
    <DashboardWidget title="Trending Products" description="Ranked by active listings">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((p, i) => (
            <li key={p.product} className="flex items-center gap-3">
              <span className="font-mono text-xs text-ink-faint w-4">{i + 1}</span>
              <span className="text-[13px] text-charcoal w-20 shrink-0">{p.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gold"
                  style={{ width: `${(p.listingCount / maxCount) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink-faint w-6 text-right">{p.listingCount}</span>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
