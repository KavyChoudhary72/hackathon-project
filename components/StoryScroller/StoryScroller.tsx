"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FrameSequenceManager } from "./FrameSequenceManager";
import { StoryCanvas } from "./StoryCanvas";
import { StoryNavigation } from "./StoryNavigation";
import { STORY_CHAPTERS, TOTAL_FRAMES } from "@/lib/frameSequence";
import { HeroStoryOverlay } from "@/components/marketing/HeroStoryOverlay";
import { HowItWorksStory } from "@/components/marketing/HowItWorksStory";
import { ImpactStory } from "@/components/marketing/ImpactStory";
import { AboutStory } from "@/components/marketing/AboutStory";
import "./storyScroller.css";

export interface StoryScrollerHandle {
  scrollToChapter: (chapterId: string) => void;
}

interface StoryScrollerProps {
  onChapterChange?: (chapterId: string) => void;
  activeChapter?: string;
}

function computeChapterStyles(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) {
  let opacity = 0;
  let translateY = 20;

  if (p >= inStart && p <= outEnd) {
    if (p < inEnd) {
      const t = inEnd === inStart ? 1 : (p - inStart) / (inEnd - inStart);
      opacity = t;
      translateY = 20 * (1 - t);
    } else if (p <= outStart) {
      opacity = 1;
      translateY = 0;
    } else {
      const t = outEnd === outStart ? 1 : (p - outStart) / (outEnd - outStart);
      opacity = 1 - t;
      translateY = -20 * t;
    }
  } else if (p < inStart) {
    opacity = 0;
    translateY = 20;
  } else {
    opacity = 0;
    translateY = -20;
  }

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return {
    opacity: clampedOpacity,
    translateY,
    isInteractive: clampedOpacity > 0.6,
    isVisible: clampedOpacity > 0.005,
  };
}

export const StoryScroller = forwardRef<StoryScrollerHandle, StoryScrollerProps>(
  ({ onChapterChange, activeChapter = "home" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const managerRef = useRef<FrameSequenceManager | null>(null);

    // Chapter DOM refs for 60fps direct style updates
    const homeChapterRef = useRef<HTMLDivElement>(null);
    const howItWorksChapterRef = useRef<HTMLDivElement>(null);
    const impactChapterRef = useRef<HTMLDivElement>(null);
    const aboutChapterRef = useRef<HTMLDivElement>(null);

    const [loadPercent, setLoadPercent] = useState<number>(0);
    const [isPreloaderDismissed, setIsPreloaderDismissed] = useState<boolean>(false);
    const [currentProgressDisplay, setCurrentProgressDisplay] = useState<number>(0);

    const targetProgress = useRef<number>(0);
    const currentProgress = useRef<number>(0);
    const lastDrawnFrame = useRef<number>(-1);
    const currentChapterRef = useRef<string>("home");

    // Imperative scroll to chapter
    const scrollToChapter = useCallback((chapterId: string) => {
      const container = containerRef.current;
      if (!container) return;

      const chapter = STORY_CHAPTERS.find((c) => c.id === chapterId);
      if (!chapter) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const targetScrollY = containerTop + chapter.targetProgress * scrollableDistance;

      window.scrollTo({
        top: Math.round(targetScrollY),
        behavior: "smooth",
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        scrollToChapter,
      }),
      [scrollToChapter]
    );

    // Canvas resize calculation
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        2
      );
      const width = window.innerWidth;
      const height = window.innerHeight;

      const newW = Math.round(width * dpr);
      const newH = Math.round(height * dpr);

      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW;
        canvas.height = newH;
        if (managerRef.current && lastDrawnFrame.current >= 0) {
          managerRef.current.drawFrame(canvas, lastDrawnFrame.current, true);
        }
      }
    }, []);

    // Master render loop
    useEffect(() => {
      const manager = new FrameSequenceManager();
      managerRef.current = manager;

      const unsubProgress = manager.onProgress((percent) => {
        setLoadPercent(percent);
      });

      const unsubReady = manager.onInitialReady(() => {
        resizeCanvas();
        if (canvasRef.current) {
          manager.drawFrame(canvasRef.current, 0, true);
          lastDrawnFrame.current = 0;
        }
        setTimeout(() => {
          setIsPreloaderDismissed(true);
        }, 300);
      });

      manager.preloadFrames();
      resizeCanvas();

      let rafId: number;
      let isRunning = true;

      const updateOverlays = (p: number) => {
        // 1. Home Chapter (p: 0.0 -> 0.24)
        if (homeChapterRef.current) {
          const s = computeChapterStyles(p, 0.0, 0.01, 0.17, 0.24);
          homeChapterRef.current.style.opacity = s.opacity.toFixed(3);
          homeChapterRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px)`;
          homeChapterRef.current.style.pointerEvents = s.isInteractive ? "auto" : "none";
          homeChapterRef.current.style.visibility = s.isVisible ? "visible" : "hidden";
        }

        // 2. How It Works Chapter (p: 0.24 -> 0.54)
        if (howItWorksChapterRef.current) {
          const s = computeChapterStyles(p, 0.22, 0.28, 0.48, 0.54);
          howItWorksChapterRef.current.style.opacity = s.opacity.toFixed(3);
          howItWorksChapterRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px)`;
          howItWorksChapterRef.current.style.pointerEvents = s.isInteractive ? "auto" : "none";
          howItWorksChapterRef.current.style.visibility = s.isVisible ? "visible" : "hidden";
        }

        // 3. Impact Chapter (p: 0.54 -> 0.78)
        if (impactChapterRef.current) {
          const s = computeChapterStyles(p, 0.52, 0.58, 0.72, 0.78);
          impactChapterRef.current.style.opacity = s.opacity.toFixed(3);
          impactChapterRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px)`;
          impactChapterRef.current.style.pointerEvents = s.isInteractive ? "auto" : "none";
          impactChapterRef.current.style.visibility = s.isVisible ? "visible" : "hidden";
        }

        // 4. About Chapter (p: 0.78 -> 1.0)
        if (aboutChapterRef.current) {
          const s = computeChapterStyles(p, 0.76, 0.82, 0.99, 1.0);
          aboutChapterRef.current.style.opacity = s.opacity.toFixed(3);
          aboutChapterRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px)`;
          aboutChapterRef.current.style.pointerEvents = s.isInteractive ? "auto" : "none";
          aboutChapterRef.current.style.visibility = s.isVisible ? "visible" : "hidden";
        }
      };

      const renderLoop = () => {
        if (!isRunning) return;

        const diff = targetProgress.current - currentProgress.current;

        if (Math.abs(diff) > 0.0001) {
          // Direct snappy lerp (0.4) for immediate responsiveness without lag
          currentProgress.current += diff * 0.4;
          if (Math.abs(targetProgress.current - currentProgress.current) < 0.0004) {
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

          // Direct DOM updates for 60fps cinematic text transitions
          updateOverlays(currentProgress.current);

          // Determine active chapter for navbar and side dock
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
          if (currentProgress.current >= 0.97) {
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

      // Initialize overlays at progress 0
      updateOverlays(0);

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

    return (
      <div
        ref={containerRef}
        className="story-container relative w-full"
        style={{ height: "480vh" }}
      >
        {/* PRELOADER SCREEN (Quickly dismissed once first frames ready) */}
        {!isPreloaderDismissed && (
          <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A1612] transition-opacity duration-500 ${
              loadPercent >= 12 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
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

        {/* PINNED HARDWARE-ACCELERATED CANVAS */}
        <StoryCanvas canvasRef={canvasRef} />

        {/* FLOATING SIDE PROGRESS HUD */}
        <StoryNavigation
          activeChapter={currentChapterRef.current}
          onNavigate={scrollToChapter}
          scrollProgress={currentProgressDisplay}
        />

        {/* PINNED VIEWPORT: CHAPTER OVERLAYS SYNCHRONIZED TO SCROLL */}
        <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 flex items-center justify-center -mt-[100vh]">
          {/* CHAPTER 1: HOME */}
          <div
            id="home"
            ref={homeChapterRef}
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 will-change-[transform,opacity]"
          >
            <div className="max-w-[1340px] w-full mx-auto">
              <HeroStoryOverlay onSeeHowItWorks={() => scrollToChapter("how-it-works")} />
            </div>
          </div>

          {/* CHAPTER 2: HOW IT WORKS */}
          <div
            id="how-it-works"
            ref={howItWorksChapterRef}
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 will-change-[transform,opacity]"
          >
            <div className="max-w-[1340px] w-full mx-auto">
              <HowItWorksStory />
            </div>
          </div>

          {/* CHAPTER 3: IMPACT */}
          <div
            id="impact"
            ref={impactChapterRef}
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 will-change-[transform,opacity]"
          >
            <div className="max-w-[1340px] w-full mx-auto">
              <ImpactStory />
            </div>
          </div>

          {/* CHAPTER 4: ABOUT */}
          <div
            id="about"
            ref={aboutChapterRef}
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 will-change-[transform,opacity]"
          >
            <div className="max-w-[1340px] w-full mx-auto">
              <AboutStory />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StoryScroller.displayName = "StoryScroller";
