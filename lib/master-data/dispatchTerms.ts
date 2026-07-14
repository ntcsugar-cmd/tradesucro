import type { DispatchTermOption } from "@/types/master-data";

export const DISPATCH_TERMS: DispatchTermOption[] = [
  { value: "ex-mill", label: "Ex Mill", requiresLocation: false },
  { value: "ex-warehouse", label: "Ex Warehouse with location", requiresLocation: true },
  { value: "delivered", label: "Delivered", requiresLocation: false },
  { value: "fob", label: "FOB", requiresLocation: false },
  { value: "cif", label: "CIF", requiresLocation: false },
];
