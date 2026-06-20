"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, X } from "lucide-react";
import { getCompareList, clearCompare } from "@/lib/compare-store";
import { products } from "@/lib/data";

/**
 * Floating bar at the bottom of the screen showing compare count.
 * Appears when ≥1 product is in the compare list.
 * Auto-hides and re-appears as the list changes.
 */
export function CompareBar() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setIds(getCompareList());
    update();
    window.addEventListener("compare-update", update);
    return () => window.removeEventListener("compare-update", update);
  }, []);

  const count = ids.length;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 rounded-2xl border bg-background/90 backdrop-blur-xl px-5 py-3 shadow-2xl shadow-foreground/10">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {count} {count === 1 ? "product" : "products"} selected
              </span>
            </div>

            <div className="flex -space-x-2">
              {ids.slice(0, 4).map((id) => {
                const p = products.find((pr) => pr.id === id);
                return (
                  <div
                    key={id}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                    title={p?.name}
                  >
                    {p && (
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <Link
              href={`/compare?ids=${ids.join(",")}`}
              className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Compare
            </Link>

            <button
              onClick={() => clearCompare()}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label="Clear compare list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
