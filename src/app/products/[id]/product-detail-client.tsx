"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useCartFly } from "@/components/cart-fly-context";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductViewer3D } from "@/components/product-viewer-3d";
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
  const [view3D, setView3D] = useState(false);

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
          <div className="lg:col-span-7">
            {/* 3D toggle */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setView3D(false)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  !view3D
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground bg-muted"
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setView3D(true)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  view3D
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground bg-muted"
                }`}
              >
                3D View
              </button>
            </div>

            {view3D ? (
              <ProductViewer3D
                images={productImages}
                productName={product.name}
                defaultColor={selectedColor}
              />
            ) : (
              <ProductGallery
                images={productImages}
                productName={product.name}
                discount={discount}
              />
            )}
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
    </div>
  );
}
