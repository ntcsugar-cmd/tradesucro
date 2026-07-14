"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { reportService } from "@/services/report.service";
import type { ReportDefinition } from "@/lib/types/millOperations";

interface ReportCardProps {
  report: ReportDefinition;
}

const EXPORT_FORMATS = ["PDF", "Excel", "CSV"] as const;

export function ReportCard({ report }: ReportCardProps) {
  const [generating, setGenerating] = useState(false);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const { toast } = useToast();

  async function handleGenerate() {
    setGenerating(true);
    const result = await reportService.generateReport(report.type);
    setGenerating(false);
    setRowCount(result.rowCount);
    toast({ variant: "success", title: "Report generated", description: `${result.rowCount} rows ready.` });
  }

  function handleExport(format: string) {
    toast({ variant: "info", title: "Export coming soon", description: `${format} export is a placeholder in this mock build.` });
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
            <FileText size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-charcoal">{report.label}</p>
            <p className="text-xs text-ink-faint mt-0.5">{report.description}</p>
            {rowCount != null && <p className="text-xs text-success-700 mt-1.5">{rowCount} rows ready</p>}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" loading={generating} onClick={handleGenerate}>
            Generate
          </Button>
          {EXPORT_FORMATS.map((format) => (
            <Button key={format} variant="outline" size="sm" disabled={rowCount == null} onClick={() => handleExport(format)}>
              <Download size={13} /> {format}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
