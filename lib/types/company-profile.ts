export type VerificationStatus = "verified" | "pending" | "not_submitted";

export interface VerificationState {
  gst: VerificationStatus;
  pan: VerificationStatus;
  iec: VerificationStatus;
  fssai: VerificationStatus;
  email: VerificationStatus;
  mobile: VerificationStatus;
}

export interface CompanyContact {
  contactPerson: string;
  mobile: string;
  email: string;
  website: string;
}

export interface CompanyAddress {
  country: string;
  state: string;
  city: string;
  pinCode: string;
  fullAddress: string;
}

export interface CompanyBusinessDetails {
  annualTurnover: string;
  monthlyTradingVolume: string;
  statesServed: string[];
  productsHandled: string[];
}

export interface CompanyDocument {
  id: string;
  label: string;
  fileName: string | null;
  uploadedAt: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  timestamp: string;
}

export interface CompanyProfile {
  logoFileName: string | null;
  companyName: string;
  businessType: string;
  yearsInBusiness: string;
  businessDescription: string;

  verification: VerificationState;
  contact: CompanyContact;
  address: CompanyAddress;
  businessDetails: CompanyBusinessDetails;
  documents: CompanyDocument[];
  galleryImageFileNames: string[];
  team: TeamMember[];
  bankDetailsAdded: boolean;
  activityTimeline: ActivityTimelineItem[];
}

export interface ProfileCompletionItem {
  label: string;
  complete: boolean;
}

export interface ProfileCompletion {
  percent: number;
  items: ProfileCompletionItem[];
}
