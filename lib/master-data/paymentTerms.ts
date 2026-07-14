import type { PaymentTermOption } from "@/types/master-data";

export const PAYMENT_TERMS: PaymentTermOption[] = [
  { value: "100-advance", label: "100% Advance", creditDays: 0 },
  { value: "against-dispatch", label: "Against Dispatch", creditDays: 0 },
  { value: "against-delivery", label: "Against Delivery", creditDays: 0 },
  { value: "7-days-credit", label: "7 Days Credit", creditDays: 7 },
  { value: "15-days-credit", label: "15 Days Credit", creditDays: 15 },
  { value: "30-days-credit", label: "30 Days Credit", creditDays: 30 },
];
