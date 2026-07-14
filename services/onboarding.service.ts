import type { OnboardingFormData } from "@/lib/types/onboarding";
import type { AuthResult } from "@/lib/types/auth";
import { authService } from "./auth.service";
import { profileService } from "./profile.service";

const NETWORK_DELAY_MS = 1100;
const DRAFT_KEY = "tradesucro-onboarding-draft";

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface OnboardingDraft {
  step: number;
  data: OnboardingFormData;
}

/**
 * Onboarding Service (mock)
 * ------------------------------------------------------------------
 * No backend yet:
 *  - saveDraft/loadDraft/clearDraft persist the in-progress wizard to
 *    localStorage so a page refresh doesn't lose entered data.
 *  - submitOnboarding marks the mock session complete and hands the
 *    submitted data to profileService, which seeds the Company Profile
 *    record. Swap the network-facing bodies for real API calls later;
 *    call sites don't change.
 */
export const onboardingService = {
  saveDraft(draft: OnboardingDraft) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // localStorage unavailable (e.g. private browsing quota) — safe to ignore, it's just a resume convenience.
    }
  },

  loadDraft(): OnboardingDraft | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      return raw ? (JSON.parse(raw) as OnboardingDraft) : null;
    } catch {
      return null;
    }
  },

  clearDraft() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(DRAFT_KEY);
  },

  async submitOnboarding(data: OnboardingFormData): Promise<AuthResult> {
    if (!data.businessType || !data.companyName) {
      return delay({ success: false, message: "Missing required onboarding details." }, 300);
    }

    authService.updateSession({
      companyName: data.companyName,
      businessType: data.businessType,
      onboardingComplete: true,
    });
    profileService.seedFromOnboarding(data);
    onboardingService.clearDraft();

    return delay({ success: true, message: "Onboarding complete." });
  },
};
