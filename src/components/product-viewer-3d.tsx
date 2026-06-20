"use client";

import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Maximize2, Minimize2, RotateCw } from "lucide-react";

// Dynamic import so Three.js is only loaded when 3D mode is activated
const ThreeScene = lazy(() => import("./three-scene"));

/** Loading fallback for the 3D canvas */
function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-muted/30 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground">Loading 3D viewer...</p>
      </div>
    </div>
  );
}

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  defaultColor?: string;
}

/**
 * 3D product viewer using Three.js (lazy-loaded).
 * Toggle between 3D and standard 2D image view.
 */
export function ProductViewer3D({ images, productName, defaultColor }: ProductViewer3DProps) {
  const [is3D, setIs3D] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-muted/40 transition-all ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "aspect-[4/3] lg:aspect-square"
      }`}
    >
      <AnimatePresence mode="wait">
        {is3D ? (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Suspense fallback={<Loader />}>
              <ThreeScene
                imageUrl={images[0]}
                color={defaultColor}
              />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="2d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img
              src={images[0]}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setIs3D(!is3D)}
          className="flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 px-4 py-2 text-xs font-medium text-foreground hover:bg-background transition-all shadow-lg"
          aria-label={is3D ? "Show 2D view" : "Show 3D view"}
        >
          {is3D ? (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              2D View
            </>
          ) : (
            <>
              <Box className="h-3.5 w-3.5" />
              3D View
            </>
          )}
        </button>
      </div>

      {/* Fullscreen toggle (only in 3D mode) */}
      {is3D && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border/30 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Hint text */}
      {is3D && (
        <div className="absolute bottom-4 left-4 z-20">
          <p className="text-[10px] text-white/50 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            <RotateCw className="inline h-3 w-3 mr-1" />
            Drag to rotate · Scroll to zoom
          </p>
        </div>
      )}
    </div>
  );
}
