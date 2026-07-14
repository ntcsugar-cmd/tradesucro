/** Countries offered in the onboarding address step. India-first since TradeSucro is an Indian marketplace, with a short list of major trading partner countries for exporters/importers. */
export interface OnboardingCountryOption {
  value: string;
  label: string;
}

export const COUNTRIES: OnboardingCountryOption[] = [
  { value: "india", label: "India" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "indonesia", label: "Indonesia" },
  { value: "sri-lanka", label: "Sri Lanka" },
  { value: "singapore", label: "Singapore" },
  { value: "other", label: "Other" },
];

export function getCountryLabel(value: string): string {
  return COUNTRIES.find((c) => c.value === value)?.label ?? value;
}
