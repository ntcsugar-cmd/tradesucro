"use client";

import { Bell, Globe, Moon } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { ToggleSwitch } from "@/components/forms/Switch";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [tenderAlerts, setTenderAlerts] = useState(true);
  const [dispatchAlerts, setDispatchAlerts] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Breadcrumb items={[{ label: "Settings" }]} className="mb-5" />
      <PageHeader title="Settings" description="Notification preferences and appearance." />

      <div className="max-w-xl space-y-6">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-ink-faint shrink-0" />
              <ToggleSwitch checked={priceAlerts} onChange={setPriceAlerts} label="Price alerts" description="Notify when today's price changes" />
            </div>
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-ink-faint shrink-0" />
              <ToggleSwitch checked={tenderAlerts} onChange={setTenderAlerts} label="Tender alerts" description="Notify when a tender is closing soon" />
            </div>
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-ink-faint shrink-0" />
              <ToggleSwitch checked={dispatchAlerts} onChange={setDispatchAlerts} label="Dispatch alerts" description="Notify on dispatch delays" />
            </div>
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-3">
              <Moon size={16} className="text-ink-faint shrink-0" />
              <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} label="Dark mode" description="Applies to the dashboard shell" />
            </div>
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Region</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-3 text-[13px] text-ink-soft">
              <Globe size={16} className="text-ink-faint shrink-0" />
              India · English · INR (₹)
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
