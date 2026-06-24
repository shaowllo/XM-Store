import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { OrderProvider, useOrders } from "./order-provider";
import React, { useState, useCallback } from "react";

// Mock useLocalStorage with proper React state
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

// Mock user provider
vi.mock("./user-provider", () => ({
  useUser: () => ({ user: { id: "test-user" } }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

describe("OrderProvider", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("provides empty orders initially", () => {
    const { result } = renderHook(() => useOrders(), { wrapper: OrderProvider });
    expect(result.current.orders).toEqual([]);
  });

  it("adds an order", () => {
    const { result } = renderHook(() => useOrders(), { wrapper: OrderProvider });
    const makeItem = (id: string, name: string, price: number, qty: number = 1) => ({
      cartItemId: `${id}--default`,
      product: { id, name, price } as any,
      quantity: qty,
    });

    act(() => {
      result.current.addOrder(
        [makeItem("phone-1", "Test Phone", 999, 2)],
        1998, 2, "cod",
        { fullName: "Test User", phone: "1234567890", street: "123 Test St",
          city: "Test City", state: "TS", zip: "12345" }
      );
    });

    expect(result.current.orders).toHaveLength(1);
    const order = result.current.orders[0];
    expect(order.items).toHaveLength(1);
    expect(order.items[0].product.name).toBe("Test Phone");
    expect(order.items[0].quantity).toBe(2);
    expect(order.totalPrice).toBe(1998);
    expect(order.status).toBe("cod_confirmed");
    expect(order.id).toBeTruthy();
  });

  it("adds orders in chronological order (newest last)", async () => {
    const { result } = renderHook(() => useOrders(), { wrapper: OrderProvider });
    const makeItem = (id: string, name: string, price: number) => ({
      cartItemId: `${id}--default`,
      product: { id, name, price } as any,
      quantity: 1,
    });

    act(() => {
      result.current.addOrder([makeItem("p1", "P1", 100)], 100, 1, "cod",
        { fullName: "U1", phone: "123", street: "S1", city: "C1", state: "S", zip: "Z" }
      );
    });
    const firstOrderId = result.current.orders[0].id;

    // Small delay to ensure different timestamp
    await new Promise((r) => setTimeout(r, 5));

    act(() => {
      result.current.addOrder([makeItem("p2", "P2", 200)], 200, 1, "cod",
        { fullName: "U2", phone: "456", street: "S2", city: "C2", state: "S", zip: "Z" }
      );
    });

    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].id).not.toBe(firstOrderId);
    expect(result.current.orders[1].id).toBe(firstOrderId);
  });

  it("calculates total correctly for multiple items", () => {
    const { result } = renderHook(() => useOrders(), { wrapper: OrderProvider });

    act(() => {
      result.current.addOrder(
        [
          { cartItemId: "p1--default", product: { id: "p1", name: "P1", price: 100 } as any, quantity: 3 },
          { cartItemId: "p2--default", product: { id: "p2", name: "P2", price: 50 } as any, quantity: 2 },
        ],
        400, 5, "cod",
        { fullName: "U1", phone: "123", street: "S1", city: "C1", state: "S", zip: "Z" }
      );
    });

    expect(result.current.orders[0].totalPrice).toBe(400);
  });
});
