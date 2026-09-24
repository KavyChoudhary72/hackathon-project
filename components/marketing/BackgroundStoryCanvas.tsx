"use client";

import React, { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;

export const BackgroundStoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imagesRef.current;
    let isMounted = true;
    let hasDrawnInitial = false;

    // Fast, reliable preloading of all 300 frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i + 1).padStart(3, "0");
      img.onload = () => {
        if (!isMounted) return;
        images[i] = img;

        if (i === 0 && !hasDrawnInitial) {
          hasDrawnInitial = true;
          draw(0);
        } else if (i === Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1))) {
          draw(i);
        }
      };
      img.src = `/assets/ezgif-frame-${numStr}.jpg`;
    }

    const getLoadedImage = (index: number): HTMLImageElement | null => {
      if (images[index]) return images[index];
      // Search outward for closest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && images[index - offset]) return images[index - offset];
        if (index + offset < TOTAL_FRAMES && images[index + offset]) return images[index + offset];
      }
      return null;
    };

    /**
     * Crystal-clear hardware-accelerated draw.
     * Uses discrete, sharp 1080p frames at integer pixel alignment (zero ghosting/distortion).
     */
    const draw = (frameIndex: number) => {
      if (!canvas) return;
      const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
      const img = getLoadedImage(clampedIndex);

      if (!img || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;

      // Exact 16:9 aspect-ratio cover crop centered
      const scale = Math.max(cw / iw, ch / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.round((cw - dw) * 0.5);
      const dy = Math.round((ch - dh) * 0.5);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw pure, unghosted frame with full fidelity
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndexRef.current = clampedIndex;
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
        draw(currentIdx);
      }
    };

    resizeCanvas();

    // DELIBERATE CINEMATIC SLOWED-DOWN RENDER LOOP
    // Normalized to 60fps baseline so 120Hz/144Hz monitors never run 2x-3x faster
    let rafId: number;
    let lastTime = typeof performance !== "undefined" ? performance.now() : 0;

    const renderLoop = (now: number) => {
      if (!isMounted) return;

      const dt = lastTime > 0 ? Math.min(64, Math.max(1, now - lastTime)) : 16.667;
      lastTime = now;
      const dtRatio = dt / 16.667; // Normalized to 60fps (16.667ms)

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.00003) {
        // Deliberate cinematic slow pacing:
        // Capped at 0.14 frames per 60fps tick (~8.4 frames per second maximum playback speed)
        // Guarantees the animation NEVER rushes or fast-forwards even on aggressive scrolls or fast wheels!
        const maxFramesPerTick = 0.14 * dtRatio;
        const maxProgressPerTick = maxFramesPerTick / (TOTAL_FRAMES - 1);

        // Silky, luxurious momentum (gentle 0.016 lerp per 60fps tick)
        let delta = diff * (0.016 * dtRatio);
        if (Math.abs(delta) > maxProgressPerTick) {
          delta = Math.sign(delta) * maxProgressPerTick;
        }

        currentProgressRef.current += delta;

        if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.00008) {
          currentProgressRef.current = targetProgressRef.current;
        }

        const targetFrame = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
        if (targetFrame !== lastDrawnIndexRef.current) {
          draw(targetFrame);
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Passive scroll listener
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
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="w-full h-full block"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/65 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
    </div>
  );
};
