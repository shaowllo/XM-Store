"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star, ShoppingCart, Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [isHovered, setIsHovered] = useState(false);

  const cartItemId = `${product.id}--${selectedColor || "default"}`;
  const cartItem = items.find((item) => item.cartItemId === cartItemId);
  const inCartQuantity = cartItem?.quantity || 0;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1 will-change-transform"
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
        <motion.div
          className="relative h-full w-full will-change-transform"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              {product.badge}
            </Badge>
          )}
        </div>
        {discount && (
          <Badge variant="destructive" className="absolute right-3 top-3 shadow-lg">
            -{discount}%
          </Badge>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-4 left-4 right-4 flex gap-2 will-change-transform"
        >
          <Button
            size="sm"
            className="flex-1 bg-white/95 text-foreground backdrop-blur-sm hover:bg-white rounded-xl shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, selectedColor);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {inCartQuantity > 0 ? `购物车 (${inCartQuantity})` : "加入购物车"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border-0"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/products/${product.id}`);
            }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Cart Quantity Badge */}
        {inCartQuantity > 0 && (
          <div className="absolute left-3 top-12 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent px-1.5 text-[10px] font-medium text-white shadow-lg">
            {inCartQuantity}
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
            if (!liked) {
              toast.success(`已收藏 ${product.name}`);
            } else {
              toast.info(`已取消收藏 ${product.name}`);
            }
          }}
          aria-label={liked ? "取消收藏" : "收藏"}
          className="absolute right-3 top-12 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </motion.button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={`选择颜色 ${color}`}
                aria-pressed={selectedColor === color}
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary scale-110 shadow-sm"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-secondary px-2.5 py-1 text-xs text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ¥{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ¥{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
