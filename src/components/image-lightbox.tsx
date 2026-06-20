"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const SWIPE_THRESHOLD = 60;

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productName = "",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      setCurrentIndex(index);
      setZoom(1);
      setSwipeOffset(0);
    },
    [images.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  const toggleZoom = useCallback(() => {
    setZoom((z) => (z === 1 ? 2.5 : 1));
    setSwipeOffset(0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setCurrentIndex(initialIndex);
        setZoom(1);
        setSwipeOffset(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return; // Don't swipe while zoomed
    swipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    hasDraggedRef.current = false;
    setIsSwiping(true);
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (zoom > 1 || !isSwiping) return;
    const dx = e.touches[0].clientX - swipeStartRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - swipeStartRef.current.y);
    // Only track horizontal swipes
    if (Math.abs(dx) > 10 && Math.abs(dx) > dy) {
      hasDraggedRef.current = true;
      setSwipeOffset(dx);
    }
  }, [zoom, isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    if (!hasDraggedRef.current) return;
    if (Math.abs(swipeOffset) > SWIPE_THRESHOLD) {
      if (swipeOffset > 0) goPrev();
      else goNext();
    } else {
      setSwipeOffset(0);
    }
  }, [swipeOffset, goNext, goPrev]);

  // Mouse drag-to-close detection (existing behavior)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    hasDraggedRef.current = false;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - swipeStartRef.current.x);
    const dy = Math.abs(e.clientY - swipeStartRef.current.y);
    if (dx > 5 || dy > 5) {
      hasDraggedRef.current = true;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!hasDraggedRef.current) onClose();
  }, [onClose]);

  if (!isOpen || images.length === 0) return null;

  const singleImage = images.length === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 z-10">
            <div className="text-white/80 text-sm">
              <span className="font-medium">{currentIndex + 1}</span>
              <span className="mx-1.5">/</span>
              <span>{images.length}</span>
              {productName && (
                <span className="ml-3 text-white/50 hidden sm:inline">{productName}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
              >
                {zoom > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Image Area */}
          <div
            className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  scale: zoom,
                  x: isSwiping ? swipeOffset : 0,
                }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto"
                style={{ touchAction: zoom > 1 ? "pinch-zoom" : "pan-y" }}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${productName} ${currentIndex + 1}`}
                  fill
                  className="object-contain pointer-events-none"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Drag hint arrow — subtle indicator */}
            {isSwiping && Math.abs(swipeOffset) > 20 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="absolute inset-y-0 flex items-center"
                style={{
                  [swipeOffset > 0 ? "left" : "right"]: 20,
                }}
              >
                {swipeOffset > 0 ? (
                  <ChevronLeft className="h-10 w-10 text-white" />
                ) : (
                  <ChevronRight className="h-10 w-10 text-white" />
                )}
              </motion.div>
            )}

            {/* Navigation Arrows — desktop only (touch has swipe) */}
            {!singleImage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm hidden sm:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm hidden sm:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {!singleImage && (
            <div className="flex justify-center gap-2 px-4 py-4 z-10 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={`thumb-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(idx);
                  }}
                  className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    idx === currentIndex
                      ? "border-white ring-2 ring-white/30"
                      : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
