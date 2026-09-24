"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FrameSequenceManager } from "./FrameSequenceManager";
import { StoryCanvas } from "./StoryCanvas";
import { StoryNavigation } from "./StoryNavigation";
import { StoryChapter } from "./StoryChapter";
import { STORY_CHAPTERS, TOTAL_FRAMES } from "@/lib/frameSequence";
import { HeroStoryOverlay } from "@/components/marketing/HeroStoryOverlay";
import { HowItWorksStory } from "@/components/marketing/HowItWorksStory";
import { ImpactStory } from "@/components/marketing/ImpactStory";
import { AboutStory } from "@/components/marketing/AboutStory";
import "./storyScroller.css";

interface StoryScrollerProps {
  onChapterChange?: (chapterId: string) => void;
  activeChapter?: string;
}

export const StoryScroller: React.FC<StoryScrollerProps> = ({
  onChapterChange,
  activeChapter = "home",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<FrameSequenceManager | null>(null);

  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [isPreloaderDismissed, setIsPreloaderDismissed] = useState<boolean>(false);
  const [currentProgressDisplay, setCurrentProgressDisplay] = useState<number>(0);

  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);
  const lastDrawnFrame = useRef<number>(-1);
  const currentChapterRef = useRef<string>("home");

  // Resize canvas according to DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const newW = Math.round(width * dpr);
    const newH = Math.round(height * dpr);

    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW;
      canvas.height = newH;
      // Redraw immediately on resize
      if (managerRef.current && lastDrawnFrame.current >= 0) {
        managerRef.current.drawFrame(canvas, lastDrawnFrame.current, true);
      }
    }
  }, []);

  // Central requestAnimationFrame render loop
  useEffect(() => {
    const manager = new FrameSequenceManager();
    managerRef.current = manager;

    // Track loading progress
    const unsubProgress = manager.onProgress((percent) => {
      setLoadPercent(percent);
    });

    // When initial frames are decoded, immediately draw frame 0 and dismiss preloader quickly
    const unsubReady = manager.onInitialReady(() => {
      resizeCanvas();
      if (canvasRef.current) {
        manager.drawFrame(canvasRef.current, 0, true);
        lastDrawnFrame.current = 0;
      }
      setTimeout(() => {
        setIsPreloaderDismissed(true);
      }, 400);
    });

    // Start prioritized preloading
    manager.preloadFrames();
    resizeCanvas();

    let rafId: number;
    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const diff = targetProgress.current - currentProgress.current;

      if (Math.abs(diff) > 0.0001) {
        // Direct snappy lerp (0.45) for immediate responsiveness without artificial lag
        currentProgress.current += diff * 0.45;
        if (Math.abs(targetProgress.current - currentProgress.current) < 0.0005) {
          currentProgress.current = targetProgress.current;
        }

        const total = manager.getFrameCount();
        const frameIndex = Math.min(
          total - 1,
          Math.max(0, Math.round(currentProgress.current * (total - 1)))
        );

        if (canvasRef.current && frameIndex !== lastDrawnFrame.current) {
          manager.drawFrame(canvasRef.current, frameIndex);
          lastDrawnFrame.current = frameIndex;
        }

        // Determine active chapter
        let activeId = "home";
        for (const chap of STORY_CHAPTERS) {
          if (
            currentProgress.current >= chap.startProgress &&
            currentProgress.current < chap.endProgress
          ) {
            activeId = chap.id;
            break;
          }
        }
        if (currentProgress.current >= 0.98) {
          activeId = "about";
        }

        if (activeId !== currentChapterRef.current) {
          currentChapterRef.current = activeId;
          if (onChapterChange) {
            onChapterChange(activeId);
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Passive scroll listener
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const relativeScroll = window.scrollY - containerTop;
      const progress = Math.max(0, Math.min(1, relativeScroll / scrollableDistance));

      targetProgress.current = progress;
      setCurrentProgressDisplay(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      unsubProgress();
      unsubReady();
      manager.destroy();
    };
  }, [resizeCanvas, onChapterChange]);

  // Smooth navigation to chapter
  const handleNavigate = useCallback((chapterId: string) => {
    const container = containerRef.current;
    if (!container) return;

    const chapter = STORY_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return;

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollableDistance = rect.height - window.innerHeight;

    // Scroll to exact chapter start position
    const targetScrollY = containerTop + chapter.startProgress * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="story-container relative w-full"
      style={{ height: "550vh" }}
    >
      {/* INITIAL FAST PRELOADER (Dismissed once sequence is primed) */}
      {!isPreloaderDismissed && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A1612] transition-opacity duration-500 ${
            loadPercent >= 15 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
            {/* Animated Logo */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl animate-pulse-glow">
              <svg
                className="w-10 h-10"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 6C13.2 2.8 8.8 2.8 6 5.6C3.2 8.4 3.2 12.8 6.5 15.5L16 23.5V6Z"
                  fill="#F9683A"
                />
                <path
                  d="M16 6C18.8 2.8 23.2 2.8 26 5.6C28.8 8.4 28.8 12.8 25.5 15.5L16 23.5V6Z"
                  fill="#16A34A"
                />
                <circle cx="16" cy="20.5" r="4" fill="#F5A623" />
              </svg>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                FoodLink Story
              </div>
              <div className="text-[13px] text-neutral-400 mt-1">
                Priming cinematic sequence...
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#F9683A] transition-all duration-150 rounded-full"
                style={{ width: `${Math.max(10, loadPercent)}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              {loadPercent}%
            </div>
          </div>
        </div>
      )}

      {/* STICKY HARDWARE ACCELERATED CANVAS */}
      <StoryCanvas canvasRef={canvasRef} />

      {/* FLOATING SIDE STORY NAVIGATION */}
      <StoryNavigation
        activeChapter={currentChapterRef.current}
        onNavigate={handleNavigate}
        scrollProgress={currentProgressDisplay}
      />

      {/* STORY CONTENT SECTIONS (Mapped along the 550vh track) */}
      <div className="story-content relative z-10 -mt-[100vh]">
        {/* CHAPTER 1: HOME */}
        <StoryChapter id="home">
          <HeroStoryOverlay onSeeHowItWorks={() => handleNavigate("how-it-works")} />
        </StoryChapter>

        {/* CHAPTER 2: HOW IT WORKS */}
        <StoryChapter id="how-it-works">
          <HowItWorksStory />
        </StoryChapter>

        {/* CHAPTER 3: IMPACT */}
        <StoryChapter id="impact">
          <ImpactStory />
        </StoryChapter>

        {/* CHAPTER 4: ABOUT */}
        <StoryChapter id="about">
          <AboutStory />
        </StoryChapter>
      </div>
    </div>
  );
};
