"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative z-10 w-full min-h-[110vh] flex flex-col justify-center pt-36 sm:pt-40 lg:pt-44 pb-28 sm:pb-36">
      <div className="max-w-[1340px] px-6 sm:px-8 mx-auto">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-neutral-100 text-[12.5px] font-semibold tracking-tight mb-7 shadow-lg">
            <span className="text-emerald-400">🌱</span>
            <span>Rescue Food &nbsp;•&nbsp; Support Communities &nbsp;•&nbsp; Create Impact</span>
          </div>

          {/* Heading - Centered */}
          <h1 className="text-3xl sm:text-5xl lg:text-[74px] font-black text-white tracking-[-0.035em] leading-[1.1] mb-6 text-center drop-shadow-2xl">
            Turn Surplus Food <br />
            Into{" "}
            <span className="text-[#F9683A] relative inline-block">
              Real Impact.
              {/* Three orange radiant sparks */}
              <span className="absolute -top-1 -right-3 sm:-right-8 text-[#F9683A] select-none pointer-events-none scale-75 sm:scale-100">
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
          <p className="text-[18px] lg:text-[20px] text-neutral-200/95 leading-[1.5] max-w-[560px] mb-9 font-medium text-center mx-auto drop-shadow-md">
            Connect surplus food from banquets, caterers, and kitchens with verified shelters and communities that need it most.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              href="/donor/new"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2.5 shadow-[0_4px_20px_rgba(22,163,74,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 fill-white stroke-none" />
              <span>Donate Food</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="#how-it-works"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2.5 border border-white/25 shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 fill-[#142921] translate-x-[0.5px]" viewBox="0 0 10 10">
                  <polygon points="2,1.5 8.5,5 2,8.5" />
                </svg>
              </span>
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Donor Social Proof */}
          <div className="flex items-center justify-center gap-3.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
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
                  className="w-8 h-8 rounded-full border-2 border-emerald-400 object-cover shadow-sm"
                />
              ))}
            </div>
            <div className="text-left text-[12.5px] font-semibold text-neutral-200">
              Joined by <span className="text-white font-bold">1,200+</span> verified donors & food champions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};