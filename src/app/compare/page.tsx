"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, Star, ShoppingCart, X, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { products } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
import { useCartFly } from "@/components/cart-fly-context";
import { useWishlist } from "@/components/wishlist-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];
  const t = useTranslations("product");
  const { addToCart } = useCart();
  const { triggerFly } = useCartFly();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const compareProducts = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [ids]
  );

  // Build spec rows dynamically from product data
  const specRows = useMemo(() => {
    if (compareProducts.length === 0) return [];
    const rows: { label: string; values: (string | number | undefined)[] }[] = [
      { label: "Price", values: compareProducts.map((p) => `$${p.price.toLocaleString()}`) },
      { label: "Original Price", values: compareProducts.map((p) => p.originalPrice ? `$${p.originalPrice.toLocaleString()}` : "—") },
      { label: "Category", values: compareProducts.map((p) => p.category) },
      { label: "Rating", values: compareProducts.map((p) => `${p.rating} ⭐`) },
      { label: "Reviews", values: compareProducts.map((p) => p.reviews.toLocaleString()) },
      { label: "Tags", values: compareProducts.map((p) => p.tags.join(", ")) },
    ];
    return rows;
  }, [compareProducts]);

  if (compareProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: "Compare" }]} />
        <div className="mt-16 flex flex-col items-center gap-4">
          <BarChart3 className="h-12 w-12 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold">No products to compare</h1>
          <p className="text-muted-foreground">Select products from the catalog to compare them side by side.</p>
          <Link href="/products">
            <Button className="rounded-full">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: "Compare" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Product Comparison
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Products</h1>
        <p className="mt-2 text-muted-foreground">
          Showing {compareProducts.length} {compareProducts.length === 1 ? "product" : "products"}
        </p>
      </motion.div>

      {/* Comparison Table — horizontally scrollable on mobile */}
      <div className="mt-10 overflow-x-auto pb-6">
        <div
          className="min-w-[600px]"
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${compareProducts.length}, 1fr)`,
            gap: 0,
          }}
        >
          {/* Header row */}
          <div className="sticky left-0 z-10" />

          {compareProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col items-center text-center p-4 border-l border-border/50 first:border-l-0"
            >
              {/* Product image */}
              <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-muted mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>

              <h3 className="text-lg font-serif font-semibold leading-tight">{product.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Colors */}
              {product.colors && (
                <div className="mt-3 flex gap-1.5">
                  {product.colors.map((c) => (
                    <span
                      key={c}
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-2 w-full">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 rounded-full text-xs"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const cartBtn = document.querySelector('[data-cart-trigger]') as HTMLElement;
                    if (cartBtn) {
                      triggerFly(btn.getBoundingClientRect(), cartBtn.getBoundingClientRect(), product.image);
                    }
                    addToCart(product, product.colors?.[0]);
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-full h-8 w-8 p-0 ${isInWishlist(product.id) ? "border-red-400" : ""}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                >
                  <X className="h-3 w-3 rotate-45" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spec rows */}
        <div
          className="min-w-[600px] mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${compareProducts.length}, 1fr)`,
            gap: 0,
          }}
        >
          {specRows.map((row) => (
            <div
              key={row.label}
              className="contents"
            >
              {/* Label column */}
              <div className="sticky left-0 z-10 bg-background px-4 py-3 border-t border-border/50 flex items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </span>
              </div>

              {/* Value columns */}
              {row.values.map((val, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 border-t border-l border-border/50 flex items-center justify-center text-sm text-center"
                >
                  {val || "—"}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Badge row */}
        <div
          className="min-w-[600px]"
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${compareProducts.length}, 1fr)`,
            gap: 0,
          }}
        >
          <div className="sticky left-0 z-10 bg-background px-4 py-3 border-t border-border/50 flex items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge</span>
          </div>
          {compareProducts.map((p) => (
            <div
              key={p.id}
              className="px-4 py-3 border-t border-l border-border/50 flex items-center justify-center"
            >
              {p.badge ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  {p.badge}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground/50">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Max items notice */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <AlertCircle className="h-3.5 w-3.5" />
        You can compare up to 4 products at a time.
      </div>
    </div>
  );
}
