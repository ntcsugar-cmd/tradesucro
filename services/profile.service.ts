import type {
  CompanyProfile,
  ProfileCompletion,
  ActivityTimelineItem,
} from "@/lib/types/company-profile";
import type { OnboardingFormData } from "@/lib/types/onboarding";
import { authService } from "./auth.service";

const PROFILE_KEY = "tradesucro-company-profile";
const NETWORK_DELAY_MS = 500;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readProfile(): CompanyProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CompanyProfile) : null;
  } catch {
    return null;
  }
}

function writeProfile(profile: CompanyProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function timelineEntry(title: string): ActivityTimelineItem {
  return { id: crypto.randomUUID(), title, timestamp: new Date().toISOString() };
}

const MOCK_TEAM = [
  { id: "t1", name: "Priya Nair", designation: "Trading Head", email: "priya@company.com", phone: "9876543210" },
  { id: "t2", name: "Arjun Rao", designation: "Accounts Manager", email: "arjun@company.com", phone: "9876500011" },
];

/**
 * Profile Service (mock)
 * ------------------------------------------------------------------
 * No backend yet — the company profile lives in localStorage, seeded
 * from the onboarding wizard's submitted data (see seedFromOnboarding,
 * called by onboarding.service.ts). getProfileCompletion() is computed
 * from the live profile object each call, so it always reflects the
 * current state — no separate "completion" data to fall out of sync.
 */
export const profileService = {
  /** Called once, by onboarding.service.ts, right after the wizard is submitted. */
  seedFromOnboarding(data: OnboardingFormData): CompanyProfile {
    const session = authService.getSession();

    const profile: CompanyProfile = {
      logoFileName: data.documents.companyLogo.fileName,
      companyName: data.companyName,
      businessType: data.businessType,
      yearsInBusiness: data.yearsInBusiness,
      businessDescription: "",

      verification: {
        gst: data.gstin ? "pending" : "not_submitted",
        pan: data.pan ? "pending" : "not_submitted",
        iec: data.iec ? "pending" : "not_submitted",
        fssai: "not_submitted",
        email: session?.emailVerified ? "verified" : "pending",
        mobile: session?.mobileVerified ? "verified" : "pending",
      },

      contact: {
        contactPerson: session?.fullName ?? "",
        mobile: session?.mobile ?? "",
        email: session?.email ?? "",
        website: "",
      },

      address: {
        country: data.country,
        state: data.state,
        city: data.city,
        pinCode: data.pinCode,
        fullAddress: data.fullAddress,
      },

      businessDetails: {
        annualTurnover: data.annualTurnover,
        monthlyTradingVolume: data.monthlyTradingVolume,
        statesServed: data.statesServed,
        productsHandled: [],
      },

      documents: [
        { id: "gst-cert", label: "GST Certificate", ...data.documents.gstCertificate },
        { id: "pan-card", label: "PAN Card", ...data.documents.panCard },
        { id: "company-logo", label: "Company Logo", ...data.documents.companyLogo },
      ],

      galleryImageFileNames: [],
      team: MOCK_TEAM,
      bankDetailsAdded: false,

      activityTimeline: [
        timelineEntry("Account Created"),
        timelineEntry("Business Registered"),
        ...(data.documents.gstCertificate.fileName || data.documents.panCard.fileName
          ? [timelineEntry("Documents Uploaded")]
          : []),
      ],
    };

    writeProfile(profile);
    return profile;
  },

  async getProfile(): Promise<CompanyProfile | null> {
    return delay(readProfile());
  },

  async updateProfile(patch: Partial<CompanyProfile>): Promise<CompanyProfile | null> {
    const current = readProfile();
    if (!current) return delay(null);

    const updated: CompanyProfile = {
      ...current,
      ...patch,
      activityTimeline: [...current.activityTimeline, timelineEntry("Profile Updated")],
    };
    writeProfile(updated);
    return delay(updated);
  },

  async getProfileCompletion(): Promise<ProfileCompletion> {
    const profile = readProfile();
    const session = authService.getSession();

    const items = [
      { label: "Account Created", complete: !!session },
      { label: "Business Registered", complete: !!session?.onboardingComplete },
      { label: "GST Verified", complete: profile?.verification.gst === "verified" },
      { label: "PAN Verified", complete: profile?.verification.pan === "verified" },
      { label: "Company Logo", complete: !!profile?.logoFileName },
      { label: "Bank Details", complete: !!profile?.bankDetailsAdded },
      { label: "Company Description", complete: !!profile?.businessDescription?.trim() },
    ];

    const percent = Math.round((items.filter((i) => i.complete).length / items.length) * 100);
    return delay({ percent, items });
  },
};
