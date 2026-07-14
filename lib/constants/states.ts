/**
 * Indian states relevant to the sugar trade — producing belts and major
 * demand/port states. Single source of truth for every region dropdown.
 */
export interface CuratedStateOption {
  value: string;
  label: string;
  /** True for the major cane-producing belts (used to prioritize in lists). */
  producingBelt: boolean;
}

export const STATES: CuratedStateOption[] = [
  { value: "maharashtra", label: "Maharashtra", producingBelt: true },
  { value: "uttar-pradesh", label: "Uttar Pradesh", producingBelt: true },
  { value: "karnataka", label: "Karnataka", producingBelt: true },
  { value: "gujarat", label: "Gujarat", producingBelt: true },
  { value: "punjab", label: "Punjab", producingBelt: true },
  { value: "haryana", label: "Haryana", producingBelt: true },
  { value: "tamil-nadu", label: "Tamil Nadu", producingBelt: true },
  { value: "andhra-pradesh", label: "Andhra Pradesh", producingBelt: false },
  { value: "bihar", label: "Bihar", producingBelt: false },
  { value: "west-bengal", label: "West Bengal", producingBelt: false },
  { value: "madhya-pradesh", label: "Madhya Pradesh", producingBelt: false },
  { value: "rajasthan", label: "Rajasthan", producingBelt: false },
];

export const PRODUCING_STATES = STATES.filter((s) => s.producingBelt);

export function getStateLabel(value: string): string {
  return STATES.find((s) => s.value === value)?.label ?? value;
}
