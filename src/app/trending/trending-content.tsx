"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Eye, ShoppingBag } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export function TrendingContent() {
  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      // Sort by rating first, then by review count
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }, []);

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Trending
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Trending Products</h1>
        <p className="mt-2 text-muted-foreground">
          Top-rated products sorted by popularity
        </p>
      </motion.div>

      <div className="mt-10 space-y-3">
        {sorted.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-5 rounded-2xl border bg-card/50 p-4 hover:bg-card transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-center">
              <span className={`text-lg font-bold ${
                index === 0 ? "text-amber-500" :
                index === 1 ? "text-gray-400" :
                index === 2 ? "text-amber-700" :
                "text-muted-foreground"
              }`}>
                #{index + 1}
              </span>
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {product.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {product.reviews} reviews
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className="font-semibold">${product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Action */}
            <a
              href={`/products/${product.id}`}
              className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors shrink-0"
            >
              View
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
