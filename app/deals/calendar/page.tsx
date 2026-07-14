"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/navigation/Tabs";
import { Spinner } from "@/components/ui/Spinner";
import { DealCalendarView } from "@/components/deals";
import { dealService } from "@/services/deal.service";
import type { Deal } from "@/lib/types/deal";

const CALENDAR_TABS = [
  { value: "dispatch", label: "Dispatch Calendar" },
  { value: "payment", label: "Payment Calendar" },
  { value: "delivery", label: "Delivery Calendar" },
];

export default function DealCalendarPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealService.getDeals().then((result) => {
      setDeals(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader title="Deal Calendar" description="Dispatch, payment, and delivery schedules across every deal." />
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading calendar…" />
        </div>
      ) : (
        <Tabs tabs={CALENDAR_TABS} defaultValue="dispatch">
          {(active) => <DealCalendarView deals={deals} kind={active as "dispatch" | "payment" | "delivery"} />}
        </Tabs>
      )}
    </>
  );
}
