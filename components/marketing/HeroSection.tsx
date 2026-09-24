"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full pt-36 sm:pt-40 lg:pt-44 pb-14 sm:pb-16">
      <div className="max-w-[1340px] px-6 sm:px-8 mx-auto">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF2EE] text-[#52605B] text-[12px] font-semibold tracking-tight mb-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-emerald-700">🌱</span>
            <span>Rescue Food  •  Support Communities  •  Create Impact</span>
          </div>

          {/* Heading - Centered */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-[#142921] tracking-[-0.035em] leading-[1.06] mb-6 text-center">
            Turn Surplus Food <br />
            Into{" "}
            <span className="text-[#F9683A] relative inline-block">
              Real Impact.
              {/* Three orange radiant sparks matching Reference Image 2 */}
              <span className="absolute -top-1 -right-8 text-[#F9683A] select-none pointer-events-none">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top ray angled ~55 deg */}
                  <path
                    d="M 6 15 L 14 4"
                    stroke="#F9683A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Middle ray angled ~25 deg */}
                  <path
                    d="M 10 19 L 25 13"
                    stroke="#F9683A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Bottom ray angled ~8 deg */}
                  <path
                    d="M 9 24 L 23 26"
                    stroke="#F9683A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-[18px] lg:text-[19px] text-[#5F6F67] leading-[1.5] max-w-[540px] mb-8 font-medium text-center mx-auto">
            Connect surplus food with shelters and communities that need it most.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-9">
            <Link
              href="/donor/new"
              className="bg-[#113A2B] hover:bg-[#1B4332] text-white px-7 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2.5 shadow-[0_4px_16px_rgba(17,58,43,0.18)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 fill-white stroke-none" />
              <span>Donate Food</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="#how-it-works"
              className="bg-white hover:bg-neutral-50 text-[#142921] px-7 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2.5 border border-neutral-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="w-5 h-5 rounded-full bg-[#142921] flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 fill-white translate-x-[0.5px]" viewBox="0 0 10 10">
                  <polygon points="2,1.5 8.5,5 2,8.5" />
                </svg>
              </span>
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Donor Social Proof */}
          <div className="flex items-center justify-center gap-3">
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
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
                />
              ))}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-extrabold text-[#142921] leading-tight">
                4,500+ generous donors
              </span>
              <span className="text-[11px] text-[#6B7280] font-medium leading-tight">
                are already making a difference
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};