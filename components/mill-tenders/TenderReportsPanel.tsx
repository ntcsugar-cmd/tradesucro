"use client";

import { useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { TenderReportType } from "@/lib/types/millTender";

const REPORTS: { type: TenderReportType; label: string; description: string }[] = [
  { type: "tender_report", label: "Tender Report", description: "All tenders by type, status, and date range." },
  { type: "bid_analysis", label: "Bid Analysis", description: "Bid volume, pricing spread, and participation by bidder." },
  { type: "award_report", label: "Award Report", description: "Awarded tenders, winners, and award terms." },
  { type: "emd_report", label: "EMD Report", description: "EMD collected, refunded, and forfeited across tenders." },
  { type: "tender_performance", label: "Tender Performance", description: "Fill rate, average bids per tender, and closing trends." },
];

export function TenderReportsPanel() {
  const [generating, setGenerating] = useState<TenderReportType | null>(null);
  const [ready, setReady] = useState<Set<TenderReportType>>(new Set());
  const { toast } = useToast();

  async function handleGenerate(type: TenderReportType) {
    setGenerating(type);
    await new Promise((resolve) => setTimeout(resolve, 700));
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
