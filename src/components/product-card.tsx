"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Heart } from "lucide-react";
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {discount && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold text-white">
              -{discount}%
            </span>
          )}

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
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                liked ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
            />
          </motion.button>
        </div>
      </Link>

      {/* Content — Apple minimal */}
      <div className="pt-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium leading-tight group-hover:text-foreground/80 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex gap-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
                className={`h-3 w-3 rounded-full transition-all ${
                  selectedColor === color ? "ring-1 ring-offset-1 ring-foreground" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold">
            ¥{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ¥{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            const btn = e.currentTarget;
            const cartBtn = document.querySelector('[data-cart-trigger]') as HTMLElement;
            if (cartBtn) {
              triggerFly(btn.getBoundingClientRect(), cartBtn.getBoundingClientRect(), product.image);
            }
            addToCart(product, selectedColor);
          }}
          className="mt-3 w-full rounded-full bg-foreground py-2.5 text-xs font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.98]"
        >
          {t("addToCart")}
        </button>
      </div>
    </motion.div>
  );
}
