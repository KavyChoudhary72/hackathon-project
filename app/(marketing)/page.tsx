"use client";

import React, { useState, useCallback, useRef } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import {
  StoryScroller,
  StoryScrollerHandle,
} from "@/components/StoryScroller/StoryScroller";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  const [activeChapter, setActiveChapter] = useState<string>("home");
  const storyScrollerRef = useRef<StoryScrollerHandle>(null);

  const handleChapterChange = useCallback((chapterId: string) => {
    setActiveChapter(chapterId);
  }, []);

  const handleNavigateChapter = useCallback((chapterId: string) => {
    setActiveChapter(chapterId);
    storyScrollerRef.current?.scrollToChapter(chapterId);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1612] text-white selection:bg-[#E8F5E9] selection:text-[#113A2B] overflow-x-hidden relative font-sans">
      {/* Floating Dynamic Navbar */}
      <Navbar
        activeChapter={activeChapter}
        onNavigateChapter={handleNavigateChapter}
      />

      {/* Apple-style Cinematic Scroll-Driven Visual Story */}
      <StoryScroller
        ref={storyScrollerRef}
        activeChapter={activeChapter}
        onChapterChange={handleChapterChange}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}