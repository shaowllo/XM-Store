"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { heroSlides } from "@/lib/data";
import Link from "next/link";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const t = useTranslations("home");

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = heroSlides.length - 1;
      if (next >= heroSlides.length) next = 0;
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate]);

  const slide = heroSlides[current];

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={current === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-full flex-col justify-end pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                <span className="inline-block text-sm font-medium tracking-widest text-white/60 uppercase mb-4">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
                  {slide.title}
                </h1>
                <p className="mt-6 text-lg text-white/70 max-w-md leading-relaxed">
                  {slide.description}
                </p>
                <div className="mt-10 flex items-center gap-6">
                  <Link
                    href={`/products/${slide.productId}`}
                    className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:gap-4"
                  >
                    {t("shopNow")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={`/products/${slide.productId}`}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-6">
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/60 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className="group relative h-1 overflow-hidden rounded-full bg-white/20 transition-all"
              style={{ width: idx === current ? 48 : 24 }}
            >
              {idx === current && (
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6, ease: "linear" }}
                  key={`progress-${current}`}
                />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => paginate(1)}
          aria-label="Next slide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/60 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-white/40 text-sm font-mono">
        <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(heroSlides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
