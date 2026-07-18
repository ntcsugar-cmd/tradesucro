"use client";

import { useEffect, useState } from "react";
import { Radio, AlertTriangle } from "lucide-react";
import { millLiveOffersAdapter } from "@/services/adapters/millLiveOffersAdapter";

export function MillOffersLiveIndicator() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    millLiveOffersAdapter.fetch().then(([result]) => {
      setConnected(result.value !== null);
      setLastUpdated(result.meta.lastUpdated);
    });
  }, []);

  if (connected === null) return null;

  return (
    <div className="flex items-center gap-1.5 mb-4 text-xs text-ink-faint dark:text-white/40">
      {connected ? (
        <>
          <Radio size={12} className="text-rise" />
          Live · TradeSucro Mill Offer Board{lastUpdated && ` · Updated ${new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
        </>
      ) : (
        <>
          <AlertTriangle size={12} className="text-fall" />
          Live feed temporarily unavailable — showing last known offers
        </>
      )}
    </div>
  );
}
