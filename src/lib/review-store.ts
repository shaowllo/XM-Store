/**
 * Product review store — backed by localStorage.
 * Each product has its own review list, keyed by product ID.
 */

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export function getProductReviews(productId: string): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`xmstore-reviews-${productId}`);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

export function addReview(
  productId: string,
  userName: string,
  rating: number,
  text: string
): Review {
  const review: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId,
    userName,
    rating,
    text,
    createdAt: new Date().toISOString(),
  };
  const reviews = getProductReviews(productId);
  reviews.unshift(review);
  localStorage.setItem(`xmstore-reviews-${productId}`, JSON.stringify(reviews));
  return review;
}

export function getProductAverageRating(productId: string): number {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
