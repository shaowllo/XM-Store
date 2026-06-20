"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlyItem {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

interface CartFlyContextType {
  triggerFly: (startRect: DOMRect, endRect: DOMRect, image: string) => void;
}

const CartFlyContext = createContext<CartFlyContextType | undefined>(undefined);

export function CartFlyProvider({ children }: { children: React.ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyItem[]>([]);

  const triggerFly = useCallback((startRect: DOMRect, endRect: DOMRect, image: string) => {
    const id = `fly-${Date.now()}-${Math.random()}`;
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    setFlyingItems((prev) => [...prev, { id, startX, startY, endX, endY, image }]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  }, []);

  return (
    <CartFlyContext.Provider value={{ triggerFly }}>
      {children}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX,
              y: item.startY,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: item.endX,
              y: item.endY,
              scale: 0.2,
              opacity: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              width: 60,
              height: 60,
              marginLeft: -30,
              marginTop: -30,
            }}
          >
            <div
              className="w-full h-full rounded-xl bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${item.image})` }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const context = useContext(CartFlyContext);
  if (!context) {
    throw new Error("useCartFly must be used within CartFlyProvider");
  }
  return context;
}
