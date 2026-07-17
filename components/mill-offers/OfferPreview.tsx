import { Badge } from "@/components/common/Badge";
import {
  getProductLabel,
  getPackagingLabel,
  getUnitLabel,
  getPaymentTermLabel,
  getDispatchTermLabel,
  getMasterStateLabel,
} from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillOfferDraft } from "@/lib/types/millOffer";

interface OfferPreviewProps {
  data: MillOfferDraft;
  offerNumber?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-ink-faint dark:text-white/40 shrink-0">{label}</span>
      <span className="text-[13px] text-charcoal dark:text-white text-right">{value || "—"}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line dark:border-white/10 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0 print:break-inside-avoid">
      <p className="text-[11px] font-mono uppercase tracking-widest2 text-gold-dim mb-2">{title}</p>
      {children}
    </div>
  );
}

/** OfferPreview — a clean, print-ready offer summary (browser print via Ctrl/Cmd+P renders this cleanly due to the print: utility classes). */
export function OfferPreview({ data, offerNumber }: OfferPreviewProps) {
  const totalQuantity = data.products.reduce((sum, p) => sum + p.availableQuantity, 0);

  return (
    <div className="print:p-8">
      <div className="flex items-start justify-between pb-4 border-b border-line dark:border-white/10">
        <div>
          <p className="font-display text-xl text-charcoal dark:text-white">{data.millName || "Sugar Mill"}</p>
          <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{data.city}, {getMasterStateLabel(data.state)} · Factory Code: {data.factoryCode || "—"}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-ink-faint dark:text-white/40">Offer No.</p>
          <p className="font-mono text-sm text-charcoal dark:text-white">{offerNumber ?? "To be assigned"}</p>
        </div>
      </div>

      <Block title="Offer Validity">
        <div className="grid grid-cols-2 gap-4">
          <Row label="Offer Date" value={data.offerDate} />
          <Row label="Valid Till" value={data.validTill} />
        </div>
      </Block>

      <Block title={`Products (${formatQuantityMt(totalQuantity)} total)`}>
        <div className="space-y-3">
          {data.products.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between rounded-sm border border-line dark:border-white/10 p-3">
              <div>
                <p className="text-[13px] font-medium text-charcoal dark:text-white">
                  {getProductLabel(p.product) || `Product ${i + 1}`} · <span className="font-mono">{p.grade}</span>
                </p>
                <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">
                  {formatQuantityMt(p.availableQuantity)} · {getPackagingLabel(p.packaging)} · {p.gstIncluded ? "GST incl." : "GST excl."}
                </p>
              </div>
              <p className="font-mono text-sm text-gold-dim">{formatINR(p.basePrice)}/{getUnitLabel(p.unit)}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Payment Terms">
        <Row label="Payment type" value={getPaymentTermLabel(data.paymentTerms.paymentType)} />
        <Row label="Advance" value={`${data.paymentTerms.advancePercent}%`} />
        <Row label="Balance payment" value={data.paymentTerms.balancePayment} />
        <Row label="Payment due date" value={data.paymentTerms.paymentDueDate} />
        <Row label="Credit days" value={String(data.paymentTerms.creditDays)} />
        <Row label="EMD required" value={data.paymentTerms.emdRequired ? "Yes" : "No"} />
        {data.paymentTerms.emdRequired && (
          <>
            <Row label="EMD amount" value={formatINR(data.paymentTerms.emdAmount)} />
            <Row label="EMD due date" value={data.paymentTerms.emdDueDate} />
          </>
        )}
      </Block>

      <Block title="Dispatch">
        <Row label="Dispatch window" value={`${data.dispatch.dispatchStartDate} – ${data.dispatch.dispatchEndDate}`} />
        <Row label="Lifting period" value={`${data.dispatch.liftingPeriodDays} days`} />
        <Row label="Minimum lifting" value={formatQuantityMt(data.dispatch.minimumLiftingQuantity)} />
        <Row label="Maximum daily lifting" value={formatQuantityMt(data.dispatch.maximumDailyLifting)} />
        <Row label="Dispatch terms" value={getDispatchTermLabel(data.dispatch.dispatchTerms)} />
      </Block>

      {(data.conditions.specialTerms || data.conditions.qualityConditions || data.conditions.penaltyClause || data.conditions.cancellationPolicy || data.conditions.remarks) && (
        <Block title="Conditions">
          <div className="space-y-2 text-[13px] text-ink-soft dark:text-white/50 leading-relaxed">
            {data.conditions.specialTerms && <p><span className="text-charcoal dark:text-white font-medium">Special terms: </span>{data.conditions.specialTerms}</p>}
            {data.conditions.qualityConditions && <p><span className="text-charcoal dark:text-white font-medium">Quality: </span>{data.conditions.qualityConditions}</p>}
            {data.conditions.penaltyClause && <p><span className="text-charcoal dark:text-white font-medium">Penalty: </span>{data.conditions.penaltyClause}</p>}
            {data.conditions.cancellationPolicy && <p><span className="text-charcoal dark:text-white font-medium">Cancellation: </span>{data.conditions.cancellationPolicy}</p>}
            {data.conditions.remarks && <p><span className="text-charcoal dark:text-white font-medium">Remarks: </span>{data.conditions.remarks}</p>}
          </div>
        </Block>
      )}

      <Block title="Attachments">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Offer Circular", doc: data.attachments.offerCircular },
            { label: "Quality Certificate", doc: data.attachments.qualityCertificate },
            { label: "Mill Letter", doc: data.attachments.millLetter },
          ].map(({ label, doc }) => (
            <Badge key={label} tone={doc.fileName ? "verified" : "charcoal"}>
              {label}{doc.fileName ? " ✓" : ""}
            </Badge>
          ))}
          {data.attachments.otherDocuments.map((doc, i) => (
            <Badge key={i} tone={doc.fileName ? "verified" : "charcoal"}>
              Other {i + 1}{doc.fileName ? " ✓" : ""}
            </Badge>
          ))}
        </div>
      </Block>
    </div>
  );
}
