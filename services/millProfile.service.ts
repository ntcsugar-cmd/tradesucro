import type { MillProfile } from "@/lib/types/millProfile";

const STORAGE_KEY = "tradesucro-mill-profile";
const NETWORK_DELAY_MS = 350;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function seedProfile(): MillProfile {
  return {
    id: "mill-profile-self",
    companyName: "Kaveri Sugar Mills Ltd.",
    factory: {
      factoryCode: "FC-KA-014",
      dailyCrushingCapacityTcd: 8500,
      sugarProductionCapacityTpd: 950,
      storageCapacityMt: 42000,
      establishedYear: 1974,
    },
    warehouses: [
      { id: "wh-1", name: "Mill Godown A", location: "Belagavi, Karnataka", capacityMt: 25000 },
      { id: "wh-2", name: "Satellite Warehouse", location: "Hubballi, Karnataka", capacityMt: 12000 },
    ],
    bankDetails: {
      accountHolderName: "Kaveri Sugar Mills Ltd.",
      bankName: "State Bank of India",
      accountNumber: "XXXXXXXX4821",
      ifscCode: "SBIN0001234",
      branch: "Belagavi Industrial Estate",
    },
    gstin: "29AAAAA0000A1Z5",
    pan: "AAAAA0000A",
    iec: "0312345678",
    contactPersons: [
      { id: "cp-1", name: "Rohan Mehta", designation: "General Manager, Sales", phone: "9876543210", email: "rohan@kaverisugarmills.com" },
      { id: "cp-2", name: "Suresh Iyer", designation: "Dispatch Manager", phone: "9876500011", email: "suresh@kaverisugarmills.com" },
    ],
    location: {
      state: "karnataka",
      city: "Belagavi",
      pinCode: "590001",
      fullAddress: "Plot 14, Industrial Area, Belagavi, Karnataka",
    },
    documents: [
      { id: "doc-1", label: "GST Certificate", fileName: "gst_certificate.pdf", uploadedAt: new Date().toISOString() },
      { id: "doc-2", label: "Factory License", fileName: "factory_license.pdf", uploadedAt: new Date().toISOString() },
      { id: "doc-3", label: "IEC Certificate", fileName: null, uploadedAt: null },
    ],
    verification: {
      gst: "verified",
      pan: "verified",
      iec: "pending",
      factoryLicense: "verified",
    },
    updatedAt: new Date().toISOString(),
  };
}

function readProfile(): MillProfile {
  if (typeof window === "undefined") return seedProfile();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MillProfile;
  } catch {
    // fall through to seed
  }
  const seeded = seedProfile();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeProfile(profile: MillProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Mill Profile Service (mock)
 * ------------------------------------------------------------------
 * No backend. Seeded once, then localStorage-backed for edits — same
 * pattern as profile.service.ts (Company Profile), but this is a
 * separate store since Mill Profile is a distinct module.
 */
export const millProfileService = {
  async getProfile(): Promise<MillProfile> {
    return delay(readProfile());
  },

  async updateProfile(patch: Partial<MillProfile>): Promise<MillProfile> {
    const updated: MillProfile = { ...readProfile(), ...patch, updatedAt: new Date().toISOString() };
    writeProfile(updated);
    return delay(updated, 500);
  },
};
