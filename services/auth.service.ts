import type {
  AuthUser,
  AuthResult,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyCodePayload,
} from "@/lib/types/auth";

/**
 * Auth Service (mock)
 * ------------------------------------------------------------------
 * TradeSucro has no backend yet. Every function below simulates network
 * latency and returns a realistic success/error shape so the UI (loading
 * states, error messages, redirects) behaves the way it will against a
 * real API. A mock "session" is kept in localStorage purely so a
 * page refresh during onboarding/dashboard doesn't lose the demo user —
 * this is not a security mechanism.
 */

const SESSION_KEY = "tradesucro-mock-session";
const NETWORK_DELAY_MS = 900;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(SESSION_KEY);
}

function mockUserFrom(partial: Partial<AuthUser>): AuthUser {
  return {
    id: partial.id ?? crypto.randomUUID(),
    fullName: partial.fullName ?? "Priya Nair",
    email: partial.email ?? "priya@kaverisugarmills.com",
    mobile: partial.mobile ?? "9876543210",
    emailVerified: partial.emailVerified ?? false,
    mobileVerified: partial.mobileVerified ?? false,
    onboardingComplete: partial.onboardingComplete ?? false,
  };
}

export const authService = {
  async login({ email, password }: LoginPayload): Promise<AuthResult<AuthUser>> {
    if (!email || !password) {
      return delay({ success: false, message: "Enter your email and password." });
    }
    if (password.length < 8) {
      return delay({ success: false, message: "Incorrect email or password." });
    }
    const user = mockUserFrom({ email, emailVerified: true, mobileVerified: true, onboardingComplete: true });
    writeSession(user);
    return delay({ success: true, message: "Welcome back.", data: user });
  },

  async register(payload: RegisterPayload): Promise<AuthResult<AuthUser>> {
    const { fullName, email, mobile, password } = payload;
    if (!fullName || !email || !mobile || !password) {
      return delay({ success: false, message: "All fields are required." });
    }
    const user = mockUserFrom({ fullName, email, mobile, emailVerified: false, mobileVerified: false, onboardingComplete: false });
    writeSession(user);
    return delay({ success: true, message: "Account created.", data: user });
  },

  async forgotPassword({ email }: ForgotPasswordPayload): Promise<AuthResult> {
    if (!email) return delay({ success: false, message: "Enter the email on your account." });
    return delay({ success: true, message: "If that email exists, a reset link has been sent." });
  },

  async resetPassword({ password }: ResetPasswordPayload): Promise<AuthResult> {
    if (!password || password.length < 8) {
      return delay({ success: false, message: "Password must be at least 8 characters." });
    }
    return delay({ success: true, message: "Your password has been reset." });
  },

  async verifyEmail({ code }: VerifyCodePayload): Promise<AuthResult> {
    if (code.length !== 6) return delay({ success: false, message: "Enter the 6-digit code from your email." });
    const user = readSession();
    if (user) writeSession({ ...user, emailVerified: true });
    return delay({ success: true, message: "Email verified." });
  },

  async verifyMobile({ code }: VerifyCodePayload): Promise<AuthResult> {
    if (code.length !== 6) return delay({ success: false, message: "Enter the 6-digit code from your SMS." });
    const user = readSession();
    if (user) writeSession({ ...user, mobileVerified: true });
    return delay({ success: true, message: "Mobile number verified." });
  },

  async resendCode(): Promise<AuthResult> {
    return delay({ success: true, message: "A new code has been sent." }, 500);
  },

  getSession(): AuthUser | null {
    return readSession();
  },

  markOnboardingComplete() {
    const user = readSession();
    if (user) writeSession({ ...user, onboardingComplete: true });
  },

  /** Generic patch — used by onboarding.service.ts to record company name/type on the mock session. */
  updateSession(patch: Partial<AuthUser>) {
    const user = readSession();
    if (user) writeSession({ ...user, ...patch });
  },

  logout() {
    writeSession(null);
  },
};
