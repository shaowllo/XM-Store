/**
 * Simple compare list store backed by localStorage.
 * No React context needed — components read/write independently.
 * Max 4 products for a meaningful side-by-side comparison.
 */

const STORAGE_KEY = "xmstore-compare";
const MAX_ITEMS = 4;

export function getCompareList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleCompare(productId: string): { list: string[]; added: boolean } {
  const list = getCompareList();
  const idx = list.indexOf(productId);
  let added: boolean;
  if (idx >= 0) {
    list.splice(idx, 1);
    added = false;
  } else {
    if (list.length >= MAX_ITEMS) return { list, added: false };
    list.push(productId);
    added = true;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // Dispatch custom event so other components (CompareBar) can react
  window.dispatchEvent(new Event("compare-update"));
  return { list, added };
}

export function clearCompare(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("compare-update"));
}

export function isInCompare(productId: string): boolean {
  return getCompareList().includes(productId);
}
