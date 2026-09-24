"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { BackgroundStoryCanvas } from "@/components/marketing/BackgroundStoryCanvas";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ImpactStats } from "@/components/marketing/ImpactStats";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { AboutSection } from "@/components/marketing/AboutSection";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  const [activeChapter, setActiveChapter] = useState<string>("home");

  // Track active chapter based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const impact = document.getElementById("impact");
      const howItWorks = document.getElementById("how-it-works");
      const about = document.getElementById("about");

      const impactTop = impact ? impact.offsetTop - 300 : 1000;
      const howItWorksTop = howItWorks ? howItWorks.offsetTop - 300 : 2000;
      const aboutTop = about ? about.offsetTop - 300 : 3200;

      if (scrollY < impactTop) {
        setActiveChapter("home");
      } else if (scrollY >= impactTop && scrollY < howItWorksTop) {
        setActiveChapter("impact");
      } else if (scrollY >= howItWorksTop && scrollY < aboutTop) {
        setActiveChapter("how-it-works");
      } else {
        setActiveChapter("about");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
    <main className="min-h-screen text-[#142921] selection:bg-[#E8F5E9] selection:text-[#113A2B] relative font-sans">
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

      {/* Footer */}
      <Footer />
    </main>
  );
}