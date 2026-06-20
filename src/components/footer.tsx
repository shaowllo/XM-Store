"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Truck, Shield, RotateCcw, Headphones, Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  const features = [
    { icon: Truck, title: "Express Delivery", desc: "Free shipping across the Middle East" },
    { icon: Shield, title: "Quality Guarantee", desc: "Authentic products, certified premium" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support, always available" },
  ];

  const footerLinks = {
    products: {
      title: "Shop",
      links: [
        { label: "Phones", href: "/products?category=phone" },
        { label: "Audio", href: "/products?category=audio" },
        { label: "Wearables", href: "/products?category=wearable" },
        { label: "Computers", href: "/products?category=computer" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { label: "Delivery Info", href: "/about" },
        { label: t("refundPolicy"), href: "/about" },
        { label: "FAQ", href: "/about" },
        { label: t("contactUs"), href: "/about" },
      ],
    },
    about: {
      title: t("aboutUs"),
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Careers", href: "/about" },
        { label: t("privacyPolicy"), href: "/about" },
        { label: t("termsOfService"), href: "/about" },
      ],
    },
  };

  return (
    <footer className="border-t border-border/30">
      {/* Features strip */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/10">
                <f.icon className="h-4.5 w-4.5 text-amber-500/80" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 shadow-lg shadow-amber-500/20">
                  <Sparkles className="h-4.5 w-4.5 text-amber-950" />
                </div>
                <span className="text-xl font-serif font-bold gold-text">XMStore</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs font-sans">
                Premium tech products delivered across the Middle East. Quality, speed, and trust — one delivery at a time.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-sans font-semibold text-sm text-foreground mb-5">{section.title}</h4>
                <ul className="space-y-3.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-amber-500/80 transition-colors font-sans"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-sans">
              &copy; 2026 XM Store. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                {t("termsOfService")}
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                {t("privacyPolicy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
