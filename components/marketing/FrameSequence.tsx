"use client";

import React, { useRef, useEffect, useState } from "react";

export interface ChapterRange {
  id: string;
  start: number;
  end: number;
  title: string;
}

export interface FrameSequenceProps {
  manifestUrl?: string;
  mobileManifestUrl?: string;
  posterSrc?: string;
  chapters: ChapterRange[];
  progress: number; // 0.0 to 1.0 from GSAP ScrollTrigger
  placeholder?: boolean;
}

export const FrameSequence: React.FC<FrameSequenceProps> = ({
  manifestUrl = "/sequence/desktop/manifest.json",
  chapters,
  progress,
  placeholder = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameCount] = useState(120);

  // Compute active chapter and frame number
  const currentFrame = Math.min(
    frameCount,
    Math.max(1, Math.round(progress * frameCount))
  );

  const activeChapter =
    chapters.find((c) => progress >= c.start && progress <= c.end) ||
    chapters[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // PLACEHOLDER MODE: Cinematic dynamic brand gradient mesh
    // Smooth transition from dark forest (#113A2B) to warm golden peach to rich mist
    const grad = ctx.createLinearGradient(
      0,
      0,
      width * Math.cos(progress * Math.PI * 0.5),
      height * Math.sin(progress * Math.PI * 0.5)
    );

    if (progress < 0.25) {
      // C1: Midnight Wedding Banquet
      grad.addColorStop(0, "#081C15");
      grad.addColorStop(0.6, "#113A2B");
      grad.addColorStop(1, "#1B4332");
    } else if (progress < 0.5) {
      // C2-C3: Urgent Match & Proximity
      grad.addColorStop(0, "#113A2B");
      grad.addColorStop(0.7, "#2D6A4F");
      grad.addColorStop(1, "#F9683A");
    } else if (progress < 0.75) {
      // C4-C5: The Route & 3-Tier Cascade
      grad.addColorStop(0, "#1B4332");
      grad.addColorStop(0.5, "#F59E0B");
      grad.addColorStop(1, "#E8F5E9");
    } else {
      // C6-C8: Verification, Rewards & Daybreak
      grad.addColorStop(0, "#FAF9F5");
      grad.addColorStop(0.5, "#E8F5E9");
      grad.addColorStop(1, "#D1FAE5");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic grid overlay
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Interactive HUD watermark in placeholder mode
    ctx.fillStyle = progress > 0.75 ? "rgba(17, 58, 43, 0.6)" : "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 11px monospace";
    ctx.fillText(
      `[FrameSequence Placeholder] Frame: ${currentFrame.toString().padStart(4, "0")} / ${frameCount}`,
      24,
      height - 40
    );
    ctx.fillText(
      `Scrub Progress: ${(progress * 100).toFixed(1)}% | Chapter: ${activeChapter.title}`,
      24,
      height - 24
    );

    // Progress bar line on bottom
    ctx.fillStyle = "#F9683A";
    ctx.fillRect(0, height - 4, width * progress, 4);

    ctx.restore();
  }, [progress, currentFrame, activeChapter, frameCount]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block select-none"
      />
    </div>
  );
};