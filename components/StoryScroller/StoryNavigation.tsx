"use client";

import React from "react";
import { STORY_CHAPTERS, StoryChapter } from "@/lib/frameSequence";

interface StoryNavigationProps {
  activeChapter: string;
  onNavigate: (chapterId: string) => void;
  scrollProgress: number;
}

export const StoryNavigation: React.FC<StoryNavigationProps> = ({
  activeChapter,
  onNavigate,
  scrollProgress,
}) => {
  return (
    <aside
      aria-label="Story chapters"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3.5 select-none pointer-events-auto"
    >
      <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-full py-3 px-2 flex flex-col items-center gap-3 shadow-xl">
        {STORY_CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <button
              key={chapter.id}
              onClick={() => onNavigate(chapter.id)}
              className="group relative flex items-center justify-center p-1.5 focus:outline-none"
              aria-label={`Scroll to ${chapter.label}`}
              title={chapter.label}
            >
              {/* Tooltip Label on hover */}
              <span className="absolute right-8 px-2.5 py-1 rounded-md bg-black/80 text-white text-[12px] font-medium tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-white/10">
                {chapter.label}
              </span>

              {/* Indicator Dot */}
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-2.5 h-6 bg-[#22C55E] shadow-[0_0_10px_#22C55E]"
                    : "w-2 h-2 bg-white/40 group-hover:bg-white/80"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Progress percentage pill */}
      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold text-white/80">
        {Math.round(scrollProgress * 100)}%
      </div>
    </aside>
  );
};
