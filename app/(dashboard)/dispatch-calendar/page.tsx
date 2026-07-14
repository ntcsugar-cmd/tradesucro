"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { DispatchCalendarView } from "@/components/dispatch";
import { dispatchService } from "@/services/dispatch.service";
import type { DispatchEntry } from "@/lib/types/millOperations";

export default function DispatchCalendarPage() {
  const [entries, setEntries] = useState<DispatchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatchService.getDispatches().then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Dispatch Calendar" }]} className="mb-5" />
      <PageHeader title="Dispatch Calendar" description="Vehicle, transporter, quantity, and buyer for every dispatch." />
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading dispatch calendar…" />
        </div>
      ) : (
        <DispatchCalendarView entries={entries} />
      )}
    </>
  );
}
