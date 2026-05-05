"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutList, Smartphone, Headphones, Watch, Laptop, Package, ArrowUpDown, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { products, categories } from "@/lib/data";

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Package className="h-3.5 w-3.5" />,
  phone: <Smartphone className="h-3.5 w-3.5" />,
  audio: <Headphones className="h-3.5 w-3.5" />,
  wearable: <Watch className="h-3.5 w-3.5" />,
  computer: <Laptop className="h-3.5 w-3.5" />,
};

const sortOptions = [
  { value: "default", label: "默认排序", icon: TrendingUp },
  { value: "price-asc", label: "价格从低到高", icon: ArrowUpDown },
  { value: "price-desc", label: "价格从高到低", icon: ArrowUpDown },
  { value: "rating", label: "评分最高", icon: Star },
];

type ViewMode = "grid" | "list";

export function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "default";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState(initialSort);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const updateQueryParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "default" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(newUrl, { scroll: false });
    },
    [router, searchParams, pathname]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setActiveCategory(category);
      updateQueryParam("category", category);
    },
    [updateQueryParam]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort);
      setShowSortMenu(false);
      updateQueryParam("sort", sort);
    },
    [updateQueryParam]
  );

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [activeCategory, sortBy]);

  const currentSortLabel = sortOptions.find((s) => s.value === sortBy)?.label || "默认排序";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">全部产品</h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          共 <span className="font-semibold text-foreground">{filteredProducts.length}</span> 款产品
        </p>
      </motion.div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full gap-1.5 transition-all ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 border-0"
                : ""
            }`}
          >
            {categoryIcons.all}
            全部
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full gap-1.5 transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 border-0"
                  : ""
              }`}
            >
              {categoryIcons[cat.id]}
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="rounded-full gap-2"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {currentSortLabel}
            </Button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-20 min-w-[180px] rounded-xl border bg-background shadow-xl overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <opt.icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl border overflow-hidden bg-background">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className={`rounded-none h-9 w-9 ${
                viewMode === "grid" ? "bg-gradient-to-r from-primary to-accent text-white" : ""
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="网格视图"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className={`rounded-none h-9 w-9 ${
                viewMode === "list" ? "bg-gradient-to-r from-primary to-accent text-white" : ""
              }`}
              onClick={() => setViewMode("list")}
              aria-label="列表视图"
              aria-pressed={viewMode === "list"}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EmptyState
              icon={SlidersHorizontal}
              title="该分类下暂无产品"
              description="请尝试选择其他分类或查看全部产品"
              action={{ label: "查看全部", href: "/products" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
