"use client";

import { PackagePlus, ClipboardPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/**
 * QuickActions — the two primary CTAs on the dashboard. Both are mocked
 * (no backend / no post-creation flow yet) — they surface a toast so the
 * interaction feels real, and are the natural place to wire real
 * "create offer/requirement" routes into later.
 */
export function QuickActions() {
  const { toast } = useToast();

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => toast({ variant: "info", title: "Coming soon", description: "Posting buy requirements isn't wired up yet." })}
        >
          <ClipboardPlus size={16} /> Post Buy Requirement
        </Button>
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => toast({ variant: "info", title: "Coming soon", description: "Posting sell offers isn't wired up yet." })}
        >
          <PackagePlus size={16} /> Post Sell Offer
        </Button>
      </CardBody>
    </Card>
  );
}
