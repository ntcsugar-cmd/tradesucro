"use client";

import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TransportSubNav, LoadRequestCard } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import type { LoadRequest } from "@/lib/types/transport";

export default function LoadsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<LoadRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setRequests(await transportService.getLoadRequests());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRespond(id: string, accept: boolean) {
    await transportService.respondToLoadRequest(id, accept);
    toast({ variant: "success", title: accept ? "Load request accepted" : "Load request rejected" });
    await load();
  }

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Load Requests" description="Incoming transport requests from traders, mills, and buyers — accept or reject each one." />

      {loading ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </Grid>
      ) : requests.length === 0 ? (
        <EmptyState icon={<PackageSearch size={20} />} title="No load requests" description="New transport requests will appear here." />
      ) : (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {requests.map((r) => (
            <GridItem key={r.id}>
              <LoadRequestCard request={r} onRespond={handleRespond} />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
