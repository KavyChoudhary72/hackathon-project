"use client";

import React, { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;

export const BackgroundStoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imagesRef.current;
    let isMounted = true;
    let hasDrawnInitial = false;

    // Fast and robust preloading of all 300 frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i + 1).padStart(3, "0");
      img.onload = () => {
        if (!isMounted) return;
        images[i] = img;

        // Draw frame 0 immediately once ready
        if (i === 0 && !hasDrawnInitial) {
          hasDrawnInitial = true;
          draw(0);
        }

        // If the current scroll position is on this frame, redraw
        if (i === currentFrameRef.current) {
          draw(i);
        }
      };
      img.src = `/assets/ezgif-frame-${numStr}.jpg`;
    }

    const getLoadedImage = (index: number): HTMLImageElement | null => {
      if (images[index]) return images[index];
      // Search outward for closest loaded frame so there is NEVER a blank screen
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && images[index - offset]) return images[index - offset];
        if (index + offset < TOTAL_FRAMES && images[index + offset]) return images[index + offset];
      }
      return null;
    };

    const draw = (index: number) => {
      if (!canvas) return;
      const img = getLoadedImage(index);
      if (!img || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Aspect-ratio cover crop centered
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) * 0.5;
      const dy = (ch - dh) * 0.5;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnFrameRef.current = index;
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        draw(currentFrameRef.current);
      }
    };

    resizeCanvas();

    // Smooth render loop
    let rafId: number;
    const renderLoop = () => {
      if (!isMounted) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        // Snappy lerp (0.35) for immediate responsiveness to scroll
        currentProgressRef.current += diff * 0.35;
        if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.0005) {
          currentProgressRef.current = targetProgressRef.current;
        }

        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          draw(frameIndex);
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Passive scroll listener mapping full page height to all 300 frames
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    handleScroll();

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen -z-10 pointer-events-none select-none overflow-hidden bg-[#0A1612]"
    >
      {/* Hardware-accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover transform-gpu"
      />

      {/* Atmospheric Scrims:
          - Top shadow for floating navbar clarity
          - Soft center contrast so text & cards have pristine readability
          - Bottom dark fade
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
    </div>
  );
};
