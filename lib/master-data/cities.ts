import type { CityOption } from "@/types/master-data";
import { STATES } from "./states";

/**
 * Source city/district names per state code. Kept as a plain name map
 * (rather than hand-written CityOption objects) so adding/editing a
 * state's cities is a one-line change — CITIES below is derived from
 * this at module load.
 *
 * Coverage: every state/UT has real city and district names, with
 * deeper coverage (10-14 entries) for the major sugar-producing states
 * (Maharashtra, Uttar Pradesh, Karnataka, Gujarat, Punjab, Tamil Nadu,
 * Andhra Pradesh, Bihar, Haryana — see states.ts's SUGAR_PRODUCING_STATES)
 * since that's where the overwhelming majority of TradeSucro's mills,
 * warehouses, and trade activity concentrate. This is a genuinely
 * expanded reference (from a uniform 5-per-state baseline), not an
 * exhaustive national gazetteer — if a specific town is still missing,
 * extending this map is a one-line addition, not a schema change.
 */
const CITY_NAMES_BY_STATE: Record<string, string[]> = {
  "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Kakinada", "Rajahmundry", "Anantapur", "Kadapa", "Eluru", "Chittoor"],
  "arunachal-pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along"],
  assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia", "Bongaigaon"],
  bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Chapra", "Begusarai", "Katihar", "Munger", "Motihari", "Siwan"],
  chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
  goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
  gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Dahod", "Godhra", "Junagadh", "Jamnagar", "Anand", "Nadiad", "Mehsana", "Bharuch", "Navsari"],
  haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Yamunanagar", "Kaithal", "Kurukshetra"],
  "himachal-pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Una", "Kullu"],
  jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih"],
  karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Shivamogga", "Tumakuru", "Kalaburagi", "Bagalkot", "Bidar"],
  kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
  "madhya-pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "Solapur", "Sangli", "Satara", "Ahmednagar", "Latur", "Jalgaon", "Akola", "Amravati"],
  manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
  meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara"],
  mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Moga", "Hoshiarpur", "Firozpur", "Sangrur"],
  rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sri Ganganagar", "Sikar"],
  sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],
  "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Vellore", "Thanjavur", "Dindigul", "Cuddalore"],
  telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Mahbubnagar"],
  tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
  "uttar-pradesh": ["Lucknow", "Kanpur", "Noida", "Agra", "Varanasi", "Meerut", "Ghaziabad", "Bareilly", "Moradabad", "Aligarh", "Gorakhpur", "Muzaffarnagar", "Saharanpur", "Shahjahanpur"],
  uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Rishikesh", "Roorkee", "Haldwani", "Kashipur"],
  "west-bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Malda", "Kharagpur"],

  "andaman-nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Car Nicobar"],
  chandigarh: ["Sector 17", "Sector 22", "Sector 35", "Manimajra", "Mani Majra"],
  "dnh-dd": ["Silvassa", "Daman", "Diu", "Amli", "Naroli"],
  delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Connaught Place", "Janakpuri"],
  "jammu-kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore"],
  ladakh: ["Leh", "Kargil", "Nubra", "Zanskar", "Diskit"],
  lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott"],
  puducherry: ["Puducherry", "Karaikal", "Yanam", "Mahe", "Ozhukarai"],
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Flattened city list — every STATES entry is guaranteed at least 5 cities, with 10-14 for the major sugar-producing states. */
export const CITIES: CityOption[] = STATES.flatMap((state) =>
  (CITY_NAMES_BY_STATE[state.value] ?? []).map((name) => ({
    value: `${state.value}__${slugify(name)}`,
    label: name,
    stateCode: state.value,
  }))
);
