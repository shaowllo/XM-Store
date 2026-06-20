"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Filter, Star, SearchX, Sparkles } from "lucide-react";
import { products, categories } from "@/lib/data";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import Image from "next/image";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/15 text-primary rounded px-0.5 font-semibold">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setQuery("");
      setSelectedCategory("all");
      setSortBy("relevance");
      setShowFilters(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [query, selectedCategory, sortBy]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mx-auto mt-20 max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl border bg-background/95 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Search Header */}
              <div className="flex items-center gap-3 border-b px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索产品..."
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") onOpenChange(false);
                  }}
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  aria-label="筛选"
                  aria-pressed={showFilters}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                    showFilters
                      ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="清除搜索"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-b overflow-hidden"
                  >
                    <div className="px-5 py-4 space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5 font-medium">
                          <Filter className="h-3.5 w-3.5 text-primary" />
                          分类筛选
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                              selectedCategory === "all"
                                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            }`}
                          >
                            全部
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedCategory === cat.id
                                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
                                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5 font-medium">
                          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                          排序
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "relevance", label: "相关度" },
                            { value: "price-asc", label: "价格从低到高" },
                            { value: "price-desc", label: "价格从高到低" },
                            { value: "rating", label: "评分最高" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setSortBy(opt.value)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                sortBy === opt.value
                                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {results.length === 0 ? (
                  query.trim() ? (
                    <EmptyState
                      icon={SearchX}
                      title="未找到相关产品"
                      description={`没有找到与 "${query}" 相关的产品，请尝试其他关键词`}
                    />
                  ) : (
                    <div className="px-5 py-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mx-auto mb-4">
                        <Sparkles className="h-7 w-7 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">输入关键词开始搜索</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">试试搜索 &quot;手机&quot;、&quot;耳机&quot; 或 &quot;手表&quot;</p>
                    </div>
                  )
                ) : (
                  <div className="py-3">
                    <div className="px-5 py-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      找到 {results.length} 个结果
                    </div>
                    {results.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={`/products/${product.id}`}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all group"
                        >
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 ring-1 ring-border group-hover:ring-primary/20 transition-all">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate group-hover:text-primary transition-colors">
                              {highlightMatch(product.name, query)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              ¥{product.price.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-amber-700 dark:text-amber-400">{product.rating}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
