"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, ShoppingBag } from "lucide-react";
import { products } from "@/lib/data";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import Link from "next/link";
import Image from "next/image";

export default function OfflinePage() {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setRecentIds(getRecentlyViewed().slice(0, 4));
    const check = () => setOnline(navigator.onLine);
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, []);

  const cachedProducts = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-6">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">You&apos;re Offline</h1>
        <p className="mt-2 text-muted-foreground">
          Don&apos;t worry — your recently viewed products are still available.
        </p>

        <button
          onClick={handleRetry}
          disabled={online}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {online ? (
            <>
              <Wifi className="h-4 w-4" />
              Back Online!
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </>
          )}
        </button>
      </motion.div>

      {/* Cached products */}
      {cachedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 w-full max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recently Viewed (Offline)
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cachedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-2 text-xs font-medium truncate group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${product.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-xs text-muted-foreground"
      >
        The page will automatically reload when connection is restored.
      </motion.p>
    </div>
  );
}
