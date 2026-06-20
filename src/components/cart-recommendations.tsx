"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getCartRecommendations } from "@/lib/recommendations";

interface CartRecommendationsProps {
  cartIds: string[];
  maxItems?: number;
}

/**
 * Small recommendation strip shown inside cart/mini-cart.
 * Displays compact product cards with match score.
 */
export function CartRecommendations({ cartIds, maxItems = 2 }: CartRecommendationsProps) {
  const recs = useMemo(
    () => getCartRecommendations(cartIds, maxItems),
    [cartIds, maxItems]
  );

  if (recs.length === 0) return null;

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          You Might Also Like
        </span>
      </div>
      <div className="space-y-2">
        {recs.map((rec) => (
          <Link
            key={rec.product.id}
            href={`/products/${rec.product.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group"
          >
            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={rec.product.image}
                alt={rec.product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                {rec.product.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                ${rec.product.price.toLocaleString()}
              </p>
            </div>
            <span className="text-[10px] text-primary font-medium shrink-0 bg-primary/5 rounded-full px-2 py-0.5">
              {Math.round(rec.score * 100)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
