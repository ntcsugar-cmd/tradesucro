import { FileCheck2, FileX2 } from "lucide-react";
import clsx from "clsx";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface DocumentsSectionProps {
  profile: CompanyProfile;
}

export function DocumentsSection({ profile }: DocumentsSectionProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid sm:grid-cols-3 gap-4">
          {profile.documents.map((doc) => {
            const uploaded = !!doc.fileName;
            return (
              <div
                key={doc.id}
                className={clsx(
                  "rounded-sm border p-4",
                  uploaded ? "border-success/30 bg-success/[0.03]" : "border-dashed border-line"
                )}
              >
                <span
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-sm",
                    uploaded ? "bg-success/10 text-success-700" : "bg-charcoal/5 text-ink-faint"
                  )}
                >
                  {uploaded ? <FileCheck2 size={18} /> : <FileX2 size={18} />}
                </span>
                <p className="mt-3 text-[13px] font-medium text-charcoal">{doc.label}</p>
                <p className="mt-0.5 text-xs text-ink-faint truncate">
                  {uploaded ? doc.fileName : "Not uploaded"}
                </p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
