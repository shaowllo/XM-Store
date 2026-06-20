"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Truck, Shield, RotateCcw, Headphones, Store, ArrowUpRight } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  const features = [
    { icon: Truck, title: "Express Delivery", desc: "Free nationwide shipping, next-day delivery" },
    { icon: Shield, title: "Quality Guarantee", desc: "Authentic products, 10x refund guarantee" },
    { icon: RotateCcw, title: "Hassle-free Returns", desc: "7-day no-questions-asked returns" },
    { icon: Headphones, title: "Dedicated Support", desc: "24/7 online support" },
  ];

  const footerLinks = {
    products: {
      title: "Product Categories",
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
        { label: "After-Sales Service", href: "/about" },
        { label: "Delivery Info", href: "/about" },
        { label: t("refundPolicy"), href: "/about" },
        { label: "FAQ", href: "/about" },
      ],
    },
    about: {
      title: t("aboutUs"),
      links: [
        { label: "Our Story", href: "/about" },
        { label: t("contactUs"), href: "/about" },
        { label: "Join Us", href: "/about" },
        { label: t("privacyPolicy"), href: "/about" },
      ],
    },
  };
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">XMStore</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Explore the latest tech products. Premium quality, delivered to your doorstep.
              </p>
              <div className="mt-6 flex gap-3">
                {["WeChat", "Weibo", "Douyin"].map((social) => (
                  <button
                    key={social}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all text-xs font-medium"
                  >
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 XM Store. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("termsOfService")}
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
