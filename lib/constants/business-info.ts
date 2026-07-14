export interface RangeOption {
  value: string;
  label: string;
}

export const ANNUAL_TURNOVER_RANGES: RangeOption[] = [
  { value: "under-1cr", label: "Under ₹1 Crore" },
  { value: "1-5cr", label: "₹1 Cr – ₹5 Cr" },
  { value: "5-25cr", label: "₹5 Cr – ₹25 Cr" },
  { value: "25-100cr", label: "₹25 Cr – ₹100 Cr" },
  { value: "100cr-plus", label: "₹100 Cr+" },
];

export const MONTHLY_TRADING_VOLUME_RANGES: RangeOption[] = [
  { value: "under-100mt", label: "Under 100 MT" },
  { value: "100-500mt", label: "100 – 500 MT" },
  { value: "500-2000mt", label: "500 – 2,000 MT" },
  { value: "2000-10000mt", label: "2,000 – 10,000 MT" },
  { value: "10000mt-plus", label: "10,000 MT+" },
];
