"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { useWishlist } from "@/components/wishlist-provider";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const { wishlist, clearWishlist } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: t("title") }]} />
        <EmptyState
          icon={Heart}
          title={t("empty")}
          description="You haven't added any items yet. Start exploring and save your favorites!"
          action={{ label: "Browse Products", href: "/products", icon: <ShoppingBag className="h-4 w-4" /> }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: t("title") }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            {t("title")}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {wishlistProducts.length} items in wishlist
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearWishlist}
          className="gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Clear Wishlist
        </Button>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
