"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { TenderReportsPanel, TenderNotificationsPanel } from "@/components/mill-tenders";
import { Grid, GridItem } from "@/components/ui/Grid";

import { millTenderService } from "@/services/millTender.service";
import type { MillTender, TenderTimelineEvent } from "@/lib/types/millTender";

export default function MillTenderHistoryPage() {
  const [events, setEvents] = useState<(TenderTimelineEvent & { tenderNumber?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([millTenderService.getTimeline(), millTenderService.getTenders()]).then(([timeline, tenders]) => {
      const map = new Map<string, MillTender>(tenders.map((t) => [t.id, t]));
      setEvents(timeline.map((e) => ({ ...e, tenderNumber: map.get(e.tenderId)?.tenderNumber })));
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<TenderTimelineEvent & { tenderNumber?: string }>[] = [
    { key: "tenderNumber", header: "Tender No", render: (e) => <span className="font-mono text-xs">{e.tenderNumber}</span> },
    { key: "event", header: "Event", render: (e) => <span className="capitalize">{e.event.replace("_", " ")}</span> },
    { key: "description", header: "Description" },
    { key: "actor", header: "Actor" },
    { key: "timestamp", header: "Time", render: (e) => new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: "History" }]} className="mb-5" />
      <PageHeader title="Tender History & Audit Log" description="Every action across every tender — created, published, bid activity, closed, awarded." />

      <Grid cols={1} colsLg={3} gap="md" className="mb-6">
        <GridItem span={2}>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardBody>
              <DataTable columns={columns} data={events} getRowId={(e) => e.id} loading={loading} pageSize={15} emptyTitle="No history" emptyDescription="Tender activity will appear here." />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={1}>
          <TenderNotificationsPanel />
        </GridItem>
      </Grid>

      <p className="text-eyebrow mb-3">Reports</p>
      <TenderReportsPanel />
    </>
  );
}
