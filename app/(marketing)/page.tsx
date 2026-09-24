"use client";

import React from "react";
import Link from "next/link";
import { Search, Heart, Play, ArrowRight } from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#142921] font-sans antialiased selection:bg-[#E8F5E9] selection:text-[#113A2B] pb-24">
      {/* FLOATING TOP NAVBAR MATCHING REFERENCE IMAGE 1 */}
      <div className="pt-6 px-4 flex justify-center">
        <header className="max-w-6xl w-full bg-white/95 rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-neutral-100">
          {/* Logo with 3-color Heart/Leaf Icon */}
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Petal 1: Green */}
              <path
                d="M16 6C13.5 3 9.5 3 7 5.5C4.5 8 4.5 12 7.5 14.5L16 22L16 6Z"
                fill="#2E7D32"
              />
              {/* Petal 2: Coral Orange */}
              <path
                d="M16 6C18.5 3 22.5 3 25 5.5C27.5 8 27.5 12 24.5 14.5L16 22L16 6Z"
                fill="#F9683A"
              />
              {/* Petal 3: Yellow-Green bottom */}
              <circle cx="16" cy="19" r="4" fill="#F5A623" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-[#142921]">
              Food<span className="text-[#2E7D32]">Link</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="bg-[#E8F5E9] text-[#142921] px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5"
            >
              <span>Home</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </Link>
            <Link
              href="#how-it-works"
              className="text-[#4A5568] hover:text-[#142921] font-medium text-sm px-4 py-1.5 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/admin/impact"
              className="text-[#4A5568] hover:text-[#142921] font-medium text-sm px-4 py-1.5 transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/donor"
              className="text-[#4A5568] hover:text-[#142921] font-medium text-sm px-4 py-1.5 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-[#4A5568] hover:text-[#142921] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/donor"
              className="px-5 py-2 rounded-full border border-neutral-300 text-sm font-semibold text-[#142921] hover:bg-neutral-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/donor/new"
              className="bg-[#113A2B] hover:bg-[#1B4332] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>
      </div>

      {/* HERO SECTION */}
      <section className="pt-16 pb-14 px-4 max-w-5xl mx-auto text-left">
        {/* Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4F1] text-[#4A5568] text-xs font-semibold mb-6">
          <span className="text-emerald-700">🌱</span>
          <span>Rescue Food · Support Communities · Create Impact</span>
        </div>

        {/* Headline with Orange Spark */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#142921] tracking-tight leading-[1.08] mb-6">
          Turn Surplus Food <br />
          Into{" "}
          <span className="text-[#F9683A] relative inline-block">
            Real Impact.
            {/* Spark doodle */}
            <span className="absolute -top-3 -right-8 text-[#F9683A] text-2xl select-none font-bold">
              ✨
            </span>
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-[#5F6F65] max-w-xl leading-relaxed mb-8">
          Connect surplus food with shelters and communities that need it most.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link
            href="/donor/new"
            className="bg-[#113A2B] hover:bg-[#1B4332] text-white px-7 py-3.5 rounded-full font-bold text-base flex items-center gap-2.5 shadow-sm transition-colors"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Donate Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="#how-it-works"
            className="bg-white hover:bg-neutral-50 text-[#142921] px-7 py-3.5 rounded-full font-bold text-base flex items-center gap-2 border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors"
          >
            <Play className="w-4 h-4 fill-[#142921]" />
            <span>See How It Works</span>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#4A5568]">
            <span className="text-[#142921] font-extrabold">4,500+</span> generous donors are already making a difference
          </span>
        </div>
      </section>

      {/* 4 STAT KPI CARDS IN A ROW MATCHING IMAGE 1 */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Meals Rescued */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#F43F5E]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-[#142921] tracking-tight">
                  25,000+
                </div>
                <div className="text-xs font-semibold text-[#64748B]">
                  Meals Rescued
                </div>
              </div>
            </div>
            {/* Orange trend wave */}
            <svg className="w-10 h-6 text-[#F9683A]" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 20 Q 12 18 20 12 T 38 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M 32 4 H 38 V 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Card 2: Food Donors */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-[#142921] tracking-tight">
                  4,500+
                </div>
                <div className="text-xs font-semibold text-[#64748B]">
                  Food Donors
                </div>
              </div>
            </div>
            {/* Green trend wave */}
            <svg className="w-10 h-6 text-[#10B981]" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 20 Q 12 18 20 12 T 38 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M 32 4 H 38 V 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Card 3: Shelters Connected */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-[#142921] tracking-tight">
                  180+
                </div>
                <div className="text-xs font-semibold text-[#64748B]">
                  Shelters Connected
                </div>
              </div>
            </div>
            {/* Golden trend wave */}
            <svg className="w-10 h-6 text-[#F59E0B]" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 20 Q 12 18 20 12 T 38 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M 32 4 H 38 V 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Card 4: Food Waste Prevented */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3 4.54 0 8.52-2.18 10.9-5.59C20.67 11.83 21 8.57 21 8c-1.33 0-2.67 0-4 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-[#142921] tracking-tight">
                  12 Tons+
                </div>
                <div className="text-xs font-semibold text-[#64748B]">
                  Food Waste Prevented
                </div>
              </div>
            </div>
            {/* Emerald trend wave */}
            <svg className="w-10 h-6 text-[#16A34A]" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 20 Q 12 18 20 12 T 38 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M 32 4 H 38 V 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* "HOW IT WORKS" SECTION MATCHING IMAGE 1 */}
      <section id="how-it-works" className="px-4 max-w-6xl mx-auto space-y-8">
        <div>
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold mb-3">
            <span>🌱</span>
            <span>Simple Process, Big Impact</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
            <h2 className="text-4xl font-extrabold text-[#142921] tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-[#64748B] max-w-md">
              From your extra food to someone's next meal. <br />
              A simple process with a big impact.
            </p>
          </div>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01: Donate */}
          <div className="bg-white rounded-[24px] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-black flex items-center justify-center">
                01
              </span>
              {/* Vegetable crate illustration */}
              <div className="w-14 h-14 flex items-center justify-center text-4xl">
                🥦
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#142921] mb-1.5">Donate</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Share details about the surplus food you have available.
              </p>
            </div>
          </div>

          {/* Card 02: Match */}
          <div className="bg-white rounded-[24px] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="w-8 h-8 rounded-full bg-[#FFE4E6] text-[#F43F5E] text-xs font-black flex items-center justify-center">
                02
              </span>
              {/* House with heart illustration */}
              <div className="w-14 h-14 flex items-center justify-center text-4xl">
                🏡
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#142921] mb-1.5">Match</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We connect your donation to the nearest shelters in need.
              </p>
            </div>
          </div>

          {/* Card 03: Deliver */}
          <div className="bg-white rounded-[24px] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-black flex items-center justify-center">
                03
              </span>
              {/* Delivery truck illustration */}
              <div className="w-14 h-14 flex items-center justify-center text-4xl">
                🚚
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#142921] mb-1.5">Deliver</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Our verified drivers safely collect and deliver the food.
              </p>
            </div>
          </div>

          {/* Card 04: Impact */}
          <div className="bg-white rounded-[24px] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <span className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-black flex items-center justify-center">
                04
              </span>
              {/* Community people illustration */}
              <div className="w-14 h-14 flex items-center justify-center text-4xl">
                🧑‍🤝‍🧑
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#142921] mb-1.5">Impact</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Your food reaches people in need and creates real change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 pt-8 border-t border-neutral-200/60 max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#142921]">FoodLink Jaipur</span>
          <span>© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <Link href="/donor" className="hover:text-[#142921]">
            Donor App
          </Link>
          <Link href="/shelter" className="hover:text-[#142921]">
            Shelter Dashboard
          </Link>
          <Link href="/driver" className="hover:text-[#142921]">
            Driver Portal
          </Link>
          <Link href="/rewards" className="hover:text-[#142921]">
            Rewards
          </Link>
          <Link href="/admin/impact" className="hover:text-[#142921]">
            CSR Impact
          </Link>
        </div>
      </footer>
    </div>
  );
}