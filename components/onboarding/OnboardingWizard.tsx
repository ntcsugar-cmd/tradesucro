"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { OnboardingStepper } from "./OnboardingStepper";
import { StepBusinessType } from "./steps/StepBusinessType";
import { StepCompanyDetails } from "./steps/StepCompanyDetails";
import { StepBusinessInfo } from "./steps/StepBusinessInfo";
import { StepAddress } from "./steps/StepAddress";
import { StepPreferences } from "./steps/StepPreferences";
import { StepDocuments } from "./steps/StepDocuments";
import { StepReview } from "./steps/StepReview";
import { StepSuccess } from "./steps/StepSuccess";

import { EMPTY_ONBOARDING_FORM, type OnboardingFormData } from "@/lib/types/onboarding";
import { onboardingService } from "@/services/onboarding.service";
import { workspaceService } from "@/services/workspace.service";
import { isValidGSTIN, isValidPAN, isValidCIN, isValidIEC, isValidPincode, isRequired } from "@/lib/utils/validation";

const STEP_LABELS = [
  "Business Type",
  "Company Details",
  "Business Info",
  "Address",
  "Preferences",
  "Documents",
  "Review",
  "Success",
];

const TOTAL_STEPS = STEP_LABELS.length;

type StepErrors = Record<string, string>;

function validateStep(step: number, data: OnboardingFormData): StepErrors {
  const errors: StepErrors = {};

  switch (step) {
    case 1:
      if (!isRequired(data.businessType)) errors.businessType = "Select a business type to continue.";
      break;
    case 2:
      if (!isRequired(data.companyName)) errors.companyName = "Company name is required.";
      if (!isValidGSTIN(data.gstin)) errors.gstin = "Enter a valid 15-character GSTIN.";
      if (!isValidPAN(data.pan)) errors.pan = "Enter a valid 10-character PAN.";
      if (data.cin && !isValidCIN(data.cin)) errors.cin = "Enter a valid 21-character CIN, or leave it blank.";
      if (data.iec && !isValidIEC(data.iec)) errors.iec = "Enter a valid 10-character IEC, or leave it blank.";
      break;
    case 3:
      if (!isRequired(data.yearsInBusiness)) errors.yearsInBusiness = "Years in business is required.";
      if (!isRequired(data.annualTurnover)) errors.annualTurnover = "Select an annual turnover range.";
      if (!isRequired(data.monthlyTradingVolume)) errors.monthlyTradingVolume = "Select a monthly trading volume range.";
      if (data.statesServed.length === 0) errors.statesServed = "Select at least one state you serve.";
      break;
    case 4:
      if (!isRequired(data.state)) errors.state = "State is required.";
      if (!isRequired(data.city)) errors.city = "City is required.";
      if (!isValidPincode(data.pinCode)) errors.pinCode = "Enter a valid 6-digit PIN code.";
      if (!isRequired(data.fullAddress)) errors.fullAddress = "Full address is required.";
      break;
    case 5: {
      const anySelected = Object.values(data.preferences).some(Boolean);
      if (!anySelected) errors.preferences = "Select at least one business preference.";
      break;
    }
    default:
      break;
  }

  return errors;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingFormData>(EMPTY_ONBOARDING_FORM);
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState(false);

  // Restore an in-progress draft after mount (client-only — avoids an SSR
  // hydration mismatch, since the server always renders the empty form).
  useEffect(() => {
    const draft = onboardingService.loadDraft();
    if (draft) {
      setData(draft.data);
      setStep(draft.step);
      setRestoredNotice(true);
    }
  }, []);

  // Persist every change, skipping the very first effect run so we don't
  // immediately overwrite a just-loaded draft with the pre-restore state,
  // and skipping entirely once submission succeeds (the draft's job is
  // done — see handleSubmit, which clears it).
  const skipNextSave = useRef(true);
  const submittedRef = useRef(false);
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (submittedRef.current) return;
    onboardingService.saveDraft({ step, data });
  }, [step, data]);

  function patch(update: Partial<OnboardingFormData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function handleNext() {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleEditStep(target: number) {
    setErrors({});
    setStep(target);
  }

  async function handleSubmit() {
    setSubmitError(null);
    setSubmitting(true);
    const result = await onboardingService.submitOnboarding(data);
    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }
    submittedRef.current = true;
    setStep(8);
  }

  async function handleGoToDashboard() {
    setNavigating(true);
    const destination = await workspaceService.resolvePostLoginDestination();
    router.push(destination);
  }

  const isReviewStep = step === 7;
  const isSuccessStep = step === 8;

  return (
    <div className="w-full max-w-2xl">
      {!isSuccessStep && (
        <div className="mb-8">
          <OnboardingStepper steps={STEP_LABELS.slice(0, 7)} currentStep={step} />
        </div>
      )}

      <Card padding="lg" className="shadow-card">
        <CardBody>
          {restoredNotice && !isSuccessStep && (
            <Alert variant="info" dismissible className="mb-6">
              We restored your progress from where you left off.
            </Alert>
          )}
          {submitError && (
            <Alert variant="danger" className="mb-6">
              {submitError}
            </Alert>
          )}

          {step === 1 && <StepBusinessType data={data} onChange={patch} error={errors.businessType} />}
          {step === 2 && (
            <StepCompanyDetails
              data={data}
              onChange={patch}
              errors={{ companyName: errors.companyName, gstin: errors.gstin, pan: errors.pan, cin: errors.cin, iec: errors.iec }}
            />
          )}
          {step === 3 && (
            <StepBusinessInfo
              data={data}
              onChange={patch}
              errors={{
                yearsInBusiness: errors.yearsInBusiness,
                annualTurnover: errors.annualTurnover,
                monthlyTradingVolume: errors.monthlyTradingVolume,
                statesServed: errors.statesServed,
              }}
            />
          )}
          {step === 4 && (
            <StepAddress
              data={data}
              onChange={patch}
              errors={{ state: errors.state, city: errors.city, pinCode: errors.pinCode, fullAddress: errors.fullAddress }}
            />
          )}
          {step === 5 && <StepPreferences data={data} onChange={patch} error={errors.preferences} />}
          {step === 6 && <StepDocuments data={data} onChange={patch} />}
          {isReviewStep && <StepReview data={data} onEditStep={handleEditStep} />}
          {isSuccessStep && <StepSuccess onGoToDashboard={handleGoToDashboard} loading={navigating} />}

          {!isSuccessStep && (
            <div className="mt-8 pt-6 border-t border-line dark:border-white/10 flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft size={16} /> Back
              </Button>

              {isReviewStep ? (
                <Button variant="primary" size="md" loading={submitting} onClick={handleSubmit}>
                  Submit & finish
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={handleNext}>
                  Continue <ArrowRight size={16} />
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
