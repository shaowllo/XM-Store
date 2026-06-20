"use client";

import { useRef, useState, useCallback } from "react";

interface MagnifierZoomProps {
  /** The source image URL to magnify. */
  src: string;
  /** Alt text for the image. */
  alt: string;
  /** Zoom factor (default 2.5). */
  zoom?: number;
  /** Lens size in pixels (default 160). */
  lensSize?: number;
  /** CSS classes for the wrapper. */
  className?: string;
}

/**
 * Desktop-only magnifier zoom effect.
 *
 * Algorithm (pixel-based):
 * 1. Lens is centered on the cursor, clamped within bounds.
 * 2. Background image is rendered at `zoom × container` size.
 * 3. The zoomed pixel at `(clampedX × zoom, clampedY × zoom)` is aligned
 *    to container position `(clampedX, clampedY)` — the lens center.
 * 4. Therefore background-position (in px) is `-clamped × (zoom − 1)`.
 */
export function MagnifierZoom({
  src,
  alt,
  zoom = 2.5,
  lensSize = 160,
  className = "",
}: MagnifierZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef({ w: 0, h: 0 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      containerSizeRef.current = { w: rect.width, h: rect.height };

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clamp lens center so the lens stays within the container
      const half = lensSize / 2;
      const centerX = Math.max(half, Math.min(rect.width - half, x));
      const centerY = Math.max(half, Math.min(rect.height - half, y));

      // Lens top-left position
      setLensPos({ x: centerX - half, y: centerY - half });

      // Pixel-based background offset (px).
      // The zoomed-image pixel at (centerX × zoom) should align
      // with container position centerX. So we shift the background
      // left by centerX × (zoom − 1) pixels.
      setBgOffset({
        x: -(centerX * (zoom - 1)),
        y: -(centerY * (zoom - 1)),
      });
    },
    [lensSize, zoom]
  );

  const { w, h } = containerSizeRef.current;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ cursor: visible ? "none" : "zoom-in" }}
    >
      {/* Base image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
      />

      {/* Lens overlay */}
      {visible && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white/70 shadow-2xl"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPos.x,
            top: lensPos.y,
            backgroundImage: `url(${src})`,
            backgroundSize: w > 0 ? `${w * zoom}px ${h * zoom}px` : `${zoom * 100}%`,
            backgroundPosition: `${bgOffset.x}px ${bgOffset.y}px`,
            backgroundRepeat: "no-repeat",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
