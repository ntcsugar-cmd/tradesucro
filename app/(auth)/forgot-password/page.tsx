"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { EmailInput } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { authService } from "@/services/auth.service";
import { isValidEmail } from "@/lib/utils/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Enter the email on your account.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");

    setLoading(true);
    const result = await authService.forgotPassword({ email });
    setLoading(false);

    if (!result.success) return setError(result.message);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent"
        description={`If an account exists for ${email}, we've sent a link to reset your password.`}
        footer={
          <Link href="/login" className="font-medium text-gold-dim hover:text-gold-bright transition-colors">
            Back to log in
          </Link>
        }
      >
        <div className="flex items-center justify-center py-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success-700">
            <MailCheck size={26} />
          </span>
        </div>
        <Button variant="outline" size="lg" fullWidth onClick={() => setSent(false)}>
          Use a different email
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password?"
      description="Enter the email on your account and we'll send you a reset link."
      footer={
        <Link href="/login" className="font-medium text-gold-dim hover:text-gold-bright transition-colors">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <EmailInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={undefined} autoFocus />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Send reset link <ArrowRight size={16} />
        </Button>
      </form>
    </AuthShell>
  );
}
