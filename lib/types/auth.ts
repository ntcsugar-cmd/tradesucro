/** Mock authenticated user — shape a real /me endpoint would return. */
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  onboardingComplete: boolean;
  /** Populated once onboarding Step 2/1 complete — optional until then. */
  companyName?: string;
  businessType?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyCodePayload {
  code: string;
}

/** Generic result shape every mock auth.service.ts function resolves with. */
export interface AuthResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
