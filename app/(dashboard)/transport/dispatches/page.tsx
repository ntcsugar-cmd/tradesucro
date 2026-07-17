"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TransportSubNav, DispatchTable } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import type { TransportDispatch } from "@/lib/types/transport";

export default function DispatchesPage() {
  const [dispatches, setDispatches] = useState<TransportDispatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transportService.getDispatches(true).then((result) => {
      setDispatches(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Dispatches" description="Loads currently assigned to a vehicle — in transit or awaiting departure." />

      <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${dispatches.length} active dispatches`}</p>
      <DispatchTable dispatches={dispatches} loading={loading} />
    </>
  );
}
