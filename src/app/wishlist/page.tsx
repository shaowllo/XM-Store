"use client";

import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/components/wishlist-provider";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "我的收藏" }]} />
        <EmptyState
          icon={Heart}
          title="收藏夹是空的"
          description="您还没有收藏任何商品，看到喜欢的就收藏起来吧"
          action={{ label: "去浏览", href: "/products", icon: <ShoppingBag className="h-4 w-4" /> }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "我的收藏" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">我的收藏</h1>
          <p className="mt-2 text-muted-foreground">
            共 {wishlistProducts.length} 件收藏
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearWishlist} className="gap-2">
          <Trash2 className="h-4 w-4" />
          清空收藏
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
