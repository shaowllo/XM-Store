"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useUser } from "./user-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Order, OrderStatus, ShippingAddress } from "@/lib/types";
import type { CartItem } from "./cart-provider";

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], totalPrice: number, totalItems: number, paymentMethod?: 'cod', shippingAddress?: ShippingAddress) => void;
  clearOrders: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateTrackingNumber: (orderId: string, trackingNumber: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const ORDERS_KEY = `xmstore-orders-${userId}`;

  const [orders, setOrders] = useLocalStorage<Order[]>(ORDERS_KEY, []);

  const addOrder = useCallback((
    items: CartItem[],
    totalPrice: number,
    totalItems: number,
    paymentMethod?: 'cod',
    shippingAddress?: ShippingAddress
  ) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items,
      totalPrice,
      totalItems,
      status: paymentMethod === 'cod' ? 'cod_confirmed' as OrderStatus : 'pending' as OrderStatus,
      createdAt: new Date().toISOString(),
      paymentMethod,
      shippingAddress,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
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

  const updateTrackingNumber = useCallback((orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, trackingNumber, status: 'out_for_delivery' as OrderStatus }
          : order
      )
    );
  }, [setOrders]);

  const contextValue = useMemo(
    () => ({ orders, addOrder, clearOrders, updateOrderStatus, updateTrackingNumber }),
    [orders, addOrder, clearOrders, updateOrderStatus, updateTrackingNumber]
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
