"use client";

import { useRouter } from "next/navigation";
import { VerifyCodeForm } from "@/components/auth/VerifyCodeForm";
import { authService } from "@/services/auth.service";

export default function VerifyMobilePage() {
  const router = useRouter();

  return (
    <VerifyCodeForm
      title="Verify your mobile number"
      description="We've sent a 6-digit code by SMS. Enter it below to continue."
      onVerify={(code) => authService.verifyMobile({ code })}
      onResend={() => authService.resendCode()}
      onVerified={() => router.push("/onboarding")}
      successTitle="Mobile verified"
      successDescription="You're verified — let's set up your business."
      continueLabel="Start onboarding"
    />
  );
}
