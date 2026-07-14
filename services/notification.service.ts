import type { PortalNotification } from "@/lib/types/millOperations";

const NETWORK_DELAY_MS = 250;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const NOTIFICATIONS: PortalNotification[] = [
  { id: "ntf-1", category: "offer_expiring", title: "Offer expiring today", description: "MO-2026-00032 (S30, 400 MT) is valid till today.", timestamp: "1 hour ago", read: false },
  { id: "ntf-2", category: "tender_closing", title: "Tender closing soon", description: "TN-2026-1002 bidding closes in 6 hours.", timestamp: "2 hours ago", read: false },
  { id: "ntf-3", category: "low_inventory", title: "Low inventory alert", description: "ICUMSA 45 available stock has dropped below 150 MT.", timestamp: "4 hours ago", read: false },
  { id: "ntf-4", category: "dispatch_delay", title: "Dispatch delayed", description: "DSP-2003 to Britannia Ingredients is running behind schedule.", timestamp: "6 hours ago", read: true },
  { id: "ntf-5", category: "new_interest", title: "New interest received", description: "Triveni Agro Industries expressed interest in your M30 offer.", timestamp: "Yesterday", read: true },
];

/** Notification Service (mock) — no backend, static illustrative feed with local read/unread state. */
export const notificationService = {
  async getNotifications(): Promise<PortalNotification[]> {
    return delay([...NOTIFICATIONS]);
  },

  async getUnreadCount(): Promise<number> {
    return delay(NOTIFICATIONS.filter((n) => !n.read).length);
  },

  async markAsRead(id: string): Promise<void> {
    const item = NOTIFICATIONS.find((n) => n.id === id);
    if (item) item.read = true;
    return delay(undefined, 150);
  },
};
