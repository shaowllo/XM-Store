/**
 * Simulated email notification store.
 * Records notifications sent to users so they can be viewed later.
 */

export interface Notification {
  id: string;
  email: string;
  type: "order_confirmation" | "shipping_update" | "stock_alert";
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
}

const STORAGE_KEY = "xmstore-notifications";

export function sendNotification(notif: Omit<Notification, "id" | "sentAt" | "read">): Notification {
  const n: Notification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sentAt: new Date().toISOString(),
    read: false,
  };
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.unshift(n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {}
  return n;
}

export function getNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function markRead(id: string): void {
  try {
    const list = getNotifications();
    const n = list.find((x) => x.id === id);
    if (n) n.read = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}
