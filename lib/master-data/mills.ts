import type { Mill, MillType } from "@/types/master-data";
import { CITIES } from "./cities";

/**
 * India's major cane-producing states — mills are concentrated here in
 * reality, so the generator below draws only from this subset (using
 * their cities from cities.ts) rather than scattering mills evenly
 * across all 36 states, which wouldn't reflect the real industry.
 */
const SUGAR_PRODUCING_STATES = [
  "maharashtra",
  "uttar-pradesh",
  "karnataka",
  "gujarat",
  "punjab",
  "tamil-nadu",
  "andhra-pradesh",
  "bihar",
  "haryana",
  "madhya-pradesh",
];

const NAME_TEMPLATES = [
  (city: string) => `${city} Sugar Mills Ltd.`,
  (city: string) => `${city} Sugarcane Industries`,
  (city: string) => `${city} Cooperative Sugar Factory`,
  (city: string) => `Shree ${city} Sugars Pvt. Ltd.`,
  (city: string) => `${city} Agro Sugar Refineries`,
];

const MILL_TYPES: MillType[] = ["Private", "Cooperative", "Public Sector"];

function generateMills(count: number): Mill[] {
  const eligibleCities = CITIES.filter((c) => SUGAR_PRODUCING_STATES.includes(c.stateCode));
  const mills: Mill[] = [];

  for (let i = 0; i < count; i++) {
    const city = eligibleCities[i % eligibleCities.length];
    const template = NAME_TEMPLATES[i % NAME_TEMPLATES.length];
    const type = MILL_TYPES[i % MILL_TYPES.length];
    // Deterministic but varied capacity, roughly 2,500–15,000 TPD.
    const capacityTpd = 2500 + ((i * 733) % 12500);

    mills.push({
      id: `mill-${String(i + 1).padStart(3, "0")}`,
      name: template(city.label),
      state: city.stateCode,
      city: city.label,
      capacityTpd,
      type,
    });
  }

  return mills;
}

/** 50 mock sugar mills, spread across India's major cane-producing states. */
export const MILLS: Mill[] = generateMills(50);
