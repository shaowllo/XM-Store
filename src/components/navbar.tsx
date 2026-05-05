"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, Heart, Package, User, LogOut, Store, Settings } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search-dialog";

export function Navbar() {
  const { totalItems, totalPrice, items, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/products", label: "产品" },
    { href: "/about", label: "关于" },
  ];

  const actionLinks = [
    { href: "/wishlist", label: "收藏", icon: Heart },
    { href: "/orders", label: "订单", icon: Package },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-2xl font-bold tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">XMStore</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-lg" onClick={() => setSearchOpen(true)} aria-label="搜索">
            <Search className="h-5 w-5" />
          </Button>

          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

          {actionLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="rounded-lg" aria-label={link.label}>
                <link.icon className="h-5 w-5" />
              </Button>
            </Link>
          ))}

          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                  <Settings className="h-4 w-4" />
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-lg" onClick={logout} aria-label="退出登录">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="rounded-lg" aria-label="登录">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Cart Sheet */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger aria-label="购物车">
              <div className="relative inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer">
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
              </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg relative">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  购物车 ({totalItems})
                </SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <ScrollArea className="flex-1 -mx-6 px-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <ShoppingCart className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm">购物车是空的</p>
                      <p className="text-xs mt-1">快去挑选心仪的商品吧</p>
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
                          className="flex gap-4 p-3 rounded-xl bg-secondary/50"
                        >
                          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                            {item.selectedColor && item.selectedColor !== "default" && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className="inline-block h-3 w-3 rounded-full border"
                                  style={{ backgroundColor: item.selectedColor }}
                                />
                                <span className="text-xs text-muted-foreground">已选颜色</span>
                              </div>
                            )}
                            <p className="text-sm font-semibold mt-1">
                              ¥{item.product.price.toLocaleString()}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity - 1)
                                }
                                aria-label="减少数量"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm font-medium" aria-label="数量">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity + 1)
                                }
                                aria-label="增加数量"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 rounded-lg"
                            onClick={() => removeFromCart(item.cartItemId)}
                            aria-label="移除商品"
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
                        <span className="text-muted-foreground">合计</span>
                        <span className="text-xl font-bold">¥{totalPrice.toLocaleString()}</span>
                      </div>
                      <Link href="/checkout" className="w-full">
                        <Button className="w-full rounded-xl" size="lg" onClick={() => setIsCartOpen(false)}>
                          去结算
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={mobileMenuOpen}
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
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Separator className="my-2" />
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors w-full text-left">
                      <Settings className="h-4 w-4" />
                      个人中心
                    </button>
                  </Link>
                  {actionLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    退出登录
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  登录 / 注册
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
