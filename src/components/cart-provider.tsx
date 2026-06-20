"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useUser } from "./user-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Product } from "@/lib/data";
import { useTranslations } from "next-intl";

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const CART_STORAGE_KEY = `xmstore-cart-${userId}`;
  const t = useTranslations("cart");

  const [items, setItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, selectedColor?: string, quantity: number = 1) => {
    const cartItemId = `${product.id}--${selectedColor || "default"}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, quantity, selectedColor }];
    });
    setIsCartOpen(true);
    toast.success(t("itemAdded", { name: product.name }));
  }, [setItems]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.cartItemId === cartItemId);
      if (item) {
        toast.info(t("itemRemoved", { name: item.product.name }));
      }
      return prev.filter((item) => item.cartItemId !== cartItemId);
    });
  }, [setItems]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  }, [setItems]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
