"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, Package, User, LogOut, Sparkles, Palette, TrendingUp, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./search-dialog";
import { MiniCartDropdown } from "./mini-cart-dropdown";
import { CartSheet } from "./cart-sheet";

export function Navbar() {
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/about", label: t("about") },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className="sticky top-0 z-50 w-full glass"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 shadow-lg shadow-amber-500/20">
            <Sparkles className="h-4 w-4 text-amber-950" />
          </div>
          <span className="text-base font-serif font-semibold tracking-tight gold-text">
            XMStore
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-xs font-medium tracking-wide uppercase text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

          <Link href="/wishlist" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label={t("wishlist")}>
              <Heart className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/theme" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label="Theme Studio">
              <Palette className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/trending" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label="Trending">
              <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>

          {user && (
            <Link href="/admin" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label="Admin">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <Link href="/orders" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label={t("orders")}>
              <Package className="h-4 w-4" />
            </Button>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-0.5">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-lg text-xs font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[60px] truncate">{user.name}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" onClick={logout} aria-label={t("logout")}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" aria-label={t("login")}>
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Cart */}
          <div className="hidden sm:block">
            <MiniCartDropdown />
          </div>
          <div className="sm:hidden">
            <CartSheet />
          </div>

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-lg text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/98 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border/50 my-2" />
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors">
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors">
                    <Heart className="h-4 w-4" />
                    {t("wishlist")}
                  </Link>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors">
                    <Package className="h-4 w-4" />
                    {t("orders")}
                  </Link>
                  <div className="h-px bg-border/50 my-2" />
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {t("login")} / {t("register")}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
