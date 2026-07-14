"use client";

import { useRouter } from "next/navigation";
import { VerifyCodeForm } from "@/components/auth/VerifyCodeForm";
import { authService } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <VerifyCodeForm
      title="Verify your email"
      description="We've sent a 6-digit code to your email address. Enter it below to continue."
      onVerify={(code) => authService.verifyEmail({ code })}
      onResend={() => authService.resendCode()}
      onVerified={() => router.push("/verify-mobile")}
      successTitle="Email verified"
      successDescription="Next, let's verify your mobile number."
      continueLabel="Verify mobile number"
    />
  );
}
