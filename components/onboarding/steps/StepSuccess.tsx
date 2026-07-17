"use client";

import { PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StepSuccessProps {
  onGoToDashboard: () => void;
  loading?: boolean;
}

export function StepSuccess({ onGoToDashboard, loading = false }: StepSuccessProps) {
  return (
    <div className="text-center py-4">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
        <PartyPopper size={30} />
      </span>
      <h2 className="mt-6 font-display text-2xl font-medium text-charcoal dark:text-white">Welcome to TradeSucro</h2>
      <p className="mt-2 text-[13.5px] text-ink-soft dark:text-white/50 max-w-sm mx-auto">
        Your business profile is set up. You can now post offers, browse requirements, and track live sugar prices.
      </p>
      <Button variant="primary" size="lg" className="mt-8" loading={loading} onClick={onGoToDashboard}>
        Go to Dashboard <ArrowRight size={16} />
      </Button>
    </div>
  );
}
