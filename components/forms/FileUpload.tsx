"use client";

import { useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

interface FileUploadProps {
  label: string;
  helperText?: string;
  /** Simulated file name shown once "uploaded" — pass a realistic default for the document type. */
  mockFileName: string;
  value: { fileName: string | null; uploadedAt: string | null };
  onChange: (value: { fileName: string | null; uploadedAt: string | null }) => void;
  className?: string;
}

/**
 * FileUpload — placeholder-only uploader (no backend, no real file system
 * access). "Choose file" simulates picking `mockFileName` after a short
 * delay, matching what a real upload's loading state would feel like.
 */
export function FileUpload({ label, helperText, mockFileName, value, onChange, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const hasFile = !!value.fileName;

  function handleChoose() {
    setUploading(true);
    window.setTimeout(() => {
      onChange({ fileName: mockFileName, uploadedAt: new Date().toISOString() });
      setUploading(false);
    }, 700);
  }

  function handleRemove() {
    onChange({ fileName: null, uploadedAt: null });
  }

  return (
    <div className={className}>
      <p className="block text-[13px] font-medium text-charcoal mb-1.5">{label}</p>
      <div
        className={clsx(
          "flex items-center justify-between gap-4 rounded-sm border border-dashed p-4",
          hasFile ? "border-success/40 bg-success/[0.04]" : "border-line bg-paper"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm",
              hasFile ? "bg-success/10 text-success-700" : "bg-charcoal/5 text-ink-faint"
            )}
          >
            {hasFile ? <FileCheck2 size={18} /> : <UploadCloud size={18} />}
          </span>
          <div className="min-w-0">
            {hasFile ? (
              <>
                <p className="text-[13px] font-medium text-charcoal truncate">{value.fileName}</p>
                <p className="text-xs text-ink-faint">Uploaded</p>
              </>
            ) : (
              <>
                <p className="text-[13px] text-ink-soft">PDF, JPG, or PNG — up to 5MB</p>
                {helperText && <p className="text-xs text-ink-faint mt-0.5">{helperText}</p>}
              </>
            )}
          </div>
        </div>

        {hasFile ? (
          <IconButton variant="ghost" size="sm" aria-label={`Remove ${value.fileName}`} onClick={handleRemove}>
            <X size={15} />
          </IconButton>
        ) : (
          <Button variant="outline" size="sm" loading={uploading} onClick={handleChoose}>
            Choose file
          </Button>
        )}
      </div>
    </div>
  );
}
