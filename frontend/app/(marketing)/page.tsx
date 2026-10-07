"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { BackgroundStoryCanvas } from "@/components/marketing/BackgroundStoryCanvas";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ImpactStats } from "@/components/marketing/ImpactStats";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { AboutSection } from "@/components/marketing/AboutSection";

export default function HomePage() {
  const [activeChapter, setActiveChapter] = useState<string>("home");

  // Track active chapter based on scroll position (throttled with RAF)
  useEffect(() => {
    let ticking = false;
    let offsets = { howItWorksTop: 800, impactTop: 1600, aboutTop: 2400 };

    const computeOffsets = () => {
      const howItWorks = document.getElementById("how-it-works");
      const impact = document.getElementById("impact");
      const about = document.getElementById("about");
      offsets = {
        howItWorksTop: howItWorks ? howItWorks.offsetTop - 300 : 800,
        impactTop: impact ? impact.offsetTop - 300 : 1600,
        aboutTop: about ? about.offsetTop - 300 : 2400,
      };
    };

    computeOffsets();

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < offsets.howItWorksTop) {
            setActiveChapter("home");
          } else if (scrollY >= offsets.howItWorksTop && scrollY < offsets.impactTop) {
            setActiveChapter("how-it-works");
          } else if (scrollY >= offsets.impactTop && scrollY < offsets.aboutTop) {
            setActiveChapter("impact");
          } else {
            setActiveChapter("about");
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", computeOffsets, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", computeOffsets);
    };
  }, []);

  const handleNavigateChapter = useCallback((chapterId: string) => {
    setActiveChapter(chapterId);
    if (chapterId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(chapterId);
    if (elem) {
      const navOffset = 90;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <main className="min-h-screen text-[#142921] selection:bg-[#E8F5E9] selection:text-[#113A2B] relative font-sans overflow-x-hidden bg-[#0A1612]">
      {/* 
        High-performance background canvas rendering all 300 frames 
        from start to finish as user scrolls through the entire page
      */}
      <BackgroundStoryCanvas />

      {/* Floating Dynamic Navbar */}
      <Navbar
        activeChapter={activeChapter}
        onNavigateChapter={handleNavigateChapter}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* 4 Stat KPI Cards */}
      <ImpactStats />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Community & About Section */}
      <AboutSection />

    </main>
  );
}