"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "./user-provider";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const WISHLIST_KEY = `xmstore-wishlist-${userId}`;

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      try {
        const saved = localStorage.getItem(WISHLIST_KEY);
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch {
        // Silently ignore localStorage parse errors
      }
      setIsHydrated(true);
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [WISHLIST_KEY]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated, WISHLIST_KEY]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
