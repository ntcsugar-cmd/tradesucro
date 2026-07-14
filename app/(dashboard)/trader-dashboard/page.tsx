import { redirect } from "next/navigation";

/**
 * The old Trader Workspace placeholder (v0.8) now forwards into the
 * real Trader Workspace built in v1.3. This keeps the Trader
 * workspace's defaultLandingPage (still "/trader-dashboard", set in
 * services/workspace.service.ts, which this task does not modify)
 * working correctly without touching that file — a trader logging in
 * lands here and is immediately sent on to the real Daily Trading Desk.
 */
export default function TraderDashboardRedirectPage() {
  redirect("/trader");
}
