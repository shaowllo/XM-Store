"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "./user-provider";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  minOrderAmount: number;
  expiryDate: string;
  used: boolean;
}

interface CouponContextType {
  coupons: Coupon[];
  validateCoupon: (code: string, orderAmount: number) => Coupon | null;
  useCoupon: (code: string) => void;
}

const DEFAULT_COUPONS: Coupon[] = [
  { id: "c1", code: "WELCOME", discount: 50, minOrderAmount: 200, expiryDate: "2026-12-31", used: false },
  { id: "c2", code: "SAVE100", discount: 100, minOrderAmount: 500, expiryDate: "2026-12-31", used: false },
];

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      try {
        const saved = localStorage.getItem(`xmstore-coupons-${userId}`);
        if (saved) {
          setCoupons(JSON.parse(saved));
        } else {
          setCoupons(DEFAULT_COUPONS);
        }
      } catch (e) {
        console.error("Failed to load coupons from localStorage", e);
      }
      setIsHydrated(true);
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [userId]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(`xmstore-coupons-${userId}`, JSON.stringify(coupons));
    }
  }, [coupons, isHydrated, userId]);

  const validateCoupon = useCallback((code: string, orderAmount: number) => {
    const coupon = coupons.find(
      (c) => c.code === code && !c.used && new Date(c.expiryDate) > new Date() && orderAmount >= c.minOrderAmount
    );
    return coupon || null;
  }, [coupons]);

  const useCoupon = useCallback((code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, used: true } : c))
    );
  }, []);

  return (
    <CouponContext.Provider value={{ coupons, validateCoupon, useCoupon }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) throw new Error("useCoupon must be used within CouponProvider");
  return context;
}
