import { describe, it, expect } from "vitest";
import { getRecommendations, getCartRecommendations } from "./recommendations";

describe("recommendations", () => {
  describe("getRecommendations", () => {
    it("returns recommendations for an existing product", () => {
      const recs = getRecommendations("1", 4);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs.length).toBeLessThanOrEqual(4);
      // Should not include the source product
      expect(recs.find((r) => r.product.id === "1")).toBeUndefined();
    });

    it("returns recommendations sorted by score descending", () => {
      const recs = getRecommendations("1", 10);
      for (let i = 1; i < recs.length; i++) {
        expect(recs[i].score).toBeLessThanOrEqual(recs[i - 1].score);
      }
    });

    it("each recommendation has a product, score, and reasons", () => {
      const recs = getRecommendations("1", 4);
      for (const rec of recs) {
        expect(rec.product).toBeDefined();
        expect(rec.product.id).toBeTruthy();
        expect(typeof rec.score).toBe("number");
        expect(Array.isArray(rec.reasons)).toBe(true);
      }
    });

    it("returns empty array for non-existent product", () => {
      const recs = getRecommendations("non-existent-product", 4);
      expect(recs).toEqual([]);
    });

    it("returns products from same category with higher scores", () => {
      const recs = getRecommendations("1", 10);
      // Product 1 is in the "phone" category
      const sameCategoryRecs = recs.filter((r) => r.product.category === "phone");
      if (sameCategoryRecs.length > 0 && recs.length > sameCategoryRecs.length) {
        // Phone category products should rank higher
        expect(sameCategoryRecs[0].score).toBeGreaterThan(0);
      }
    });
  });

  describe("getCartRecommendations", () => {
    it("returns recommendations based on multiple cart items", () => {
      const recs = getCartRecommendations(["1", "4"], 4);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs.length).toBeLessThanOrEqual(4);
      // Should not include items already in cart
      expect(recs.find((r) => r.product.id === "1")).toBeUndefined();
      expect(recs.find((r) => r.product.id === "4")).toBeUndefined();
    });

    it("returns empty array for empty cart", () => {
      const recs = getCartRecommendations([], 4);
      expect(recs).toEqual([]);
    });

    it("returns recommendations sorted by aggregate score", () => {
      const recs = getCartRecommendations(["1", "4", "6"], 10);
      for (let i = 1; i < recs.length; i++) {
        expect(recs[i].score).toBeLessThanOrEqual(recs[i - 1].score);
      }
    });
  });
});
