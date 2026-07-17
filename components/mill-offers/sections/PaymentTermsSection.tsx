import { Checkbox } from "@/components/forms/Checkbox";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { PaymentTermSelect } from "@/components/master-data";
import type { MillOfferPaymentTerms } from "@/lib/types/millOffer";

interface PaymentTermsSectionProps {
  data: MillOfferPaymentTerms;
  onChange: (patch: Partial<MillOfferPaymentTerms>) => void;
  errors?: Partial<Record<keyof MillOfferPaymentTerms, string>>;
  readOnly?: boolean;
}

/** Business Rule: EMD fields appear only if EMD Required = Yes. */
export function PaymentTermsSection({ data, onChange, errors = {}, readOnly = false }: PaymentTermsSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Payment Terms</h2>
      <div className="mt-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <PaymentTermSelect
            label="Payment Type"
            defaultValue={data.paymentType}
            disabled={readOnly}
            onChange={(e) => onChange({ paymentType: e.target.value })}
            error={errors.paymentType}
          />
          <NumberInput
            label="Advance %"
            unit="%"
            value={data.advancePercent || ""}
            disabled={readOnly}
            onChange={(e) => onChange({ advancePercent: Number(e.target.value) || 0 })}
          />
        </div>

        <Textarea
          label="Balance Payment"
          placeholder="e.g. Balance before dispatch"
          rows={2}
          value={data.balancePayment}
          disabled={readOnly}
          onChange={(e) => onChange({ balancePayment: e.target.value })}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="Payment Due Date"
            type="date"
            value={data.paymentDueDate}
            disabled={readOnly}
            onChange={(e) => onChange({ paymentDueDate: e.target.value })}
          />
          <NumberInput
            label="Credit Days"
            value={data.creditDays || ""}
            disabled={readOnly}
            onChange={(e) => onChange({ creditDays: Number(e.target.value) || 0 })}
          />
        </div>

        <Checkbox
          label="EMD Required"
          checked={data.emdRequired}
          disabled={readOnly}
          onChange={(e) => onChange({ emdRequired: e.target.checked })}
        />

        {data.emdRequired && (
          <div className="grid sm:grid-cols-2 gap-5 rounded-sm border border-gold/25 bg-gold/[0.04] p-4">
            <NumberInput
              label="EMD Amount"
              unit="₹"
              value={data.emdAmount || ""}
              disabled={readOnly}
              onChange={(e) => onChange({ emdAmount: Number(e.target.value) || 0 })}
              error={errors.emdAmount}
            />
            <TextInput
              label="EMD Due Date"
              type="date"
              value={data.emdDueDate}
              disabled={readOnly}
              onChange={(e) => onChange({ emdDueDate: e.target.value })}
              error={errors.emdDueDate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
