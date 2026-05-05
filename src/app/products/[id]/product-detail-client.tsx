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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={productImages[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, idx) => (
              <button
                key={`${product.id}-img-${idx}`}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-square overflow-hidden rounded-xl bg-muted border-2 transition-all ${
                  activeImage === idx
                    ? "border-primary"
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badge && (
              <Badge className="bg-primary text-primary-foreground">
                {product.badge}
              </Badge>
            )}
            {discount && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

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

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold">
              ¥{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ¥{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount && (
              <Badge variant="destructive" className="text-sm">
                省 ¥{(product.originalPrice! - product.price).toLocaleString()}
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">
                颜色
                {selectedColor && (
                  <span
                    className="ml-2 inline-block h-4 w-4 rounded-full align-middle"
                    style={{ backgroundColor: selectedColor }}
                  />
                )}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110"
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

          <div className="mt-6">
            <h3 className="font-medium mb-3">数量</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
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
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl bg-muted p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs">极速配送</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs">正品保障</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-xs">7天退换</span>
            </div>
          </div>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-8">相关产品</h2>
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
