import { FileUpload } from "@/components/forms/FileUpload";
import type { DealDocuments } from "@/lib/types/deal";

interface DocumentsSectionProps {
  data: DealDocuments;
  onChange: (patch: Partial<DealDocuments>) => void;
}

const DOC_FIELDS: { key: keyof DealDocuments; label: string; mockFileName: string }[] = [
  { key: "purchaseOrder", label: "Purchase Order", mockFileName: "purchase_order.pdf" },
  { key: "saleConfirmation", label: "Sale Confirmation", mockFileName: "sale_confirmation.pdf" },
  { key: "invoice", label: "Invoice", mockFileName: "invoice.pdf" },
  { key: "taxInvoice", label: "Tax Invoice", mockFileName: "tax_invoice.pdf" },
  { key: "deliveryOrder", label: "Delivery Order", mockFileName: "delivery_order.pdf" },
  { key: "ewayBill", label: "E-way Bill", mockFileName: "eway_bill.pdf" },
  { key: "lrGr", label: "LR / GR", mockFileName: "lr_gr.pdf" },
  { key: "paymentReceipt", label: "Payment Receipt", mockFileName: "payment_receipt.pdf" },
  { key: "qualityCertificate", label: "Quality Certificate", mockFileName: "quality_certificate.pdf" },
];

export function DealDocumentsSection({ data, onChange }: DocumentsSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal">Documents</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">Placeholder uploads only — no real file storage.</p>

      <div className="mt-5 space-y-4">
        {DOC_FIELDS.map(({ key, label, mockFileName }) => (
          <FileUpload key={key} label={label} mockFileName={mockFileName} value={data[key]} onChange={(v) => onChange({ [key]: v } as Partial<DealDocuments>)} />
        ))}
      </div>
    </div>
  );
}
