"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Home, Leaf, Zap, ArrowRight } from "lucide-react";

export const ImpactStory: React.FC = () => {
  const stats = [
    {
      label: "Meals Rescued",
      val: "25,000+",
      sub: "Hot nutritious meals served",
      icon: Utensils,
      accent: "text-[#F9683A]",
      bg: "bg-[#F9683A]/15 border-[#F9683A]/30",
    },
    {
      label: "Shelters Supported",
      val: "85+",
      sub: "Active partner community homes",
      icon: Home,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/15 border-emerald-500/30",
    },
    {
      label: "CO2 Prevented",
      val: "12,500 kg",
      sub: "Methane diverted from landfills",
      icon: Leaf,
      accent: "text-teal-400",
      bg: "bg-teal-500/15 border-teal-500/30",
    },
    {
      label: "Average Match Time",
      val: "42 Mins",
      sub: "From donation post to delivery",
      icon: Zap,
      accent: "text-amber-400",
      bg: "bg-amber-500/15 border-amber-500/30",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full story-glass-pill text-teal-400 text-[12px] font-bold tracking-tight mb-4">
          <span>📊</span>
          <span>Verified Transparency & Telemetry</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-tight mb-4 drop-shadow-md">
          Measurable Real Impact
        </h2>
        <p className="text-[17px] text-neutral-300 leading-relaxed font-normal">
          Every rescued portion directly feeds a human life while protecting our planet. Audited in real-time.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="story-glass-card rounded-[24px] p-7 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[13px] font-bold text-neutral-400 tracking-wide uppercase">
                  {s.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.bg}`}
                >
                  <Icon className={`w-5 h-5 ${s.accent}`} />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  {s.val}
                </div>
                <div className="text-[13px] text-neutral-300 font-medium">
                  {s.sub}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>Verified Metric</span>
                <span>100% Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSR / Audit Report Link Button */}
      <div className="flex justify-center">
        <Link
          href="/admin/impact"
          className="story-glass-pill hover:bg-white/15 text-white px-7 py-3 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-lg hover:-translate-y-0.5"
        >
          <span>Explore Live Impact Dashboard & Telemetry</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>
    </div>
  );
};
