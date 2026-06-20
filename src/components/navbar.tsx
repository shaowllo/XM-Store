"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, Package, User, LogOut, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
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
      transition={{ type: "spring", stiffness: 150, damping: 25 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-2xl backdrop-saturate-[180%]"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <Store className="h-4 w-4 text-background" />
          </div>
          <span className="text-sm font-semibold tracking-tight">XMStore</span>
        </Link>

        {/* Desktop Navigation — Apple style centered */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions — Minimal icons */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 rounded-full" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>

          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

          <Link href="/wishlist" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label={t("wishlist")}>
              <Heart className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/orders" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label={t("orders")}>
              <Package className="h-4 w-4" />
            </Button>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full text-xs">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[60px] truncate">{user.name}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={logout} aria-label={t("logout")}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label={t("login")}>
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

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-full"
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
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-2xl"
          >
            <nav className="flex flex-col p-4 space-y-0.5">
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
              <div className="h-px bg-border my-2" />
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors w-full text-left">
                      <User className="h-4 w-4" />
                      {t("profile")}
                    </button>
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                    <Heart className="h-4 w-4" />
                    {t("wishlist")}
                  </Link>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                    <Package className="h-4 w-4" />
                    {t("orders")}
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
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
