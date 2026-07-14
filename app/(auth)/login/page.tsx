"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { EmailInput, PasswordInput } from "@/components/forms/Input";
import { Checkbox } from "@/components/forms/Checkbox";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { authService } from "@/services/auth.service";
import { workspaceService } from "@/services/workspace.service";
import { isValidEmail } from "@/lib/utils/validation";

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

const INITIAL_STATE: FormState = { email: "", password: "", remember: false };

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.email) next.email = "Email is required.";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    const result = await authService.login(form);
    setLoading(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }

    if (!result.data?.onboardingComplete) {
      router.push("/onboarding");
      return;
    }
    const destination = await workspaceService.resolvePostLoginDestination();
    router.push(destination);
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to TradeSucro"
      description="Access live market data, your offers, and your deals."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="font-medium text-gold-dim hover:text-gold-bright transition-colors">
            Register your business
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <EmailInput
          label="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          autoFocus
        />

        <div>
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Checkbox
          label="Keep me signed in"
          checked={form.remember}
          onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Log in <ArrowRight size={16} />
        </Button>
      </form>
    </AuthShell>
  );
}
