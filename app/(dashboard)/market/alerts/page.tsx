"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { useToast } from "@/components/ui/Toast";
import { AlertRuleForm, AlertRulesList, AlertNotificationsList } from "@/components/market-intel";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { AlertRule, AlertNotification } from "@/lib/types/marketIntelligence";

export default function SmartAlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const { toast } = useToast();

  async function load() {
    const [r, n] = await Promise.all([marketIntelligenceService.getAlertRules(), marketIntelligenceService.getAlertNotifications()]);
    setRules(r);
    setNotifications(n);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(rule: Omit<AlertRule, "id" | "createdAt" | "active">) {
    await marketIntelligenceService.createAlertRule(rule);
    await load();
    toast({ variant: "success", title: "Alert rule created" });
  }

  async function handleToggle(id: string, active: boolean) {
    await marketIntelligenceService.toggleAlertRule(id, active);
    await load();
  }

  async function handleDelete(id: string) {
    await marketIntelligenceService.deleteAlertRule(id);
    await load();
    toast({ variant: "info", title: "Alert rule removed" });
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Smart Alerts" }]} className="mb-5" />
      <PageHeader title="Smart Alerts" description="Get notified on price moves, tenders, and offers you care about." />

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <AlertRuleForm onCreate={handleCreate} />
        </GridItem>
        <GridItem>
          <div className="space-y-6">
            <AlertRulesList rules={rules} onToggle={handleToggle} onDelete={handleDelete} />
            <AlertNotificationsList notifications={notifications} />
          </div>
        </GridItem>
      </Grid>
    </>
  );
}
