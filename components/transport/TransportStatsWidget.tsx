"use client";

import { useEffect, useState } from "react";
import { Truck, UserRound, Inbox, Route, CheckCircle2, Wallet } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { SwipeableKPICards } from "@/components/mobile";
import { Skeleton } from "@/components/ui/Skeleton";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { transportService } from "@/services/transport.service";
import { freightService } from "@/services/freight.service";
import type { TransportDashboardStats } from "@/lib/types/transport";

type Stats = Omit<TransportDashboardStats, "pendingFreightInquiries"> & { pendingFreightInquiries: number };

export function TransportStatsWidget() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([transportService.getDashboardStats(), freightService.getNewInquiriesForTransporter()]).then(([base, inquiries]) => {
      setStats({ ...base, pendingFreightInquiries: inquiries.length });
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <Grid cols={2} colsMd={3} colsLg={6} gap="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </Grid>
    );
  }

  if (isMobile) {
    return (
      <SwipeableKPICards
        items={[
          { label: "Available Vehicles", value: `${stats.availableVehicles}/${stats.totalVehicles}`, icon: <Truck size={16} />, tone: "dark" },
          { label: "Available Drivers", value: `${stats.availableDrivers}/${stats.totalDrivers}`, icon: <UserRound size={16} /> },
          { label: "New Inquiries", value: stats.pendingFreightInquiries, icon: <Inbox size={16} /> },
          { label: "Active Trips", value: stats.activeDispatches, icon: <Route size={16} /> },
          { label: "Trips This Month", value: stats.completedTripsThisMonth, icon: <CheckCircle2 size={16} /> },
        ]}
      />
    );
  }

  return (
    <Grid cols={2} colsMd={3} colsLg={6} gap="md">
      <StatisticsCard label="Available Vehicles" value={`${stats.availableVehicles}/${stats.totalVehicles}`} icon={<Truck size={16} />} tone="dark" />
      <StatisticsCard label="Available Drivers" value={`${stats.availableDrivers}/${stats.totalDrivers}`} icon={<UserRound size={16} />} />
      <StatisticsCard label="New Inquiries" value={stats.pendingFreightInquiries} icon={<Inbox size={16} />} />
      <StatisticsCard label="Active Trips" value={stats.activeDispatches} icon={<Route size={16} />} />
      <StatisticsCard label="Trips This Month" value={stats.completedTripsThisMonth} icon={<CheckCircle2 size={16} />} />
      <StatisticsCard label="Earnings This Month" value={stats.earningsThisMonth} compact icon={<Wallet size={16} />} tone="dark" />
    </Grid>
  );
}
