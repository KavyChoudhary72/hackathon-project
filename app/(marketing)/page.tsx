"use client";

import React, { useState, useCallback } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { StoryScroller } from "@/components/StoryScroller/StoryScroller";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  const [activeChapter, setActiveChapter] = useState<string>("home");

  const handleChapterChange = useCallback((chapterId: string) => {
    setActiveChapter(chapterId);
  }, []);

  const handleNavigateChapter = useCallback((chapterId: string) => {
    setActiveChapter(chapterId);
    const elem = document.getElementById(chapterId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
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
        activeChapter={activeChapter}
        onChapterChange={handleChapterChange}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}