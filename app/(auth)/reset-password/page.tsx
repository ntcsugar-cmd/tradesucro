"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { PasswordInput } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { authService } from "@/services/auth.service";
import { isStrongEnough } from "@/lib/utils/validation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "demo-token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isStrongEnough(password)) return setError("Use at least 8 characters, with a number or symbol.");
    if (password !== confirmPassword) return setError("Passwords don't match.");

    setLoading(true);
    const result = await authService.resetPassword({ token, password });
    setLoading(false);

    if (!result.success) return setError(result.message);
    setDone(true);
  }

  if (done) {
    return (
      <AuthShell eyebrow="Password reset" title="You're all set" description="Your password has been changed.">
        <div className="flex items-center justify-center py-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success-700">
            <CheckCircle2 size={26} />
          </span>
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={() => router.push("/login")}>
          Continue to log in <ArrowRight size={16} />
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
      description="Make it something you haven't used before on TradeSucro."
      footer={
        <Link href="/login" className="font-medium text-gold-dim hover:text-gold-bright transition-colors">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <div>
          <PasswordInput label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          <PasswordStrengthMeter password={password} />
        </div>

        <PasswordInput
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Reset password <ArrowRight size={16} />
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
