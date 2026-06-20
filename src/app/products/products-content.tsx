"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutList, ArrowUpDown, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { products, categories } from "@/lib/data";

const sortOptions = [
  { value: "default", label: "默认排序" },
  { value: "price-asc", label: "价格从低到高" },
  { value: "price-desc", label: "价格从高到低" },
  { value: "rating", label: "评分最高" },
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
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSortMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortMenu]);

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
    <div className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Products
        </span>
        <div className="flex items-end justify-between mt-2">
          <h1 className="text-2xl font-bold tracking-tight">全部产品</h1>
          <span className="text-sm text-muted-foreground mb-1">
            {filteredProducts.length} 款
          </span>
        </div>
      </motion.div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              activeCategory === "all"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-colors hover:bg-muted"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {currentSortLabel}
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-20 min-w-[180px] rounded-2xl border bg-background shadow-xl overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-foreground text-background font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.value === "rating" && <Star className="h-3.5 w-3.5" />}
                      {(opt.value === "price-asc" || opt.value === "price-desc") && <ArrowUpDown className="h-3.5 w-3.5" />}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-full border overflow-hidden bg-background">
            <button
              className={`flex h-9 w-9 items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="网格视图"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              className={`flex h-9 w-9 items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
              onClick={() => setViewMode("list")}
              aria-label="列表视图"
              aria-pressed={viewMode === "list"}
            >
              <LayoutList className="h-4 w-4" />
            </button>
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
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
