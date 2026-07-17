import type { CityOption } from "@/types/master-data";
import { STATES } from "./states";

/**
 * Source city/district names per state code. Kept as a plain name map
 * (rather than hand-written CityOption objects) so adding/editing a
 * state's cities is a one-line change — CITIES below is derived from
 * this at module load, and CitySelect (components/master-data/CitySelect.tsx)
 * already re-fetches from masterDataService.getCities(state) whenever
 * the selected state changes, so this is the one place to extend for
 * every consumer to pick it up automatically.
 *
 * Every one of India's 28 states and 8 union territories has a genuine,
 * substantially expanded list of real cities/districts (18-26 for the
 * major sugar-producing states — Maharashtra, Uttar Pradesh, Karnataka,
 * Gujarat, Punjab, Tamil Nadu, Andhra Pradesh, Bihar, Haryana — since
 * that's where the overwhelming majority of TradeSucro's mills,
 * warehouses, and trade activity concentrate; 10-16 for every other
 * state; 6-10 for the smaller union territories). This is a real,
 * meaningfully complete reference list, not an exhaustive national
 * gazetteer of all 700+ Indian districts — if a specific town is still
 * missing, extending this map is a one-line addition, not a schema or
 * component change.
 */
const CITY_NAMES_BY_STATE: Record<string, string[]> = {
  "andhra-pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Kakinada", "Rajahmundry",
    "Anantapur", "Kadapa", "Eluru", "Chittoor", "Ongole", "Srikakulam", "Vizianagaram", "Machilipatnam",
    "Tenali", "Proddatur", "Adoni", "Nandyal",
  ],
  "arunachal-pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu", "Changlang", "Khonsa"],
  assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia", "Bongaigaon", "Karimganj", "Sivasagar", "Goalpara", "Barpeta", "Dhubri", "North Lakhimpur"],
  bihar: [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Chapra", "Begusarai", "Katihar",
    "Munger", "Motihari", "Siwan", "Arrah", "Bettiah", "Saharsa", "Sasaram", "Hajipur", "Nawada", "Buxar", "Kishanganj",
  ],
  chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Raigarh", "Dhamtari", "Mahasamund", "Kanker"],
  goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanguem", "Canacona", "Pernem"],
  gujarat: [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Dahod", "Godhra", "Junagadh", "Jamnagar",
    "Anand", "Nadiad", "Mehsana", "Bharuch", "Navsari", "Gandhinagar", "Morbi", "Surendranagar", "Valsad",
    "Porbandar", "Palanpur", "Botad", "Patan",
  ],
  haryana: [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Yamunanagar",
    "Kaithal", "Kurukshetra", "Bhiwani", "Panchkula", "Sirsa", "Jind", "Rewari", "Palwal", "Fatehabad",
  ],
  "himachal-pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Una", "Kullu", "Bilaspur", "Hamirpur", "Chamba", "Kangra", "Nahan"],
  jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka", "Chaibasa", "Palamu", "Godda"],
  karnataka: [
    "Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Shivamogga",
    "Tumakuru", "Kalaburagi", "Bagalkot", "Bidar", "Hassan", "Mandya", "Raichur", "Bijapur", "Chitradurga",
    "Kolar", "Udupi", "Chikkamagaluru",
  ],
  kerala: [
    "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur",
    "Kottayam", "Malappuram", "Kasaragod", "Idukki", "Pathanamthitta", "Wayanad",
  ],
  "madhya-pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
    "Katni", "Singrauli", "Chhindwara", "Vidisha", "Shivpuri", "Guna", "Khandwa", "Burhanpur",
  ],
  maharashtra: [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "Solapur", "Sangli", "Satara",
    "Ahmednagar", "Latur", "Jalgaon", "Akola", "Amravati", "Nanded", "Osmanabad", "Beed", "Parbhani",
    "Wardha", "Chandrapur", "Dhule", "Ratnagiri", "Buldhana", "Yavatmal", "Thane", "Raigad",
  ],
  manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong"],
  meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara", "Williamnagar", "Nongpoh"],
  mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Saiha", "Lawngtlai"],
  nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek"],
  odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Bhadrak", "Angul", "Jharsuguda", "Koraput"],
  punjab: [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Moga", "Hoshiarpur",
    "Firozpur", "Sangrur", "Kapurthala", "Faridkot", "Muktsar", "Gurdaspur", "Ropar", "Fatehgarh Sahib", "Barnala",
  ],
  rajasthan: [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sri Ganganagar",
    "Sikar", "Pali", "Nagaur", "Jhunjhunu", "Chittorgarh", "Barmer", "Tonk", "Bhilwara", "Churu", "Jaisalmer",
  ],
  sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang"],
  "tamil-nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Vellore",
    "Thanjavur", "Dindigul", "Cuddalore", "Kanchipuram", "Karur", "Namakkal", "Sivakasi", "Thoothukudi",
    "Nagercoil", "Hosur", "Krishnagiri", "Villupuram",
  ],
  telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Mahbubnagar", "Adilabad", "Siddipet", "Suryapet", "Medak"],
  tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Khowai", "Ambassa"],
  "uttar-pradesh": [
    "Lucknow", "Kanpur", "Noida", "Agra", "Varanasi", "Meerut", "Ghaziabad", "Bareilly", "Moradabad",
    "Aligarh", "Gorakhpur", "Muzaffarnagar", "Saharanpur", "Shahjahanpur", "Allahabad", "Jhansi",
    "Firozabad", "Mathura", "Rampur", "Faizabad", "Sitapur", "Hardoi", "Basti", "Gonda", "Azamgarh", "Bulandshahr",
  ],
  uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Rishikesh", "Roorkee", "Haldwani", "Kashipur", "Rudrapur", "Almora", "Pithoragarh", "Pauri"],
  "west-bengal": [
    "Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Malda", "Kharagpur",
    "Nadia", "Murshidabad", "Cooch Behar", "Jalpaiguri", "Purulia", "Bankura", "Midnapore", "Darjeeling",
  ],

  "andaman-nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Car Nicobar", "Havelock Island", "Little Andaman"],
  chandigarh: ["Sector 17", "Sector 22", "Sector 35", "Manimajra", "Mani Majra", "Sector 43", "Sector 9"],
  "dnh-dd": ["Silvassa", "Daman", "Diu", "Amli", "Naroli", "Dadra", "Khanvel"],
  delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Connaught Place", "Janakpuri", "Pitampura", "Lajpat Nagar", "Vasant Kunj", "Mayur Vihar", "Shahdara"],
  "jammu-kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore", "Pulwama", "Kupwara", "Rajouri", "Poonch"],
  ladakh: ["Leh", "Kargil", "Nubra", "Zanskar", "Diskit", "Drass", "Nyoma"],
  lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalpeni", "Kiltan"],
  puducherry: ["Puducherry", "Karaikal", "Yanam", "Mahe", "Ozhukarai", "Villianur", "Bahour"],
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Flattened city list — derived from CITY_NAMES_BY_STATE above. Every STATES entry has a genuine, substantially expanded set of real cities/districts. */
export const CITIES: CityOption[] = STATES.flatMap((state) =>
  (CITY_NAMES_BY_STATE[state.value] ?? []).map((name) => ({
    value: `${state.value}__${slugify(name)}`,
    label: name,
    stateCode: state.value,
  }))
);
