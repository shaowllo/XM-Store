"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-1.5 text-sm text-muted-foreground py-4"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary transition-colors duration-300 group"
      >
        <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
        <span className="group-hover:font-medium">首页</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-primary/40" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary hover:font-medium transition-all duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="text-foreground font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              {item.label}
            </motion.span>
          )}
        </div>
      ))}
    </motion.nav>
  );
}
