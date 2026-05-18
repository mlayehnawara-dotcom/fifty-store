const RECENT_PRODUCTS_KEY = 'fifty-store-recent-products-v1';
const MAX_RECENT = 8;

export function readRecentlyViewed(): number[] {
  try {
    const raw = localStorage.getItem(RECENT_PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number').slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId: number): void {
  const current = readRecentlyViewed().filter((id) => id !== productId);
  const next = [productId, ...current].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(next));
}
