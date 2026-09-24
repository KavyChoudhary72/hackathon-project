"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, ChevronDown, Sparkles } from "lucide-react";

interface HeroStoryOverlayProps {
  onSeeHowItWorks: () => void;
}

export const HeroStoryOverlay: React.FC<HeroStoryOverlayProps> = ({
  onSeeHowItWorks,
}) => {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-16 sm:pt-20">
      {/* Pill Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full story-glass-pill text-[#E2E8F0] text-[13px] font-semibold tracking-tight mb-8 shadow-lg">
        <span className="text-emerald-400">🌱</span>
        <span>Rescue Food &nbsp;•&nbsp; Support Communities &nbsp;•&nbsp; Create Impact</span>
      </div>

      {/* Main Headline with Orange Sparks */}
      <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black text-white tracking-[-0.035em] leading-[1.05] mb-7 drop-shadow-2xl">
        Turn Surplus Food <br />
        Into{" "}
        <span className="text-[#F9683A] relative inline-block">
          Real Impact.
          {/* Three orange radiant sparks */}
          <span className="absolute -top-1 -right-8 text-[#F9683A] select-none pointer-events-none">
            <svg
              className="w-8 h-8"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 6 15 L 14 4"
                stroke="#F9683A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 19 L 25 13"
                stroke="#F9683A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 9 24 L 23 26"
                stroke="#F9683A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
      </h1>

      {/* Description */}
      <p className="text-[18px] sm:text-[20px] text-neutral-200/90 leading-[1.55] max-w-[580px] mb-10 font-medium drop-shadow-md">
        Connect surplus food from banquets, caterers, and kitchens with verified shelters and families that need it most.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <Link
          href="/donor/new"
          className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-4 rounded-full font-bold text-[16px] flex items-center gap-3 shadow-[0_8px_30px_rgba(22,163,74,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Heart className="w-5 h-5 fill-white stroke-none" />
          <span>Donate Food</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>

        <button
          type="button"
          onClick={onSeeHowItWorks}
          className="bg-white/10 hover:bg-white/15 text-white backdrop-blur-md px-8 py-4 rounded-full font-bold text-[16px] flex items-center gap-3 border border-white/20 shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 fill-[#142921] translate-x-[0.5px]" viewBox="0 0 10 10">
              <polygon points="2,1.5 8.5,5 2,8.5" />
            </svg>
          </span>
          <span>See How It Works</span>
        </button>
      </div>

      {/* Donor Social Proof */}
      <div className="flex items-center justify-center gap-3.5 story-glass-pill px-5 py-2.5 rounded-full mb-12">
        <div className="flex -space-x-2">
          {[
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=90&h=90&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=90&h=90&fit=crop",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=90&h=90&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=90&h=90&fit=crop",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Generous food donor"
              className="w-8 h-8 rounded-full border-2 border-emerald-500/80 object-cover shadow-sm"
            />
          ))}
        </div>
        <div className="text-left text-[12px] font-medium text-neutral-300">
          Joined by <span className="text-white font-bold">1,200+</span> verified donors & food champions
        </div>
      </div>

      {/* Scroll indicator prompt */}
      <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-[12px] font-semibold tracking-wider uppercase">Scroll to explore story</span>
        <ChevronDown className="w-5 h-5 text-emerald-400" />
      </div>
    </div>
  );
};
