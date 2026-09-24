"use client";

import React from "react";
import Link from "next/link";
import { Heart, Building2, Truck, Award, ArrowRight } from "lucide-react";

export const AboutStory: React.FC = () => {
  const roles = [
    {
      title: "Commercial Donors",
      desc: "Turn banquet and cafeteria surplus into tax-exempt social impact with instant pickups.",
      icon: Building2,
      link: "/donor/new",
      action: "Donate Food",
      accent: "text-emerald-400",
    },
    {
      title: "Community Shelters",
      desc: "Receive pre-screened, hot nutritious meals matched specifically to daily resident count.",
      icon: Heart,
      link: "/shelter",
      action: "Shelter Portal",
      accent: "text-rose-400",
    },
    {
      title: "Volunteer Drivers",
      desc: "Complete hyperlocal rescue missions, earn Seva Sathi reward points and verified badges.",
      icon: Truck,
      link: "/driver",
      action: "Driver Missions",
      accent: "text-amber-400",
    },
    {
      title: "Rewards & CSR",
      desc: "Track real-time GHG reduction, social ROI, and enterprise CSR audit certificates.",
      icon: Award,
      link: "/rewards",
      action: "View Rewards",
      accent: "text-sky-400",
    },
  ];

  return (
    <div className="w-full max-w-[1340px] mx-auto pt-16 sm:pt-20">
      {/* Header */}
      <div className="mb-7 sm:mb-9 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full story-glass-pill text-amber-400 text-[12px] font-bold tracking-tight mb-3">
          <span>🤝</span>
          <span>Community Powered Mission</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-0.03em] leading-tight mb-3 drop-shadow-md">
          Together, Zero Hunger Is Possible
        </h2>
        <p className="text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed font-normal max-w-2xl mx-auto">
          FoodLink exists to ensure that no nutritious meal goes to waste while a single neighbor goes to sleep hungry.
        </p>
      </div>

      {/* 4 Role Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {roles.map((role, idx) => {
          const Icon = role.icon;
          return (
            <div
              key={idx}
              className="story-glass-card rounded-[22px] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 mb-4">
                  <Icon className={`w-5 h-5 ${role.accent}`} />
                </div>
                <h3 className="text-[18px] sm:text-[19px] font-black text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-neutral-300 leading-relaxed mb-5">
                  {role.desc}
                </p>
              </div>

              <Link
                href={role.link}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white hover:text-emerald-400 transition-colors"
              >
                <span>{role.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Final Call to Action Card */}
      <div className="story-glass-card rounded-[24px] p-6 sm:p-8 text-center max-w-2xl mx-auto border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          Ready to Make Real Food Impact?
        </h3>
        <p className="text-[14px] text-neutral-300 mb-6 max-w-lg mx-auto">
          Whether you have surplus portions from an event or want to drive a rescue mission in your neighborhood, join FoodLink today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/donor/new"
            className="bg-[#16A34A] hover:bg-[#15803D] text-white px-7 py-3 rounded-full font-bold text-[14px] flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Heart className="w-4 h-4 fill-white stroke-none" />
            <span>Donate Surplus Now</span>
          </Link>
          <Link
            href="/donor"
            className="story-glass-pill hover:bg-white/20 text-white px-7 py-3 rounded-full font-bold text-[14px] transition-all hover:-translate-y-0.5"
          >
            <span>Open Donor Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
