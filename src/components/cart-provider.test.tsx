import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./cart-provider";
import type { Product } from "@/lib/data";
import React, { useState, useCallback } from "react";

// Mock useLocalStorage with proper React state to trigger re-renders
vi.mock("@/hooks/use-local-storage", () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: any) => {
    const [value, setValue] = useState(defaultValue);
    const setValueWrapped = useCallback((updater: any) => {
      setValue((prev: any) => {
        if (typeof updater === "function") return updater(prev);
        return updater;
      });
    }, []);
    const reset = useCallback(() => setValue(defaultValue), []);
    return [value, setValueWrapped, reset];
  }),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock user provider — CartProvider depends on useUser()
vi.mock("./user-provider", () => ({
  useUser: () => ({ user: { id: "test-user", name: "Test", email: "test@test.com" } }),
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

const sampleProduct: Product = {
  id: "phone-1",
  name: "Test Phone",
  description: "A test phone",
  price: 999,
  originalPrice: 1199,
  image: "/test.jpg",
  images: ["/test.jpg", "/test-2.jpg"],
  category: "phone",
  rating: 4.5,
  reviews: 100,
  tags: ["phone", "5g"],
  colors: ["#000000", "#ffffff"],
  badge: "Best Seller",
};

describe("CartProvider", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("provides empty cart initially", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds a product to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => { result.current.addToCart(sampleProduct); });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.name).toBe("Test Phone");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(999);
  });

  it("increments quantity when adding same product twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(1998);
  });

  it("removes a product from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => { result.current.addToCart(sampleProduct); });
    const itemId = result.current.items[0].cartItemId;

    act(() => { result.current.removeFromCart(itemId); });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => { result.current.addToCart(sampleProduct); });
    const itemId = result.current.items[0].cartItemId;

    act(() => { result.current.updateQuantity(itemId, 5); });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(4995);
  });

  it("removes item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => { result.current.addToCart(sampleProduct); });
    const itemId = result.current.items[0].cartItemId;

    act(() => { result.current.updateQuantity(itemId, 0); });

    expect(result.current.items).toHaveLength(0);
  });

  it("calculates totalPrice with multiple items", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    const product2: Product = { ...sampleProduct, id: "phone-2", name: "Phone 2", price: 599 };

    act(() => {
      result.current.addToCart(sampleProduct);  // 999
      result.current.addToCart(product2);         // 599
    });

    expect(result.current.totalPrice).toBe(1598);
  });
});
