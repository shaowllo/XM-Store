"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/data";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const liked = isInWishlist(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "全部产品", href: "/products" }, { label: product.name }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-muted group"
          >
            <Image
              src={productImages[activeImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discount && (
              <Badge variant="destructive" className="absolute left-4 top-4 shadow-lg">
                -{discount}%
              </Badge>
            )}
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, idx) => (
              <button
                key={`${product.id}-img-${idx}`}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-muted border-2 transition-all ${
                  activeImage === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badge && (
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {product.badge}
              </Badge>
            )}
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-lg">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, starIdx) => (
                <Star
                  key={`star-${starIdx}`}
                  className={`h-5 w-5 ${
                    starIdx < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.reviews} 条评价)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ¥{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ¥{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount && (
              <Badge variant="destructive" className="text-sm rounded-lg">
                省 ¥{(product.originalPrice! - product.price).toLocaleString()}
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">
                颜色
                {selectedColor && (
                  <span
                    className="ml-2 inline-block h-4 w-4 rounded-full align-middle border"
                    style={{ backgroundColor: selectedColor }}
                  />
                )}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`选择颜色 ${color}`}
                    aria-pressed={selectedColor === color}
                    className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110 shadow-lg shadow-primary/25"
                        : "border-muted hover:border-primary/50"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">数量</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="减少数量"
              >
                -
              </Button>
              <span className="w-12 text-center font-medium text-lg" aria-label="数量">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl h-10 w-10"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="增加数量"
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              onClick={() => {
                addToCart(product, selectedColor, quantity);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              加入购物车
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
              onClick={() => toggleWishlist(product.id)}
              aria-label={liked ? "取消收藏" : "收藏"}
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl" aria-label="分享">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-secondary/50 p-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">极速配送</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">正品保障</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">7天退换</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <Sparkles className="h-4 w-4" />
                猜你喜欢
              </span>
              <h2 className="text-2xl font-bold">相关产品</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
