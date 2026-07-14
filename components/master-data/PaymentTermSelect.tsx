"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { PaymentTermOption } from "@/types/master-data";

type PaymentTermSelectProps = Omit<MasterSelectProps<PaymentTermOption>, "fetcher" | "getOption">;

/** PaymentTermSelect — payment terms dropdown, sourced from masterDataService.getPaymentTerms(). */
export function PaymentTermSelect(props: PaymentTermSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getPaymentTerms} placeholder={props.placeholder ?? "Select payment term"} />;
}
