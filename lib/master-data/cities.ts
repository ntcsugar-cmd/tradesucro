import type { CityOption } from "@/types/master-data";
import { STATES } from "./states";

/**
 * Source city names per state code. Kept as a plain name map (rather than
 * 180 hand-written CityOption objects) so adding/editing a state's cities
 * is a one-line change — CITIES below is derived from this at module load.
 */
const CITY_NAMES_BY_STATE: Record<string, string[]> = {
  "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "arunachal-pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
  bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "himachal-pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"],
  jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  "madhya-pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur"],
  manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
  meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara"],
  mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"],
  rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],
  "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
  "uttar-pradesh": ["Lucknow", "Kanpur", "Noida", "Agra", "Varanasi"],
  uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Rishikesh", "Roorkee"],
  "west-bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],

  "andaman-nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Car Nicobar"],
  chandigarh: ["Sector 17", "Sector 22", "Sector 35", "Manimajra", "Mani Majra"],
  "dnh-dd": ["Silvassa", "Daman", "Diu", "Amli", "Naroli"],
  delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  "jammu-kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  ladakh: ["Leh", "Kargil", "Nubra", "Zanskar", "Diskit"],
  lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott"],
  puducherry: ["Puducherry", "Karaikal", "Yanam", "Mahe", "Ozhukarai"],
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Flattened city list — every STATES entry is guaranteed at least 5 cities. */
export const CITIES: CityOption[] = STATES.flatMap((state) =>
  (CITY_NAMES_BY_STATE[state.value] ?? []).map((name) => ({
    value: `${state.value}__${slugify(name)}`,
    label: name,
    stateCode: state.value,
  }))
);
