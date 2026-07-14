"use client";

import { useEffect, useState, FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { TextInput } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import type { AuthResult } from "@/lib/types/auth";

const RESEND_COOLDOWN_S = 30;

interface VerifyCodeFormProps {
  title: string;
  description: string;
  onVerify: (code: string) => Promise<AuthResult>;
  onResend: () => Promise<AuthResult>;
  onVerified: () => void;
  successTitle: string;
  successDescription: string;
  continueLabel: string;
}

/** VerifyCodeForm — shared 6-digit code entry with resend cooldown, reused by verify-email and verify-mobile. */
export function VerifyCodeForm({
  title,
  description,
  onVerify,
  onResend,
  onVerified,
  successTitle,
  successDescription,
  continueLabel,
}: VerifyCodeFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) return setError("Enter the 6-digit code.");

    setLoading(true);
    const result = await onVerify(code);
    setLoading(false);

    if (!result.success) return setError(result.message);
    setVerified(true);
  }

  async function handleResend() {
    setResending(true);
    await onResend();
    setResending(false);
    setCooldown(RESEND_COOLDOWN_S);
  }

  if (verified) {
    return (
      <AuthShell eyebrow="Verified" title={successTitle} description={successDescription}>
        <div className="flex items-center justify-center py-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success-700">
            <CheckCircle2 size={26} />
          </span>
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={onVerified}>
          {continueLabel} <ArrowRight size={16} />
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Verify to continue" title={title} description={description}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <TextInput
          label="Verification code"
          placeholder="123456"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="text-center tracking-[0.5em] font-mono text-lg"
          autoFocus
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Verify <ArrowRight size={16} />
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={cooldown > 0}
            loading={resending}
            onClick={handleResend}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
