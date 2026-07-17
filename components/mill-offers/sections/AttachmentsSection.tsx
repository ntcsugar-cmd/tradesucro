"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { FileUpload } from "@/components/forms/FileUpload";
import type { MillOfferAttachments, OfferDocument } from "@/lib/types/millOffer";

interface AttachmentsSectionProps {
  data: MillOfferAttachments;
  onChange: (patch: Partial<MillOfferAttachments>) => void;
  readOnly?: boolean;
}

const EMPTY_DOC: OfferDocument = { fileName: null, uploadedAt: null };

export function AttachmentsSection({ data, onChange, readOnly = false }: AttachmentsSectionProps) {
  function addOtherDocument() {
    onChange({ otherDocuments: [...data.otherDocuments, { ...EMPTY_DOC }] });
  }

  function updateOtherDocument(index: number, value: OfferDocument) {
    const next = [...data.otherDocuments];
    next[index] = value;
    onChange({ otherDocuments: next });
  }

  function removeOtherDocument(index: number) {
    onChange({ otherDocuments: data.otherDocuments.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Attachments</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft dark:text-white/50">Placeholder uploads only — no real file storage.</p>

      <div className="mt-5 space-y-4">
        <FileUpload
          label="Offer Circular"
          mockFileName="offer_circular.pdf"
          value={data.offerCircular}
          onChange={(v) => onChange({ offerCircular: v })}
        />
        <FileUpload
          label="Quality Certificate"
          mockFileName="quality_certificate.pdf"
          value={data.qualityCertificate}
          onChange={(v) => onChange({ qualityCertificate: v })}
        />
        <FileUpload
          label="Mill Letter"
          mockFileName="mill_letter.pdf"
          value={data.millLetter}
          onChange={(v) => onChange({ millLetter: v })}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-medium text-charcoal dark:text-white">Other Documents</p>
            {!readOnly && (
              <Button variant="outline" size="sm" onClick={addOtherDocument}>
                <Plus size={14} /> Add document
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {data.otherDocuments.map((doc, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <FileUpload
                    label={`Document ${i + 1}`}
                    mockFileName={`other_document_${i + 1}.pdf`}
                    value={doc}
                    onChange={(v) => updateOtherDocument(i, v)}
                  />
                </div>
                {!readOnly && (
                  <IconButton variant="ghost" size="sm" aria-label={`Remove document ${i + 1}`} onClick={() => removeOtherDocument(i)} className="mt-6">
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
