"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Heart, LayoutGrid } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { contactService } from "@/services/contact.service";
import type { ContactDirectoryStats } from "@/lib/types/contact";

export function ContactDirectoryStatsWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ContactDirectoryStats | null>(null);

  useEffect(() => {
    contactService.getDirectoryStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={4} gap="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={2} colsMd={4} gap="md">
      <StatisticsCard label="Total Contacts" value={stats.total} icon={<Users size={16} />} tone="dark" />
      <StatisticsCard label="Verified" value={stats.verified} icon={<ShieldCheck size={16} />} />
      <StatisticsCard label="Favorites" value={stats.favorites} icon={<Heart size={16} />} />
      <StatisticsCard label="Categories" value={stats.categoriesRepresented} icon={<LayoutGrid size={16} />} />
    </Grid>
  );
}
