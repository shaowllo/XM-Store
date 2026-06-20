"use client";

import React, { useState, useCallback, useEffect } from "react";
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

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productName = "",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartPos = React.useRef({ x: 0, y: 0 });

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      setCurrentIndex(index);
      setZoom(1);
    },
    [images.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  const toggleZoom = useCallback(() => {
    setZoom((z) => (z === 1 ? 2.5 : 1));
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen || images.length === 0) return null;

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
                <span className="ml-3 text-white/50">{productName}</span>
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
                aria-label={zoom > 1 ? "缩小" : "放大"}
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
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div
            className="flex-1 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              setHasDragged(false);
              dragStartPos.current = { x: e.clientX, y: e.clientY };
            }}
            onMouseMove={(e) => {
              const dx = Math.abs(e.clientX - dragStartPos.current.x);
              const dy = Math.abs(e.clientY - dragStartPos.current.y);
              if (dx > 5 || dy > 5) {
                setHasDragged(true);
              }
            }}
            onMouseUp={() => {
              if (!hasDragged) onClose();
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: zoom }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${productName} ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="上一张"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="下一张"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 px-4 py-4 z-10">
              {images.map((img, idx) => (
                <button
                  key={`thumb-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(idx);
                  }}
                  className={`relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-white ring-2 ring-white/30"
                      : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`缩略图 ${idx + 1}`}
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
