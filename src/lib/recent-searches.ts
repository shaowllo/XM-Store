/**
 * Recent search terms — stored in localStorage.
 */
const STORAGE_KEY = "xmstore-recent-searches";
const MAX_ITEMS = 6;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const list = getRecentSearches().filter((s) => s !== query);
    list.unshift(query.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {}
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
