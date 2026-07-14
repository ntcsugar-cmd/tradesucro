/**
 * Company/organization types recognized on TradeSucro. Drives registration
 * forms, directory filters, and permission defaults.
 */
export interface CompanyType {
  value: string;
  label: string;
  description: string;
}

export const COMPANY_TYPES: CompanyType[] = [
  { value: "mill", label: "Sugar Mill", description: "Produces and sells sugar directly" },
  { value: "trader", label: "Sugar Trader", description: "Buys and resells across the supply chain" },
  { value: "broker", label: "Sugar Broker", description: "Facilitates deals between mills and buyers" },
  { value: "buyer", label: "Industrial Buyer", description: "FMCG, food, or beverage manufacturer" },
  { value: "exporter", label: "Exporter", description: "Ships sugar to international buyers" },
  { value: "importer", label: "Importer", description: "Brings sugar into India from overseas suppliers" },
  { value: "transporter", label: "Transporter", description: "Moves sugar between mills, warehouses, and ports" },
  { value: "warehouse", label: "Warehouse", description: "Provides storage and handling for bulk sugar" },
];

export function getCompanyTypeLabel(value: string): string {
  return COMPANY_TYPES.find((c) => c.value === value)?.label ?? value;
}
