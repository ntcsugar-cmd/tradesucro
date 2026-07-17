"use client";

import { useEffect, useState } from "react";
import { Sparkles, Wallet, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { traderResaleService } from "@/services/traderResale.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { InventoryLot } from "@/lib/types/traderResale";

interface SmartAllocationPanelProps {
  requiredQuantity: number;
  grade?: string;
  onSelectLot?: (lot: InventoryLot) => void;
}

interface Suggestion {
  label: string;
  icon: LucideIcon;
  lot: InventoryLot | null;
}

export function SmartAllocationPanel({ requiredQuantity, grade, onSelectLot }: SmartAllocationPanelProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Awaited<ReturnType<typeof traderResaleService.suggestAllocation>> | null>(null);

  useEffect(() => {
    if (!requiredQuantity) {
      setResult(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    traderResaleService.suggestAllocation(requiredQuantity, grade).then((r) => {
      setResult(r);
      setLoading(false);
    });
  }, [requiredQuantity, grade]);

  if (!requiredQuantity) return null;

  if (loading || !result) {
    return <Skeleton className="h-40 w-full" />;
  }

  const suggestions: Suggestion[] = [
    { label: "Best Fit", icon: Sparkles, lot: result.bestLot },
    { label: "Lowest Cost", icon: Wallet, lot: result.lowestCostLot },
    { label: "Nearest Warehouse", icon: MapPin, lot: result.nearestWarehouseLot },
    { label: "Highest Margin Potential", icon: TrendingUp, lot: result.highestMarginLot },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-3">Smart Inventory Allocation</p>

      {result.insufficientStock && (
        <Alert variant="danger" className="mb-4">
          <span className="flex items-center gap-2">
            <AlertTriangle size={14} /> Insufficient stock — only {formatQuantityMt(result.totalAvailable)} available across all lots for {formatQuantityMt(requiredQuantity)} required.
          </span>
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {suggestions.map(({ label, icon: Icon, lot }) => (
          <Card
            key={label}
            padding="none"
            interactive={!!lot && !!onSelectLot}
            role={lot && onSelectLot ? "button" : undefined}
            tabIndex={lot && onSelectLot ? 0 : undefined}
            onClick={() => lot && onSelectLot?.(lot)}
          >
            <CardBody className="p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest2 text-gold-dim mb-2">
                <Icon size={12} /> {label}
              </p>
              {lot ? (
                <>
                  <p className="text-[13px] font-medium text-charcoal dark:text-white">{lot.lotNumber}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{getProductLabel(lot.product)} · {lot.grade} · {lot.warehouse}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-xs text-ink-soft dark:text-white/50">{formatQuantityMt(lot.availableQuantity)} available</span>
                    <span className="font-mono text-xs text-charcoal dark:text-white">{formatPricePerUnit(lot.averageCost)}</span>
                  </div>
                </>
              ) : (
                <p className="text-[13px] text-ink-faint dark:text-white/40 italic">No matching lot</p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
