"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem } from "./cart-provider";

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], totalPrice: number, totalItems: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = "xmstore-orders";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load orders from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const addOrder = useCallback((items: CartItem[], totalPrice: number, totalItems: number) => {
    const order: Order = {
      id: `order-${Date.now()}`,
      items,
      totalPrice,
      totalItems,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
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
