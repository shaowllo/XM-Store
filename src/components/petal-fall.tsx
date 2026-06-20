"use client";

import { useEffect, useRef, useCallback } from "react";

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  speedX: number;
  wobbleAmp: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
  depth: number;
  hue: number;
  saturation: number;
  lightness: number;
}

const PETAL_COUNT = 28;

export function PetalFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const createPetal = useCallback((canvasWidth: number, canvasHeight: number, startY?: number): Petal => {
    const depth = Math.random();
    return {
      id: Math.random(),
      x: Math.random() * canvasWidth,
      y: startY !== undefined ? startY : -20 - Math.random() * canvasHeight * 0.5,
      size: 8 + depth * 14,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      speedY: 0.3 + depth * 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      wobbleAmp: 30 + Math.random() * 40,
      wobbleSpeed: 0.005 + Math.random() * 0.01,
      wobbleOffset: Math.random() * Math.PI * 2,
      opacity: 0.15 + depth * 0.45,
      depth,
      hue: 330 + Math.random() * 30,
      saturation: 50 + Math.random() * 30,
      lightness: 75 + Math.random() * 15,
    };
  }, []);

  const drawPetal = useCallback((ctx: CanvasRenderingContext2D, petal: Petal) => {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate((petal.rotation * Math.PI) / 180);
    ctx.scale(petal.size / 10, petal.size / 10);
    ctx.globalAlpha = petal.opacity;

    const gradient = ctx.createRadialGradient(5, 2, 0, 5, 4, 10);
    gradient.addColorStop(0, `hsla(${petal.hue}, ${petal.saturation}%, ${petal.lightness + 10}%, 0.9)`);
    gradient.addColorStop(1, `hsla(${petal.hue}, ${petal.saturation}%, ${petal.lightness - 5}%, 0.6)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(2, -4, 8, -6, 10, -2);
    ctx.bezierCurveTo(12, 2, 8, 8, 4, 8);
    ctx.bezierCurveTo(0, 8, -2, 4, 0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = petal.opacity * 0.3;
    ctx.strokeStyle = `hsla(${petal.hue}, ${petal.saturation}%, ${petal.lightness + 20}%, 0.5)`;
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.quadraticCurveTo(5, 3, 6, 6);
    ctx.stroke();

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    petalsRef.current = Array.from({ length: PETAL_COUNT }, () =>
      createPetal(window.innerWidth, window.innerHeight, Math.random() * window.innerHeight)
    );

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;

      for (const petal of petalsRef.current) {
        petal.y += petal.speedY;
        petal.x += petal.speedX + Math.sin(timeRef.current * petal.wobbleSpeed + petal.wobbleOffset) * 0.5;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > h + 30) {
          Object.assign(petal, createPetal(w, h, -20));
        }
        if (petal.x < -30) petal.x = w + 30;
        if (petal.x > w + 30) petal.x = -30;

        drawPetal(ctx, petal);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createPetal, drawPetal]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden="true"
    />
  );
}
