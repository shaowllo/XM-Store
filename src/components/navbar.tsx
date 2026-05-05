"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SearchDialog } from "./search-dialog";

export function Navbar() {
  const { totalItems, totalPrice, items, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { addOrder } = useOrders();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/products", label: "产品" },
    { href: "/about", label: "关于" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold tracking-tight"
          >
            XM<span className="text-primary">Store</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

          {/* Cart Sheet */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger>
              <div className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg relative">
              <SheetHeader>
                <SheetTitle>购物车 ({totalItems})</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <ScrollArea className="flex-1 -mx-6 px-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
                      <p>购物车是空的</p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4"
                        >
                          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            {item.selectedColor && item.selectedColor !== "default" && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className="inline-block h-3 w-3 rounded-full border"
                                  style={{ backgroundColor: item.selectedColor }}
                                />
                                <span className="text-xs text-muted-foreground">已选颜色</span>
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                              ¥{item.product.price.toLocaleString()}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity - 1)
                                }
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.cartItemId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {items.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4 pb-8">
                      <div className="flex items-center justify-between text-lg font-medium">
                        <span>合计</span>
                        <span>¥{totalPrice.toLocaleString()}</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => setCheckoutOpen(true)}>
                        结算
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {checkoutOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                  <div className="w-full max-w-sm rounded-2xl bg-background p-6 text-center shadow-2xl">
                    <h3 className="text-lg font-semibold">确认结算</h3>
                    <p className="mt-2 text-muted-foreground">
                      共 {totalItems} 件商品，合计 ¥{totalPrice.toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setCheckoutOpen(false)}>
                        取消
                      </Button>
                      <Button className="flex-1" onClick={() => {
                        addOrder(items, totalPrice, totalItems);
                        clearCart();
                        setCheckoutOpen(false);
                        setIsCartOpen(false);
                      }}>
                        确认支付
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
