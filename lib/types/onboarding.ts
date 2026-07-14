export interface OnboardingDocument {
  fileName: string | null;
  uploadedAt: string | null;
}

export interface OnboardingFormData {
  // Step 1 — Business Type
  businessType: string;

  // Step 2 — Company Details
  companyName: string;
  gstin: string;
  pan: string;
  cin: string;
  iec: string;

  // Step 3 — Business Information
  yearsInBusiness: string;
  annualTurnover: string;
  statesServed: string[];
  monthlyTradingVolume: string;

  // Step 4 — Address
  country: string;
  state: string;
  city: string;
  pinCode: string;
  fullAddress: string;

  // Step 5 — Business Preference
  preferences: {
    buySugar: boolean;
    sellSugar: boolean;
    bothBuyAndSell: boolean;
    transportServices: boolean;
  };

  // Step 6 — Documents (placeholders only, no real upload)
  documents: {
    gstCertificate: OnboardingDocument;
    panCard: OnboardingDocument;
    companyLogo: OnboardingDocument;
  };
}

export const EMPTY_ONBOARDING_FORM: OnboardingFormData = {
  businessType: "",
  companyName: "",
  gstin: "",
  pan: "",
  cin: "",
  iec: "",
  yearsInBusiness: "",
  annualTurnover: "",
  statesServed: [],
  monthlyTradingVolume: "",
  country: "india",
  state: "",
  city: "",
  pinCode: "",
  fullAddress: "",
  preferences: {
    buySugar: false,
    sellSugar: false,
    bothBuyAndSell: false,
    transportServices: false,
  },
  documents: {
    gstCertificate: { fileName: null, uploadedAt: null },
    panCard: { fileName: null, uploadedAt: null },
    companyLogo: { fileName: null, uploadedAt: null },
  },
};
