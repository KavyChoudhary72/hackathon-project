"use client";

import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { HeroVideoLayer } from "@/components/marketing/HeroVideoLayer";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ImpactStats } from "@/components/marketing/ImpactStats";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#142921] selection:bg-[#E8F5E9] selection:text-[#113A2B] overflow-x-hidden relative font-sans isolate">
      {/* Full-width atmospheric background layer behind Navbar, Hero, and KPI stats */}
      <HeroVideoLayer />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* 4 Stat KPI Cards */}
      <ImpactStats />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer />
    </main>
  );
}