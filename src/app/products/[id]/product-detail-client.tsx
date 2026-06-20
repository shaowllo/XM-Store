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
  Minus,
  Plus,
  Expand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useCartFly } from "@/components/cart-fly-context";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { ImageLightbox } from "@/components/image-lightbox";
import type { Product } from "@/lib/data";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const t = useTranslations("product");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { triggerFly } = useCartFly();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ label: t("categories.all"), href: "/products" }, { label: product.name }]} />
      </div>

      {/* Main Product Section */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Images - 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-muted group cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={productImages[activeImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              {discount && (
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                  -{discount}%
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium shadow-lg">
                  <Expand className="h-4 w-4" />
                  View larger image
                </div>
              </div>
            </motion.div>
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={`${product.id}-img-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-xl bg-muted transition-all ${
                    activeImage === idx
                      ? "ring-2 ring-foreground"
                      : "opacity-60 hover:opacity-100"
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

          {/* Info - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col"
          >
            {/* Brand Tag */}
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {product.category}
            </span>

            <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, starIdx) => (
                  <Star
                    key={`star-${starIdx}`}
                    className={`h-4 w-4 ${
                      starIdx < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} {t("reviews").toLowerCase()})
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Color
                </span>
                <div className="mt-3 flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                      aria-pressed={selectedColor === color}
                      className={`relative h-8 w-8 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-foreground scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8">
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Quantity
              </span>
              <div className="mt-3 inline-flex items-center rounded-full border">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium" aria-label={t("quantity")}>{quantity}</span>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const cartBtn = document.querySelector('[data-cart-trigger]') as HTMLElement;
                  if (cartBtn) {
                    triggerFly(btn.getBoundingClientRect(), cartBtn.getBoundingClientRect(), product.image);
                  }
                  addToCart(product, selectedColor, quantity);
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {t("addToCart")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 w-12 p-0"
                onClick={() => toggleWishlist(product.id)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-5 w-5 ${
                    liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 w-12 p-0"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="mt-8 flex gap-6 pt-8 border-t">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Genuine Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">7-Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  You May Also Like
                </span>
                <h2 className="mt-2 text-2xl font-bold">{t("relatedProducts")}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={productImages}
        initialIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={product.name}
      />
    </div>
  );
}
