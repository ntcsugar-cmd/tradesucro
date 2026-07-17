"use client";

import { useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { dealService } from "@/services/deal.service";
import type { DealReportType } from "@/lib/types/deal";

const REPORTS: { type: DealReportType; label: string; description: string }[] = [
  { type: "deal_summary", label: "Deal Summary", description: "All deals with status, value, and stage." },
  { type: "mill_wise", label: "Mill-wise Deals", description: "Deal volume and value grouped by mill." },
  { type: "buyer_wise", label: "Buyer-wise Deals", description: "Deal volume and value grouped by buyer." },
  { type: "trader_wise", label: "Trader-wise Deals", description: "Deals facilitated by each trading partner." },
  { type: "broker_wise", label: "Broker-wise Deals", description: "Deals brokered, with brokerage earned." },
  { type: "dispatch_report", label: "Dispatch Report", description: "All scheduled and completed dispatches." },
  { type: "payment_report", label: "Payment Report", description: "Payment status across all deals." },
  { type: "outstanding_report", label: "Outstanding Report", description: "Deals with pending payment, by amount." },
];

export function DealReportsPanel() {
  const [generating, setGenerating] = useState<DealReportType | null>(null);
  const [ready, setReady] = useState<Set<DealReportType>>(new Set());
  const { toast } = useToast();

  async function handleGenerate(type: DealReportType) {
    setGenerating(type);
    await dealService.generateReport(type);
    setGenerating(null);
    setReady((prev) => new Set(prev).add(type));
    toast({ variant: "success", title: "Report generated" });
  }

  function handleExport(format: string) {
    toast({ variant: "info", title: "Export coming soon", description: `${format} export is a placeholder in this mock build.` });
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {REPORTS.map((report) => (
        <Card key={report.type} padding="lg">
          <CardBody>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
                <FileBarChart size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-charcoal dark:text-white">{report.label}</p>
                <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{report.description}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button variant="primary" size="sm" loading={generating === report.type} onClick={() => handleGenerate(report.type)}>
                Generate
              </Button>
              {["PDF", "Excel", "CSV"].map((format) => (
                <Button key={format} variant="outline" size="sm" disabled={!ready.has(report.type)} onClick={() => handleExport(format)}>
                  <Download size={13} /> {format}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
