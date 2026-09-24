"use client";

import React, { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;

export const BackgroundStoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isActivelyDrawingRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imagesRef.current;
    let isMounted = true;
    let hasDrawnInitial = false;

    // Fast and robust parallel preloading of all 300 frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i + 1).padStart(3, "0");
      img.onload = () => {
        if (!isMounted) return;
        images[i] = img;

        // Draw initial frame immediately on load
        if (i === 0 && !hasDrawnInitial) {
          hasDrawnInitial = true;
          draw(0);
        }
      };
      img.src = `/assets/ezgif-frame-${numStr}.jpg`;
    }

    const getLoadedImage = (index: number): HTMLImageElement | null => {
      if (images[index]) return images[index];
      // Search outward for nearest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && images[index - offset]) return images[index - offset];
        if (index + offset < TOTAL_FRAMES && images[index + offset]) return images[index + offset];
      }
      return null;
    };

    /**
     * Sub-frame GPU alpha-blending for infinite frame density.
     * Smoothly crossfades between adjacent frames so motion is 100% continuous.
     */
    const draw = (frameFloat: number) => {
      if (!canvas) return;
      const clampedFloat = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameFloat));
      const indexA = Math.floor(clampedFloat);
      const indexB = Math.min(TOTAL_FRAMES - 1, indexA + 1);
      const blend = clampedFloat - indexA;

      const imgA = getLoadedImage(indexA);
      const imgB = indexB !== indexA ? getLoadedImage(indexB) : null;

      if (!imgA || !imgA.naturalWidth) return;

      const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = imgA.naturalWidth;
      const ih = imgA.naturalHeight;

      // Aspect-ratio cover crop centered
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) * 0.5;
      const dy = (ch - dh) * 0.5;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Draw base frame A
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, dx, dy, dw, dh);

      // 2. Hardware crossfade blend with frame B for buttery sub-frame continuity
      if (blend > 0.015 && imgB && imgB.naturalWidth) {
        ctx.globalAlpha = blend;
        ctx.drawImage(imgB, dx, dy, dw, dh);
      }
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const currentFrameFloat = currentProgressRef.current * (TOTAL_FRAMES - 1);
        draw(currentFrameFloat);
      }
    };

    resizeCanvas();

    // Smooth momentum render loop (adds 3-4 seconds of sustained fluid glide)
    let rafId: number;
    const renderLoop = () => {
      if (!isMounted) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.00005) {
        // Damped momentum (0.075) extends the scroll animation by 3-4 seconds of luxurious fluid motion
        currentProgressRef.current += diff * 0.075;

        if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.0001) {
          currentProgressRef.current = targetProgressRef.current;
        }

        const currentFrameFloat = currentProgressRef.current * (TOTAL_FRAMES - 1);
        draw(currentFrameFloat);
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
      {/* Hardware-accelerated Sub-Frame Canvas */}
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
