"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { products } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === productId);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product?.colors) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">产品未找到</h1>
        <p className="mt-2 text-muted-foreground">
          抱歉，您查找的产品不存在
        </p>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>首页</span>
        <span>/</span>
        <span>产品</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <img
              src={productImages[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`aspect-square overflow-hidden rounded-xl bg-muted border-2 transition-all ${
                  activeImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
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
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
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
                for (let i = 0; i < quantity; i++) {
                  addToCart(product, selectedColor);
                }
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              加入购物车
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
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

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-center">加载中...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
