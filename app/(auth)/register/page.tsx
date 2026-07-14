"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { TextInput, EmailInput, PasswordInput } from "@/components/forms/Input";
import { Checkbox } from "@/components/forms/Checkbox";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { authService } from "@/services/auth.service";
import { isValidEmail, isValidMobile, isStrongEnough, isRequired } from "@/lib/utils/validation";

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  acceptTerms: boolean;
}

const INITIAL_STATE: FormState = { fullName: "", email: "", mobile: "", password: "", acceptTerms: false };

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!isRequired(form.fullName)) next.fullName = "Full name is required.";
    if (!form.email) next.email = "Email is required.";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.mobile) next.mobile = "Mobile number is required.";
    else if (!isValidMobile(form.mobile)) next.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!form.password) next.password = "Password is required.";
    else if (!isStrongEnough(form.password)) next.password = "Use at least 8 characters, with a number or symbol.";
    if (!form.acceptTerms) next.acceptTerms = "You must accept the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    const result = await authService.register(form);
    setLoading(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthShell
      wide
      eyebrow="Get started"
      title="Register your business"
      description="Create your TradeSucro account, then tell us about your business."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold-dim hover:text-gold-bright transition-colors">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <TextInput
          label="Full name"
          placeholder="Priya Nair"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          error={errors.fullName}
          autoFocus
        />

        <EmailInput
          label="Work email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />

        <TextInput
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          value={form.mobile}
          onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          error={errors.mobile}
        />

        <div>
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <PasswordStrengthMeter password={form.password} />
        </div>

        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={form.acceptTerms}
          onChange={(e) => setForm((f) => ({ ...f, acceptTerms: e.target.checked }))}
        />
        {errors.acceptTerms && <p className="text-xs text-danger -mt-3">{errors.acceptTerms}</p>}

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Create account <ArrowRight size={16} />
        </Button>
      </form>
    </AuthShell>
  );
}
