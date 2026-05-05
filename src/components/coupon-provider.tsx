"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useUser } from "./user-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  const COUPONS_KEY = `xmstore-coupons-${userId}`;
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(COUPONS_KEY, DEFAULT_COUPONS);

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
