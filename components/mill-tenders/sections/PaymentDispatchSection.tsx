import { NumberInput, TextInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { DispatchTermSelect } from "@/components/master-data";
import type { MillTenderPaymentTerms, MillTenderDispatchTerms } from "@/lib/types/millTender";

interface PaymentDispatchSectionProps {
  payment: MillTenderPaymentTerms;
  dispatch: MillTenderDispatchTerms;
  onChangePayment: (patch: Partial<MillTenderPaymentTerms>) => void;
  onChangeDispatch: (patch: Partial<MillTenderDispatchTerms>) => void;
  readOnly?: boolean;
}

export function PaymentDispatchSection({ payment, dispatch, onChangePayment, onChangeDispatch, readOnly = false }: PaymentDispatchSectionProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Payment Terms</h2>
        <div className="mt-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput label="Advance %" unit="%" value={payment.advancePercent || ""} disabled={readOnly} onChange={(e) => onChangePayment({ advancePercent: Number(e.target.value) || 0 })} />
            <NumberInput label="Balance %" unit="%" value={payment.balancePercent || ""} disabled={readOnly} onChange={(e) => onChangePayment({ balancePercent: Number(e.target.value) || 0 })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <TextInput label="Payment Due" value={payment.paymentDue} disabled={readOnly} onChange={(e) => onChangePayment({ paymentDue: e.target.value })} />
            <NumberInput label="Credit Days" value={payment.creditDays || ""} disabled={readOnly} onChange={(e) => onChangePayment({ creditDays: Number(e.target.value) || 0 })} />
          </div>
          <Textarea label="EMD Notes" rows={2} value={payment.emdNotes} disabled={readOnly} onChange={(e) => onChangePayment({ emdNotes: e.target.value })} />
          <TextInput label="Bank Details" helperText="Where bidders should remit EMD/advance" value={payment.bankDetailsSummary} disabled={readOnly} onChange={(e) => onChangePayment({ bankDetailsSummary: e.target.value })} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Dispatch Terms</h2>
        <div className="mt-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <TextInput label="Dispatch Start" type="date" value={dispatch.dispatchStart} disabled={readOnly} onChange={(e) => onChangeDispatch({ dispatchStart: e.target.value })} />
            <TextInput label="Dispatch End" type="date" value={dispatch.dispatchEnd} disabled={readOnly} onChange={(e) => onChangeDispatch({ dispatchEnd: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput label="Loading Capacity" unit="MT/day" value={dispatch.loadingCapacity || ""} disabled={readOnly} onChange={(e) => onChangeDispatch({ loadingCapacity: Number(e.target.value) || 0 })} />
            <NumberInput label="Daily Dispatch Limit" unit="MT" value={dispatch.dailyDispatchLimit || ""} disabled={readOnly} onChange={(e) => onChangeDispatch({ dailyDispatchLimit: Number(e.target.value) || 0 })} />
          </div>
          <DispatchTermSelect label="Delivery Terms" defaultValue={dispatch.deliveryTerms} disabled={readOnly} onChange={(e) => onChangeDispatch({ deliveryTerms: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
