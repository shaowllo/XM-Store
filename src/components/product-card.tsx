"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Heart, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useCartFly } from "@/components/cart-fly-context";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations("product");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { triggerFly } = useCartFly();
  const liked = isInWishlist(product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Discount badge */}
          {discount && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-red-500/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white tracking-wide">
              -{discount}%
            </span>
          )}

          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
              if (!liked) {
                toast.success(`${product.name} added to wishlist`);
              } else {
                toast.info(`${product.name} removed from wishlist`);
              }
            }}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-background/70 backdrop-blur-md border border-border/50 transition-all hover:bg-background hover:border-amber-500/30 opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-foreground/70"
              }`}
            />
          </motion.button>

          {/* Quick add overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <button
              onClick={(e) => {
                e.preventDefault();
                const btn = e.currentTarget;
                const cartBtn = document.querySelector('[data-cart-trigger]') as HTMLElement;
                if (cartBtn) {
                  triggerFly(btn.getBoundingClientRect(), cartBtn.getBoundingClientRect(), product.image);
                }
                addToCart(product, selectedColor);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-amber-500 hover:text-amber-950 hover:border-amber-500"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("addToCart")}
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="pt-3.5">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-serif font-semibold text-foreground group-hover:text-amber-500/80 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
                className={`h-3 w-3 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-1 ring-offset-1 ring-amber-500 ring-offset-background"
                    : "opacity-50 hover:opacity-80"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground font-sans">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground/60 line-through font-sans">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
