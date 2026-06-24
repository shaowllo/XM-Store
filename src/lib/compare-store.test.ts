import { describe, it, expect, beforeEach } from "vitest";
import { getCompareList, toggleCompare, clearCompare, isInCompare } from "./compare-store";

const STORAGE_KEY = "xmstore-compare";

beforeEach(() => {
  localStorage.clear();
});

describe("compare-store", () => {
  describe("getCompareList", () => {
    it("returns empty array when no compare data exists", () => {
      expect(getCompareList()).toEqual([]);
    });

    it("returns parsed compare list from localStorage", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["product-1", "product-2"]));
      expect(getCompareList()).toEqual(["product-1", "product-2"]);
    });
  });

  describe("toggleCompare", () => {
    it("adds a product to the compare list", () => {
      const result = toggleCompare("product-1");
      expect(result.added).toBe(true);
      expect(result.list).toContain("product-1");
      expect(getCompareList()).toContain("product-1");
    });

    it("removes a product already in the compare list", () => {
      toggleCompare("product-1");
      const result = toggleCompare("product-1");
      expect(result.added).toBe(false);
      expect(result.list).not.toContain("product-1");
    });

    it("prevents adding more than 4 products", () => {
      toggleCompare("product-1");
      toggleCompare("product-2");
      toggleCompare("product-3");
      toggleCompare("product-4");
      // Try to add a 5th
      const result = toggleCompare("product-5");
      expect(result.added).toBe(false);
      expect(result.list).toHaveLength(4);
    });

    it("dispatches compare-update event", () => {
      let eventFired = false;
      window.addEventListener("compare-update", () => { eventFired = true; });
      toggleCompare("product-1");
      expect(eventFired).toBe(true);
    });
  });

  describe("clearCompare", () => {
    it("clears all products from the compare list", () => {
      toggleCompare("product-1");
      toggleCompare("product-2");
      clearCompare();
      expect(getCompareList()).toEqual([]);
    });
  });

  describe("isInCompare", () => {
    it("returns true when product is in compare list", () => {
      toggleCompare("product-1");
      expect(isInCompare("product-1")).toBe(true);
    });

    it("returns false when product is not in compare list", () => {
      expect(isInCompare("product-nonexistent")).toBe(false);
    });
  });
});
