"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { FileUpload } from "@/components/forms/FileUpload";
import type { MillTenderDocuments, TenderDocument } from "@/lib/types/millTender";

interface TenderDocumentsSectionProps {
  data: MillTenderDocuments;
  onChange: (patch: Partial<MillTenderDocuments>) => void;
  readOnly?: boolean;
}

const EMPTY_DOC: TenderDocument = { fileName: null, uploadedAt: null };

export function TenderDocumentsSection({ data, onChange, readOnly = false }: TenderDocumentsSectionProps) {
  function addOther() {
    onChange({ otherDocuments: [...data.otherDocuments, { ...EMPTY_DOC }] });
  }
  function updateOther(index: number, value: TenderDocument) {
    const next = [...data.otherDocuments];
    next[index] = value;
    onChange({ otherDocuments: next });
  }
  function removeOther(index: number) {
    onChange({ otherDocuments: data.otherDocuments.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Tender Documents</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft dark:text-white/50">Placeholder uploads only — no real file storage.</p>

      <div className="mt-5 space-y-4">
        <FileUpload label="Tender Notice" mockFileName="tender_notice.pdf" value={data.tenderNotice} onChange={(v) => onChange({ tenderNotice: v })} />
        <FileUpload label="Terms & Conditions" mockFileName="terms_and_conditions.pdf" value={data.termsAndConditions} onChange={(v) => onChange({ termsAndConditions: v })} />
        <FileUpload label="Quality Certificate" mockFileName="quality_certificate.pdf" value={data.qualityCertificate} onChange={(v) => onChange({ qualityCertificate: v })} />
        <FileUpload label="Lab Report" mockFileName="lab_report.pdf" value={data.labReport} onChange={(v) => onChange({ labReport: v })} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-medium text-charcoal dark:text-white">Other Documents</p>
            {!readOnly && (
              <Button variant="outline" size="sm" onClick={addOther}>
                <Plus size={14} /> Add document
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {data.otherDocuments.map((doc, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <FileUpload label={`Document ${i + 1}`} mockFileName={`other_document_${i + 1}.pdf`} value={doc} onChange={(v) => updateOther(i, v)} />
                </div>
                {!readOnly && (
                  <IconButton variant="ghost" size="sm" aria-label={`Remove document ${i + 1}`} onClick={() => removeOther(i)} className="mt-6">
                    <X size={14} />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
