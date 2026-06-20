/**
 * Recently viewed products — stored in localStorage.
 * Captures product IDs when visiting product detail pages.
 */

const STORAGE_KEY = "xmstore-recently-viewed";
const MAX_ITEMS = 8;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getRecentlyViewed();
    // Remove if already exists (will be moved to front)
    const filtered = list.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    // Silently ignore
  }
}
