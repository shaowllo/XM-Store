"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useUser } from "./user-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { CartItem } from "./cart-provider";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], totalPrice: number, totalItems: number) => void;
  clearOrders: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const ORDERS_KEY = `xmstore-orders-${userId}`;

  const [orders, setOrders] = useLocalStorage<Order[]>(ORDERS_KEY, []);

  const addOrder = useCallback((items: CartItem[], totalPrice: number, totalItems: number) => {
    const order: Order = {
      id: `order-${Date.now()}`,
      items,
      totalPrice,
      totalItems,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
  }, [setOrders]);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, [setOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updates: Partial<Order> = { status };
        if (status === "shipped") updates.shippedAt = new Date().toISOString();
        if (status === "delivered") updates.deliveredAt = new Date().toISOString();
        return { ...order, ...updates };
      })
    );
  }, [setOrders]);

  const contextValue = useMemo(
    () => ({ orders, addOrder, clearOrders, updateOrderStatus }),
    [orders, addOrder, clearOrders, updateOrderStatus]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
}
