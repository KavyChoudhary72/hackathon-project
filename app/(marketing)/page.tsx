"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Play,
  TrendingUp,
  UtensilsCrossed,
  Users,
  Building2,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Award,
  Sparkles,
  QrCode,
  Flame,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/Badge";
import { FrameSequence, ChapterRange } from "@/components/marketing/FrameSequence";
import { useScrollStory } from "@/lib/scroll/useScrollStory";
import { useI18n } from "@/lib/i18n";
import { apiClient } from "@/lib/api/client";
import { ImpactData } from "@/lib/api/types";

const chapters: ChapterRange[] = [
  { id: "c1", start: 0.0, end: 0.12, title: "10:47 PM Surplus" },
  { id: "c2", start: 0.12, end: 0.25, title: "The Problem" },
  { id: "c3", start: 0.25, end: 0.4, title: "The AI Match" },
  { id: "c4", start: 0.4, end: 0.55, title: "The Dispatch" },
  { id: "c5", start: 0.55, end: 0.7, title: "No-Waste Cascade" },
  { id: "c6", start: 0.7, end: 0.82, title: "Proof & Impact" },
  { id: "c7", start: 0.82, end: 0.92, title: "CSR Rewards" },
  { id: "c8", start: 0.92, end: 1.0, title: "Join Movement" },
];

export default function MarketingLandingPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollProgress } = useScrollStory(containerRef);
  const { locale, setLocale, t } = useI18n();

  const [impactData, setImpactData] = useState<ImpactData | null>(null);

  useEffect(() => {
    apiClient.getImpact().then(setImpactData);
  }, []);

  return (
    <div className="relative min-h-screen bg-surface-base text-neutral-900 overflow-x-hidden">
      {/* FLOATING PILL NAVBAR MATCHING REFERENCE IMAGE 1 */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto max-w-5xl w-full bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full border border-neutral-200/80 shadow-card flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-white font-black text-sm">
              <span className="text-accent-500 font-extrabold text-base">F</span>L
            </div>
            <span className="text-lg font-black text-brand-800 tracking-tight">
              Food<span className="text-accent-500">Link</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-neutral-600">
            <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{t("nav.home", "Home")}</span>
            </span>
            <Link
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-full hover:text-brand-800 transition-colors"
            >
              {t("nav.howItWorks", "How it Works")}
            </Link>
            <Link
              href="/admin/impact"
              className="px-3.5 py-1.5 rounded-full hover:text-brand-800 transition-colors"
            >
              {t("nav.impact", "Impact")}
            </Link>
            <Link
              href="/donor"
              className="px-3.5 py-1.5 rounded-full hover:text-brand-800 transition-colors"
            >
              {t("nav.dashboard", "App Dashboard")}
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Switcher */}
            <div className="flex items-center bg-surface-subtle p-0.5 rounded-full border border-neutral-200 text-xs font-bold">
              <button
                onClick={() => setLocale("en")}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  locale === "en"
                    ? "bg-brand-800 text-white"
                    : "text-neutral-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("hi")}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  locale === "hi"
                    ? "bg-brand-800 text-white"
                    : "text-neutral-600"
                }`}
              >
                हिन्दी
              </button>
            </div>

            <Link href="/donor">
              <Button size="sm" variant="secondary" className="hidden sm:inline-flex rounded-full text-xs">
                {t("nav.login", "Login")}
              </Button>
            </Link>

            <Link href="/donor/new">
              <Button
                size="sm"
                variant="primary"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="rounded-full text-xs"
              >
                {t("nav.donateNow", "Donate Now")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* PINNED SCROLL STORY SECTION WITH <FrameSequence> CANVAS */}
      <div ref={containerRef} className="relative w-full h-screen">
        {/* The Frame Sequence Engine running in placeholder mode */}
        <div className="absolute inset-0 z-0">
          <FrameSequence chapters={chapters} progress={scrollProgress} />
        </div>

        {/* PINNED TEXT OVERLAYS SYNCHRONIZED ACROSS CHAPTERS */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none px-4">
          <div className="max-w-4xl w-full mx-auto text-center pointer-events-auto transition-all duration-300">
            {/* CHAPTER 1: HERO (0.0 to 0.12) */}
            {scrollProgress <= 0.12 && (
              <div className="space-y-6 pt-16 animate-in fade-in zoom-in-95 duration-500">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-900 text-xs font-bold shadow-2xs border border-brand-200/60">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {t(
                      "landing.pillTag",
                      "Rescue Food · Support Communities · Create Impact"
                    )}
                  </span>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-brand-800 tracking-tight leading-[1.08]">
                  {t("landing.heroTitle1", "Turn Surplus Food")}{" "}
                  <span className="text-accent-500 inline-flex items-center gap-2">
                    {t("landing.heroTitle2", "Real Impact.")}
                    <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-accent-500 fill-accent-500 inline animate-pulse" />
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
                  {t(
                    "landing.heroDesc",
                    "Connect surplus food with shelters and communities that need it most."
                  )}
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/donor/new">
                    <Button
                      size="lg"
                      variant="primary"
                      leftIcon={<Heart className="w-5 h-5 fill-white" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="rounded-full shadow-lg"
                    >
                      {t("landing.donateFood", "Donate Food")}
                    </Button>
                  </Link>

                  <Link href="#how-it-works">
                    <Button
                      size="lg"
                      variant="secondary"
                      leftIcon={<Play className="w-4 h-4 fill-brand-800" />}
                      className="rounded-full"
                    >
                      {t("landing.seeHowItWorks", "See How It Works")}
                    </Button>
                  </Link>
                </div>

                {/* Social proof avatar row */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-2xs"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${
                            i === 1
                              ? "1534528741775-53994a69daeb"
                              : i === 2
                              ? "1507003211169-0a1dd7228f2d"
                              : i === 3
                              ? "1500648767791-00dcc994a43e"
                              : "1494790108377-be9c29b29330"
                          }?w=100&h=100&fit=crop`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-700">
                    {t(
                      "landing.socialProof",
                      "4,500+ generous donors are already making a difference"
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* CHAPTER 2: THE PROBLEM (0.12 to 0.25) */}
            {scrollProgress > 0.12 && scrollProgress <= 0.25 && (
              <div className="space-y-6 text-white animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/40">
                  The National Crisis
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c2", "40% of food in India is wasted while 194 million sleep hungry.")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                  <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="text-3xl font-black text-red-400">40%</div>
                    <div className="text-xs font-bold text-white mt-1">Food Harvest to Banquet Waste</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Source: UNEP Food Waste Index</div>
                  </div>
                  <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="text-3xl font-black text-amber-400">194M</div>
                    <div className="text-xs font-bold text-white mt-1">Undernourished Citizens</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Source: FAO SOFI Report</div>
                  </div>
                  <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="text-3xl font-black text-emerald-400">8%</div>
                    <div className="text-xs font-bold text-white mt-1">Global GHG Emissions</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Directly from decomposing food</div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 3: THE AI MATCH (0.25 to 0.40) */}
            {scrollProgress > 0.25 && scrollProgress <= 0.4 && (
              <div className="space-y-6 text-white animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  Hyperlocal Dispatch Intelligence
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c3", "The Match: Asha Shelter 2.1 km away lights up in seconds.")}
                </h2>
                <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 max-w-xl mx-auto space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Asha Children Shelter, Jaipur</span>
                    <span className="text-emerald-400">Score 96.5%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[96.5%]" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-semibold text-white/90">
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">📍 2.1 km Distance</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">🍽️ 40 Meals Capacity</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">🌱 100% Veg FSSAI Match</span>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 4: THE MOVE (0.40 to 0.55) */}
            {scrollProgress > 0.4 && scrollProgress <= 0.55 && (
              <div className="space-y-6 text-white animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 text-xs font-bold border border-accent-500/40">
                  Cryptographic OTP Handover
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c4", "The Move: Verified bike driver, live ETA, zero lost batches.")}
                </h2>
                <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 max-w-md mx-auto text-center space-y-2">
                  <div className="font-mono text-4xl font-black text-accent-400 tracking-widest">
                    5 8 2 4
                  </div>
                  <div className="text-xs text-neutral-300">
                    Pickup OTP verified by driver Ramesh Kumar (RJ-14-EA-4412)
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 5: 3-TIER CASCADE (0.55 to 0.70) */}
            {scrollProgress > 0.55 && scrollProgress <= 0.7 && (
              <div className="space-y-6 text-white animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                  Zero Landfill Guarantee
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c5", "No waste: The 3-tier cascade redirects every surplus gram.")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40">
                    <TierBadge tier={1} />
                    <div className="font-bold text-sm text-white mt-2">Human Shelters</div>
                    <div className="text-xs text-neutral-300 mt-1">100% free food rescue to orphanages and homeless shelters.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40">
                    <TierBadge tier={2} />
                    <div className="font-bold text-sm text-white mt-2">Rescue Deals</div>
                    <div className="text-xs text-neutral-300 mt-1">₹30-₹50 discounted meals for students and night workers.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-500/40">
                    <TierBadge tier={3} />
                    <div className="font-bold text-sm text-white mt-2">Bio-Diversion</div>
                    <div className="text-xs text-neutral-300 mt-1">Gaushala cattle feed and municipal methane bio-digestion.</div>
                  </div>
                </div>
              </div>
            )}

            {/* CHAPTER 6: PROOF OF IMPACT (0.70 to 0.82) */}
            {scrollProgress > 0.7 && scrollProgress <= 0.82 && (
              <div className="space-y-6 text-brand-900 animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold border border-brand-200">
                  Verified Real-Time Metrics
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c6", "Transparent proof: Over 25,000 verified meals served.")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-left">
                  <Card padding="md">
                    <div className="text-2xl font-black text-brand-800">25,420</div>
                    <div className="text-xs font-semibold text-neutral-600">Meals Rescued</div>
                  </Card>
                  <Card padding="md">
                    <div className="text-2xl font-black text-brand-800">4,500+</div>
                    <div className="text-xs font-semibold text-neutral-600">Active Donors</div>
                  </Card>
                  <Card padding="md">
                    <div className="text-2xl font-black text-brand-800">180+</div>
                    <div className="text-xs font-semibold text-neutral-600">Shelters Connected</div>
                  </Card>
                  <Card padding="md">
                    <div className="text-2xl font-black text-brand-800">46,300 kg</div>
                    <div className="text-xs font-semibold text-neutral-600">CO₂e Prevented</div>
                  </Card>
                </div>
              </div>
            )}

            {/* CHAPTER 7: REWARDS & CSR (0.82 to 0.92) */}
            {scrollProgress > 0.82 && scrollProgress <= 0.92 && (
              <div className="space-y-6 text-brand-900 animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  Gamified Social Proof
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c7", "Earn recognition: Corporate CSR certificates and donor impact medals.")}
                </h2>
                <div className="flex justify-center gap-4 pt-2">
                  <Link href="/rewards">
                    <Button size="lg" variant="primary" leftIcon={<Trophy className="w-5 h-5" />}>
                      Explore Donor Rewards Hub
                    </Button>
                  </Link>
                  <Link href="/admin/impact">
                    <Button size="lg" variant="secondary" leftIcon={<Award className="w-5 h-5" />}>
                      View CSR ESG Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* CHAPTER 8: JOIN (0.92 to 1.0) */}
            {scrollProgress > 0.92 && (
              <div className="space-y-6 text-brand-900 animate-in fade-in zoom-in-95">
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
                  Start Saving Food Tonight
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {t("landing.chapters.c8", "Join the revolution. Turn tonight's surplus into someone's tomorrow.")}
                </h2>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link href="/donor">
                    <Button size="lg" variant="primary">
                      I have surplus food (Donor)
                    </Button>
                  </Link>
                  <Link href="/shelter">
                    <Button size="lg" variant="secondary">
                      I run a shelter
                    </Button>
                  </Link>
                  <Link href="/driver">
                    <Button size="lg" variant="secondary">
                      I want to volunteer (Driver)
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATIC "HOW IT WORKS" & 4 KPI METRICS SECTION MATCHING REFERENCE IMAGE 1 */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
        {/* 4 Metric KPI Cards Row from Reference Image 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <Card padding="md" className="flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">25,000+</div>
              <div className="text-xs font-semibold text-neutral-500">
                {t("landing.kpiMeals", "Meals Rescued")}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-500 ml-auto" />
          </Card>

          {/* Card 2 */}
          <Card padding="md" className="flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">4,500+</div>
              <div className="text-xs font-semibold text-neutral-500">
                {t("landing.kpiDonors", "Food Donors")}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600 ml-auto" />
          </Card>

          {/* Card 3 */}
          <Card padding="md" className="flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">180+</div>
              <div className="text-xs font-semibold text-neutral-500">
                {t("landing.kpiShelters", "Shelters Connected")}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500 ml-auto" />
          </Card>

          {/* Card 4 */}
          <Card padding="md" className="flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-neutral-900">12 Tons+</div>
              <div className="text-xs font-semibold text-neutral-500">
                {t("landing.kpiWaste", "Food Waste Prevented")}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600 ml-auto" />
          </Card>
        </div>

        {/* How It Works Section Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("landing.howItWorksTag", "Simple Process, Big Impact")}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-800 tracking-tight">
              {t("landing.howItWorksTitle", "How It Works")}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              {t(
                "landing.howItWorksSub",
                "From your extra food to someone's next meal. A simple process with a big impact."
              )}
            </p>
          </div>
        </div>

        {/* 4 Process Cards matching Reference Image 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <Card padding="lg" className="space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                01
              </span>
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {t("landing.step1Title", "Donate")}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t(
                "landing.step1Desc",
                "Share details about the surplus food you have available."
              )}
            </p>
          </Card>

          {/* Step 02 */}
          <Card padding="lg" className="space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 text-xs font-black flex items-center justify-center">
                02
              </span>
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {t("landing.step2Title", "Match")}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t(
                "landing.step2Desc",
                "We connect your donation to the nearest shelters in need."
              )}
            </p>
          </Card>

          {/* Step 03 */}
          <Card padding="lg" className="space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">
                03
              </span>
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {t("landing.step3Title", "Deliver")}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t(
                "landing.step3Desc",
                "Our verified drivers safely collect and deliver the food."
              )}
            </p>
          </Card>

          {/* Step 04 */}
          <Card padding="lg" className="space-y-4 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                04
              </span>
              <span className="text-2xl">❤️</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {t("landing.step4Title", "Impact")}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t(
                "landing.step4Desc",
                "Your food reaches people in need and creates real change."
              )}
            </p>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-900 text-white py-12 px-4 sm:px-8 border-t border-brand-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-sm text-brand-900">
              FL
            </div>
            <span className="text-lg font-black tracking-tight">FoodLink Jaipur</span>
          </div>

          <div className="flex gap-6 text-xs text-neutral-300">
            <Link href="/donor" className="hover:text-white">
              Donor App
            </Link>
            <Link href="/shelter" className="hover:text-white">
              Shelters
            </Link>
            <Link href="/driver" className="hover:text-white">
              Drivers
            </Link>
            <Link href="/admin/impact" className="hover:text-white">
              CSR ESG Impact
            </Link>
            <Link href="/qr" className="hover:text-white">
              Presentation QR
            </Link>
          </div>

          <div className="text-xs text-neutral-400">
            © 2026 FoodLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}