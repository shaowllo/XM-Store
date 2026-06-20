import { describe, it, expect } from "vitest";
import { products, heroSlides, categories } from "./data";

describe("products data", () => {
  it("should have products", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("each product should have required fields", () => {
    products.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.tags).toBeInstanceOf(Array);
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.reviews).toBeGreaterThanOrEqual(0);
    });
  });

  it("product prices should be reasonable", () => {
    products.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
      if (product.originalPrice) {
        expect(product.originalPrice).toBeGreaterThanOrEqual(product.price);
      }
    });
  });

  it("product images should be valid URLs", () => {
    products.forEach((product) => {
      expect(product.image).toMatch(/^https:\/\//);
      if (product.images) {
        product.images.forEach((img) => {
          expect(img).toMatch(/^https:\/\//);
        });
      }
    });
  });

  it("product colors should be valid hex codes when present", () => {
    products.forEach((product) => {
      if (product.colors) {
        product.colors.forEach((color) => {
          expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      }
    });
  });
});

describe("heroSlides data", () => {
  it("should have hero slides", () => {
    expect(heroSlides.length).toBeGreaterThan(0);
  });

  it("each slide should have required fields", () => {
    heroSlides.forEach((slide) => {
      expect(slide.id).toBeDefined();
      expect(slide.title).toBeDefined();
      expect(slide.subtitle).toBeDefined();
      expect(slide.description).toBeDefined();
      expect(slide.image).toBeDefined();
      expect(slide.color).toBeDefined();
      expect(slide.productId).toBeDefined();
    });
  });

  it("slide images should be valid URLs", () => {
    heroSlides.forEach((slide) => {
      expect(slide.image).toMatch(/^https:\/\//);
    });
  });

  it("slide productIds should reference existing products", () => {
    const productIds = products.map((p) => p.id);
    heroSlides.forEach((slide) => {
      expect(productIds).toContain(slide.productId);
    });
  });
});

describe("categories data", () => {
  it("should have categories including 'all'", () => {
    const allCategory = categories.find((c) => c.id === "all");
    expect(allCategory).toBeDefined();
    expect(allCategory?.name).toBe("All");
  });

  it("each category should have id and name", () => {
    categories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
    });
  });

  it("category ids should match product categories", () => {
    const categoryIds = categories.map((c) => c.id);
    products.forEach((product) => {
      expect(categoryIds).toContain(product.category);
    });
  });
});
