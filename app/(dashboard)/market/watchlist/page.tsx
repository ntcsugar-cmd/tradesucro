"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { AddWatchForm, WatchlistPanel, WatchlistNotificationsFeed } from "@/components/market-match";
import { watchlistService } from "@/services/watchlist.service";
import type { WatchlistItem, WatchlistNotification } from "@/lib/types/smartMatch";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [notifications, setNotifications] = useState<WatchlistNotification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [w, n] = await Promise.all([watchlistService.getWatchlist(), watchlistService.getNotifications()]);
    setItems(w);
    setNotifications(n);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRemove(id: string) {
    await watchlistService.removeFromWatchlist(id);
    await load();
  }

  async function handleRead(id: string) {
    await watchlistService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Watchlist" }]} className="mb-5" />
      <PageHeader title="Watchlist" description="Follow mills, traders, grades, states, and regions — get notified whenever something you follow changes." />

      <div className="mb-6">
        <AddWatchForm onAdded={load} />
      </div>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <WatchlistPanel items={items} onRemove={handleRemove} />
        </GridItem>
        <GridItem>
          {loading ? null : <WatchlistNotificationsFeed notifications={notifications} onRead={handleRead} />}
        </GridItem>
      </Grid>
    </>
  );
}
