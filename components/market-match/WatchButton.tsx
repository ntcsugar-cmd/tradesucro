"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { watchlistService } from "@/services/watchlist.service";
import type { WatchTargetType } from "@/lib/types/smartMatch";

interface WatchButtonProps {
  targetType: WatchTargetType;
  targetValue: string;
  targetLabel: string;
}

export function WatchButton({ targetType, targetValue, targetLabel }: WatchButtonProps) {
  const [watched, setWatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  useEffect(() => {
    watchlistService.getWatchlist().then((items) => {
      const match = items.find((w) => w.targetType === targetType && w.targetValue === targetValue);
      setWatched(!!match);
      setItemId(match?.id ?? null);
    });
  }, [targetType, targetValue]);

  async function toggle() {
    setLoading(true);
    if (watched && itemId) {
      await watchlistService.removeFromWatchlist(itemId);
      setWatched(false);
      setItemId(null);
    } else {
      const item = await watchlistService.addToWatchlist(targetType, targetValue, targetLabel);
      setWatched(true);
      setItemId(item.id);
    }
    setLoading(false);
  }

  return (
    <Button variant={watched ? "gold" : "outline"} size="sm" loading={loading} onClick={toggle}>
      <Star size={13} className={watched ? "fill-current" : ""} /> {watched ? "Watching" : "Watch"}
    </Button>
  );
}
