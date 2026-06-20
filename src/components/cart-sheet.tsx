"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import { CartRecommendations } from "@/components/cart-recommendations";

export function CartSheet() {
  const t = useTranslations("cart");
  const { totalItems, totalPrice, items, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger aria-label={t("title")} className="sm:hidden">
        <div data-cart-trigger className="relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background"
            >
              {totalItems}
            </motion.span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            {t("title")}
            <span className="text-sm text-muted-foreground font-normal">({totalItems})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 -mx-6 px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <ShoppingCart className="h-7 w-7 opacity-40" />
                </div>
                <p className="text-sm font-medium">{t("empty")}</p>
                <p className="text-xs mt-1 text-muted-foreground">{t("continueShopping")}</p>
              </div>
            ) : (
              <div className="space-y-1 py-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 py-4 group"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          {item.selectedColor && item.selectedColor !== "default" && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                              <span className="text-xs text-muted-foreground">Selected</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            ${item.product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 p-1"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>

          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
                  <span className="text-2xl font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="block">
                  <Button
                    className="w-full rounded-full gap-2"
                    size="lg"
                    onClick={() => setIsCartOpen(false)}
                  >
                    {t("checkout")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Cart recommendations */}
              <CartRecommendations cartIds={items.map((i) => i.product.id)} maxItems={2} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
