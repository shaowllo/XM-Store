import { products, type Product } from "./data";

/**
 * Simple product recommendation engine using weighted similarity.
 *
 * Factors (weighted):
 * - Category match (40%) — same category = strong signal
 * - Tag overlap (35%) — Jaccard similarity on tags
 * - Price proximity (25%) — normalized inverse absolute difference
 */

export interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function priceSimilarity(priceA: number, priceB: number): number {
  const maxPrice = Math.max(priceA, priceB);
  if (maxPrice === 0) return 0;
  return 1 - Math.abs(priceA - priceB) / maxPrice;
}

/**
 * Get top-N product recommendations for a given product.
 * Excludes the product itself and returns items sorted by score descending.
 */
export function getRecommendations(
  productId: string,
  maxResults: number = 4
): RecommendationScore[] {
  const source = products.find((p) => p.id === productId);
  if (!source) return [];

  const candidates = products.filter((p) => p.id !== productId);

  const scored = candidates.map((candidate) => {
    const categoryScore = source.category === candidate.category ? 1 : 0;
    const tagScore = jaccardSimilarity(source.tags, candidate.tags);
    const priceScore = priceSimilarity(source.price, candidate.price);

    const total =
      categoryScore * 0.4 + tagScore * 0.35 + priceScore * 0.25;

    const reasons: string[] = [];
    if (categoryScore > 0) reasons.push("Same category");
    if (tagScore > 0.3) reasons.push("Similar features");
    if (priceScore > 0.8) reasons.push("Similar price range");

    return { product: candidate, score: total, reasons };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Get recommendations based on a list of cart items.
 * Aggregates scores across all items in the cart, excluding items already in cart.
 */
export function getCartRecommendations(
  cartProductIds: string[],
  maxResults: number = 4
): RecommendationScore[] {
  if (cartProductIds.length === 0) return [];

  const cartSet = new Set(cartProductIds);
  const allScores = new Map<string, RecommendationScore>();

  for (const id of cartProductIds) {
    const recs = getRecommendations(id, maxResults * 2);
    for (const rec of recs) {
      if (cartSet.has(rec.product.id)) continue;
      const existing = allScores.get(rec.product.id);
      if (existing) {
        existing.score += rec.score * 0.6; // Diminish repeated
        existing.reasons.push(...rec.reasons);
      } else {
        allScores.set(rec.product.id, { ...rec, score: rec.score });
      }
    }
  }

  return [...allScores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
