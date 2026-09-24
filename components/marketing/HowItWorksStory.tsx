"use client";

import React from "react";
import { Clock, Navigation, ShieldCheck, HeartHandshake } from "lucide-react";

export const HowItWorksStory: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: Clock,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
      title: "Post Surplus in 60s",
      desc: "Commercial kitchens, banquets, and donors list surplus portions with safe-until timestamps and food category tags.",
    },
    {
      num: "02",
      icon: Navigation,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/15 border-orange-500/30",
      title: "AI Demand Match",
      desc: "Our matching engine instantly pairs available meals with verified shelters based on live hunger capacity and distance.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/15 border-sky-500/30",
      title: "Swift Eco-Transit",
      desc: "Verified volunteer drivers and refrigerated electric vans dispatch immediately with live route tracking.",
    },
    {
      num: "04",
      icon: HeartHandshake,
      iconColor: "text-pink-400",
      iconBg: "bg-pink-500/15 border-pink-500/30",
      title: "OTP Delivery",
      desc: "Dual-key OTP confirmation between driver and shelter guarantees warm, safe food reaches families with dignity.",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full story-glass-pill text-emerald-400 text-[12px] font-bold tracking-tight mb-4">
          <span>🌱</span>
          <span>Simple Process, Big Impact</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-tight mb-4 drop-shadow-md">
          How It Works
        </h2>
        <p className="text-[17px] text-neutral-300 leading-relaxed font-normal">
          From extra banquet food to someone's next meal. A seamless 4-step chain connecting surplus to those in need.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="story-glass-card rounded-[24px] p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-9 h-9 rounded-full bg-white/10 text-white font-extrabold text-[14px] flex items-center justify-center border border-white/15">
                    {step.num}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${step.iconBg}`}
                  >
                    <Icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                </div>

                <h3 className="text-[20px] font-black text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-neutral-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-neutral-400">
                <span>Phase {step.num}</span>
                <span className="text-emerald-400">Active Pipeline</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
