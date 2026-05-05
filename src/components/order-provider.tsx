"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "./user-provider";
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

  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      try {
        const saved = localStorage.getItem(ORDERS_KEY);
        if (saved) {
          setOrders(JSON.parse(saved));
        }
      } catch {
        // Silently ignore localStorage parse errors
      }
      setIsHydrated(true);
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [ORDERS_KEY]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated, ORDERS_KEY]);

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
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

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
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, updateOrderStatus }}>
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
