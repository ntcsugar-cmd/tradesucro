export interface ActivityItem {
  id: string;
  type: "offer_posted" | "requirement_matched" | "mill_verified" | "deal_confirmed";
  title: string;
  timestamp: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "offer_posted", title: "You posted a sell offer for 500 MT of S-30", timestamp: "2 hours ago" },
  { id: "a2", type: "requirement_matched", title: "Your buy requirement matched with Triveni Agro", timestamp: "Yesterday" },
  { id: "a3", type: "mill_verified", title: "Your mill profile was verified", timestamp: "3 days ago" },
];

/**
 * Dashboard Service (mock)
 * ------------------------------------------------------------------
 * Account-scoped activity feed. Profile completion moved to
 * profileService.getProfileCompletion() in v0.4 — it's computed from the
 * live CompanyProfile record, so completion state can't drift out of
 * sync with the profile itself the way a separately-tracked mock could.
 * No backend; see services/README.md for the intended integration pattern.
 */
export const dashboardService = {
  async getRecentActivity(): Promise<ActivityItem[]> {
    return MOCK_ACTIVITY;
  },
};
