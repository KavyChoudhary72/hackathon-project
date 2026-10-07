"use client";

import React, { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;
// Milestone keyframe step: 60 evenly spaced frames across the whole 300-frame sequence
const KEYFRAME_STEP = 5;

export const BackgroundStoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingSetRef = useRef<Set<number>>(new Set());
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);

  useEffect(() => {
    // For mobile phones, disable animation and skip frame loading entirely
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imagesRef.current;
    const loadingSet = loadingSetRef.current;
    let isMounted = true;
    let hasDrawnInitial = false;

    // Fast frame loader with deduplication
    const loadFrame = (index: number): Promise<HTMLImageElement | null> => {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
      if (!isMounted || images[clamped]) {
        return Promise.resolve(images[clamped]);
      }
      if (loadingSet.has(clamped)) {
        return Promise.resolve(null);
      }
      loadingSet.add(clamped);

      return new Promise((resolve) => {
        const img = new Image();
        const numStr = String(clamped + 1).padStart(3, "0");
        img.onload = () => {
          loadingSet.delete(clamped);
          if (!isMounted) return resolve(null);
          images[clamped] = img;

          if (clamped === 0 && !hasDrawnInitial) {
            hasDrawnInitial = true;
            draw(0);
          } else {
            const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
            if (Math.abs(clamped - currentIdx) <= 2) {
              draw(currentIdx);
            }
          }
          resolve(img);
        };
        img.onerror = () => {
          loadingSet.delete(clamped);
          resolve(null);
        };
        img.src = `/assets/ezgif-frame-${numStr}.jpg`;
      });
    };

    // On-demand proximity loader: immediately loads a localized window of frames near current scroll
    const loadNearbyFrames = (centerIndex: number) => {
      if (!isMounted) return;
      const windowOffsets = [0, 1, 2, -1, 3, -2, 4];
      for (const offset of windowOffsets) {
        const idx = centerIndex + offset;
        if (idx >= 0 && idx < TOTAL_FRAMES && !images[idx]) {
          loadFrame(idx);
        }
      }
    };

    // Fast Initial Keyframe Grid: loads 60 milestone frames spread evenly across 0% to 100%
    const preloadKeyframeGrid = async () => {
      // 1. Immediately load & render frame 0
      await loadFrame(0);

      // 2. Preload milestones: 0, 5, 10, 15, ..., 295, 299
      const keyIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i += KEYFRAME_STEP) {
        if (i !== 0) keyIndices.push(i);
      }
      if (!keyIndices.includes(TOTAL_FRAMES - 1)) {
        keyIndices.push(TOTAL_FRAMES - 1);
      }

      // Concurrency worker queue (3 workers prevent mobile network congestion)
      const queue = [...keyIndices];
      const activeWorkers = 3;
      const worker = async () => {
        while (queue.length > 0 && isMounted) {
          const nextIdx = queue.shift();
          if (nextIdx !== undefined) {
            await loadFrame(nextIdx);
          }
        }
      };

      await Promise.all(Array.from({ length: activeWorkers }, worker));
    };

    preloadKeyframeGrid();

    // Outward search to guarantee an instant valid frame without blank flash
    const getLoadedImage = (index: number): HTMLImageElement | null => {
      if (images[index]) return images[index];
      // Search outward for closest loaded keyframe
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = index - offset;
        const right = index + offset;
        if (left >= 0 && images[left]) return images[left];
        if (right < TOTAL_FRAMES && images[right]) return images[right];
      }
      return null;
    };

    /**
     * Hardware-accelerated Canvas Render with Integer Pixel Alignment
     */
    const draw = (frameIndex: number) => {
      if (!canvas) return;
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
      const img = getLoadedImage(clampedIndex);

      if (!img || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;

      // Cover-fit math maintaining true aspect ratio
      const scale = Math.max(cw / iw, ch / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.round((cw - dw) * 0.5);
      const dy = Math.round((ch - dh) * 0.5);

      const isMobile = window.innerWidth < 768;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = isMobile ? "medium" : "high";

      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndexRef.current = clampedIndex;
    };

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = (force = false) => {
      if (!canvas) return;
      const currentWidth = window.innerWidth || document.documentElement.clientWidth;
      const currentHeight = window.innerHeight || document.documentElement.clientHeight;

      // Mobile address bar protection: ignore small vertical height oscillations (< 120px)
      const widthChanged = Math.abs(currentWidth - lastWidth) > 5;
      const heightChangedSignificantly = Math.abs(currentHeight - lastHeight) > 120;

      if (!force && !widthChanged && !heightChangedSignificantly && lastWidth > 0) {
        return;
      }

      lastWidth = currentWidth;
      lastHeight = currentHeight;

      const isMobile = currentWidth < 768;
      // Clamp DPR to 1.25 on phones to save GPU memory and prevent lag; 1.5 on desktop
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      const w = Math.round(currentWidth * dpr);
      const h = Math.round(currentHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
        draw(currentIdx);
      }
    };

    resizeCanvas(true);

    // High-performance render loop with adaptive mobile touch lerp
    let rafId: number | null = null;
    let isLoopRunning = false;

    const startLoop = () => {
      if (isLoopRunning || !isMounted) return;
      isLoopRunning = true;
      rafId = requestAnimationFrame(renderLoop);
    };

    const renderLoop = () => {
      if (!isMounted) {
        isLoopRunning = false;
        return;
      }

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        // Mobile phones benefit from a snappier lerp (0.30) that tracks touch swipes without lag
        const isMobile = window.innerWidth < 768;
        const lerpFactor = isMobile ? 0.30 : 0.14;
        currentProgressRef.current += diff * lerpFactor;

        if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.0002) {
          currentProgressRef.current = targetProgressRef.current;
        }

        const targetFrame = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
        if (targetFrame !== lastDrawnIndexRef.current) {
          draw(targetFrame);
        }

        rafId = requestAnimationFrame(renderLoop);
      } else {
        isLoopRunning = false;
        rafId = null;
      }
    };

    // Passive touch and scroll listener
    const handleScroll = () => {
      const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

      targetProgressRef.current = progress;
      const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));

      // Trigger on-demand proximity load for nearby frames
      loadNearbyFrames(targetFrame);

      startLoop();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    window.addEventListener("resize", () => resizeCanvas(false), { passive: true });

    handleScroll();

    return () => {
      isMounted = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      window.removeEventListener("resize", () => resizeCanvas(false));
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 w-full h-[100dvh] -z-10 pointer-events-none select-none overflow-hidden bg-[#0A1612]"
    >
      {/* Hardware-accelerated High-Fidelity Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="w-full h-full block"
      />

      {/* Balanced Cinematic Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/65 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
    </div>
  );
};
