"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

export function MiniCartDropdown() {
  const t = useTranslations("cart");
  const { totalItems, totalPrice, items, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const showDropdown = isHovered && !isCartOpen && items.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger */}
      <button
        data-cart-trigger
        onClick={() => setIsCartOpen(true)}
        className="relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer"
        aria-label={t("title")}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-white"
          >
            {totalItems}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[360px] z-50"
          >
            <div className="rounded-2xl border bg-popover shadow-xl shadow-black/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("title")}</span>
                  <span className="text-xs text-muted-foreground">({totalItems})</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Items */}
              <div className="max-h-[320px] overflow-y-auto">
                {items.slice(0, 4).map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      {item.selectedColor && item.selectedColor !== "default" && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                          <span className="text-[10px] text-muted-foreground">Selected</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold">
                          ¥{item.product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {items.length > 4 && (
                  <div className="px-4 py-2 text-center text-xs text-muted-foreground border-t">
                    {items.length - 4} more items...
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
                  <span className="text-lg font-bold">¥{totalPrice.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full rounded-xl" size="sm">
                    {t("checkout")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
