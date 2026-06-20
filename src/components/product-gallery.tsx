"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { MagnifierZoom } from "./magnifier-zoom";
import { ImageLightbox } from "./image-lightbox";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount?: number | null;
}

/**
 * Unified product image gallery with:
 * - Main image with magnifier zoom (desktop) / tap-to-open (mobile)
 * - Prev/next arrows on main image
 * - Horizontally scrollable thumbnail strip
 * - Fullscreen lightbox on click
 */
export function ProductGallery({ images, productName, discount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setActiveIndex(index);
    // Scroll thumbnail into view
    const strip = thumbStripRef.current;
    if (strip) {
      const thumb = strip.children[index] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [images.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  if (!images || images.length === 0) return null;

  const singleImage = images.length === 1;

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-muted group"
        >
          {/* Magnifier zoom (desktop) — click opens lightbox */}
          <div
            className="absolute inset-0 z-10 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <MagnifierZoom
              src={images[activeIndex]}
              alt={`${productName} - ${activeIndex + 1}`}
              zoom={2.5}
              lensSize={160}
              className="w-full h-full"
            />
          </div>

          {/* Fallback for mobile: standard image with reveal transition */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`${productName} - ${activeIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Discount badge */}
          {discount && (
            <span className="absolute left-4 top-4 z-20 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              -{discount}%
            </span>
          )}

          {/* "View larger" overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium shadow-lg">
              <Expand className="h-4 w-4" />
              View larger
            </div>
          </div>

          {/* Prev/Next arrows on main image */}
          {!singleImage && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          {!singleImage && (
            <div className="absolute right-4 bottom-4 z-20 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>

        {/* Thumbnail Strip — horizontally scrollable */}
        {!singleImage && (
          <div className="relative">
            {/* Scroll left button */}
            <button
              onClick={() => {
                const strip = thumbStripRef.current;
                if (strip) strip.scrollBy({ left: -200, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-md border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={thumbStripRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((img, idx) => (
                <button
                  key={`thumb-${idx}`}
                  onClick={() => goTo(idx)}
                  className={`relative aspect-square shrink-0 snap-start overflow-hidden rounded-xl bg-muted transition-all ${
                    activeIndex === idx
                      ? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  style={{ width: 80 }}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Scroll right button */}
            <button
              onClick={() => {
                const strip = thumbStripRef.current;
                if (strip) strip.scrollBy({ left: 200, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-md border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={productName}
      />
    </>
  );
}
