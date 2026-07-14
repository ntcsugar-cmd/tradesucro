import { NumberInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { PaymentTermSelect } from "@/components/master-data";
import type { DealCommercialTerms } from "@/lib/types/deal";

interface CommercialTermsSectionProps {
  data: DealCommercialTerms;
  onChange: (patch: Partial<DealCommercialTerms>) => void;
  readOnly?: boolean;
}

export function CommercialTermsSection({ data, onChange, readOnly = false }: CommercialTermsSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal">Commercial Terms</h2>
      <div className="mt-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <PaymentTermSelect label="Payment Type" defaultValue={data.paymentType} disabled={readOnly} onChange={(e) => onChange({ paymentType: e.target.value })} />
          <NumberInput label="Advance %" unit="%" value={data.advancePercent || ""} disabled={readOnly} onChange={(e) => onChange({ advancePercent: Number(e.target.value) || 0 })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput label="Credit Days" value={data.creditDays || ""} disabled={readOnly} onChange={(e) => onChange({ creditDays: Number(e.target.value) || 0 })} />
          <NumberInput label="EMD Amount" unit="₹" value={data.emdAmount || ""} disabled={readOnly} onChange={(e) => onChange({ emdAmount: Number(e.target.value) || 0 })} />
        </div>

        <Textarea label="Balance Payment" rows={2} value={data.balancePayment} disabled={readOnly} onChange={(e) => onChange({ balancePayment: e.target.value })} />

        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput label="Brokerage" unit="₹" value={data.brokerage || ""} disabled={readOnly} onChange={(e) => onChange({ brokerage: Number(e.target.value) || 0 })} />
          <NumberInput label="Commission" unit="₹" value={data.commission || ""} disabled={readOnly} onChange={(e) => onChange({ commission: Number(e.target.value) || 0 })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput label="GST %" unit="%" value={data.gstPercent || ""} disabled={readOnly} onChange={(e) => onChange({ gstPercent: Number(e.target.value) || 0 })} />
          <NumberInput label="Insurance" unit="₹" value={data.insurance || ""} disabled={readOnly} onChange={(e) => onChange({ insurance: Number(e.target.value) || 0 })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput label="Freight" unit="₹" value={data.freight || ""} disabled={readOnly} onChange={(e) => onChange({ freight: Number(e.target.value) || 0 })} />
          <NumberInput label="Loading Charges" unit="₹" value={data.loadingCharges || ""} disabled={readOnly} onChange={(e) => onChange({ loadingCharges: Number(e.target.value) || 0 })} />
        </div>
      </div>
    </div>
  );
}
