import { Badge } from "@/components/common/Badge";
import { TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { TENDER_TYPE_OPTIONS } from "../TenderTypeBadge";
import type { MillTenderStatus, TenderType } from "@/lib/types/millTender";

interface TenderInfoSectionProps {
  tenderNumber?: string;
  status: MillTenderStatus;
  title: string;
  type: TenderType;
  tenderDate: string;
  openingDateTime: string;
  closingDateTime: string;
  awardDate: string;
  onChange: (patch: Partial<{ title: string; type: TenderType; tenderDate: string; openingDateTime: string; closingDateTime: string; awardDate: string }>) => void;
  errors?: Partial<Record<"title" | "closingDateTime", string>>;
  readOnly?: boolean;
}

export function TenderInfoSection({
  tenderNumber,
  status,
  title,
  type,
  tenderDate,
  openingDateTime,
  closingDateTime,
  awardDate,
  onChange,
  errors = {},
  readOnly = false,
}: TenderInfoSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Tender Information</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Tender Number</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] font-mono text-sm text-ink-soft dark:text-white/50">
            {tenderNumber ?? "Assigned automatically on save"}
          </p>
        </div>
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Status</p>
          <div className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02]">
            <Badge tone={status === "published" ? "verified" : status === "cancelled" || status === "expired" ? "urgent" : "charcoal"}>
              {status}
            </Badge>
          </div>
        </div>

        <TextInput label="Tender Title" value={title} disabled={readOnly} onChange={(e) => onChange({ title: e.target.value })} error={errors.title} className="sm:col-span-2" />

        <Select
          label="Tender Type"
          defaultValue={type}
          disabled={readOnly}
          options={TENDER_TYPE_OPTIONS}
          onChange={(e) => onChange({ type: e.target.value as TenderType })}
        />
        <TextInput label="Tender Date" type="date" value={tenderDate} disabled={readOnly} onChange={(e) => onChange({ tenderDate: e.target.value })} />

        <TextInput label="Opening Date & Time" type="datetime-local" value={openingDateTime.slice(0, 16)} disabled={readOnly} onChange={(e) => onChange({ openingDateTime: e.target.value })} />
        <TextInput
          label="Closing Date & Time"
          type="datetime-local"
          value={closingDateTime.slice(0, 16)}
          disabled={readOnly}
          onChange={(e) => onChange({ closingDateTime: e.target.value })}
          error={errors.closingDateTime}
        />

        <TextInput label="Award Date" type="date" value={awardDate} disabled={readOnly} onChange={(e) => onChange({ awardDate: e.target.value })} />
      </div>
    </div>
  );
}
