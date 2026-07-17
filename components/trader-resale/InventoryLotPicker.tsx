"use client";

import { useEffect, useState } from "react";
import { Package, MapPin } from "lucide-react";
import { Card } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { traderResaleService } from "@/services/traderResale.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { InventoryLot } from "@/lib/types/traderResale";

interface InventoryLotPickerProps {
  selectedPurchaseId: string;
  onSelect: (lot: InventoryLot) => void;
}

export function InventoryLotPicker({ selectedPurchaseId, onSelect }: InventoryLotPickerProps) {
  const [loading, setLoading] = useState(true);
  const [lots, setLots] = useState<InventoryLot[]>([]);

  useEffect(() => {
    traderResaleService.getInventoryLots().then((result) => {
      setLots(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const sellable = lots.filter((l) => l.availableQuantity > 0);

  if (sellable.length === 0) {
    return (
      <EmptyState
        icon={<Package size={20} />}
        title="No sellable inventory"
        description="Every purchased lot is either fully allocated or you have no confirmed purchases yet. Buy sugar from the Trading Desk first."
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {sellable.map((lot) => {
        const selected = lot.purchaseId === selectedPurchaseId;
        return (
          <Card
            key={lot.purchaseId}
            padding="none"
            interactive
            role="button"
            tabIndex={0}
            onClick={() => onSelect(lot)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(lot)}
            className={selected ? "ring-2 ring-gold" : ""}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] text-ink-faint dark:text-white/40">{lot.lotNumber}</p>
                  <p className="text-[13.5px] font-medium text-charcoal dark:text-white mt-0.5">{getProductLabel(lot.product)} · {lot.grade}</p>
                </div>
                <p className="font-mono text-sm text-gold-dim">{formatQuantityMt(lot.availableQuantity)}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-line dark:border-white/10 grid grid-cols-2 gap-y-1.5 text-xs">
                <span className="text-ink-faint dark:text-white/40 flex items-center gap-1"><MapPin size={11} /> Warehouse</span>
                <span className="text-right text-ink-soft dark:text-white/50 truncate">{lot.warehouse}</span>
                <span className="text-ink-faint dark:text-white/40">Avg. cost</span>
                <span className="text-right font-mono text-charcoal dark:text-white">{formatINR(lot.averageCost)}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
