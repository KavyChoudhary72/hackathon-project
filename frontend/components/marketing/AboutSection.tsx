"use client";

import React from "react";
import Link from "next/link";
import { Heart, Building2, Truck, Award, ArrowRight } from "lucide-react";

export const AboutSection: React.FC = () => {
  const roles = [
    {
      title: "Commercial Donors",
      desc: "Turn banquet and cafeteria surplus into tax-exempt social impact with instant 60-second pickups.",
      icon: Building2,
      link: "/donor/new",
      action: "Donate Food",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Community Shelters",
      desc: "Receive pre-screened, hot nutritious meals matched specifically to your daily resident count.",
      icon: Heart,
      link: "/shelter",
      action: "Shelter Portal",
      accent: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Volunteer Drivers",
      desc: "Complete hyperlocal rescue missions, earn Seva Sathi reward points and unlock verified badges.",
      icon: Truck,
      link: "/driver",
      action: "Driver Missions",
      accent: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Rewards & CSR",
      desc: "Track real-time GHG reduction, social ROI, and enterprise CSR audit certificates automatically.",
      icon: Award,
      link: "/rewards",
      action: "View Rewards",
      accent: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <section id="about" className="w-full min-h-[120vh] flex flex-col justify-center py-28 sm:py-36 relative z-10">
      <div className="max-w-[1340px] px-6 sm:px-8 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-400 text-[12px] font-bold tracking-tight mb-4 shadow-sm">
            <span>🤝</span>
            <span>Community Powered Mission</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-tight mb-4 drop-shadow-md">
            Together, Zero Hunger Is Possible
          </h2>
          <p className="text-[17px] text-neutral-200/90 leading-relaxed font-normal">
            FoodLink exists to ensure that no nutritious meal goes to waste while a single neighbor goes to sleep hungry.
          </p>
        </div>

        {/* 4 Role Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div
                key={idx}
                className="bg-white/10 hover:bg-white/[0.16] backdrop-blur-xl rounded-[24px] p-7 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_12px_36px_rgba(0,0,0,0.35)] border border-white/20 hover:border-white/35 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${role.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${role.accent}`} />
                  </div>
                  <h3 className="text-[20px] font-black text-white mb-2.5 drop-shadow-sm">
                    {role.title}
                  </h3>
                  <p className="text-[14px] text-neutral-200/90 leading-relaxed mb-6 font-normal drop-shadow-sm">
                    {role.desc}
                  </p>
                </div>

                <Link
                  href={role.link}
                  className="inline-flex items-center gap-2 text-[13.5px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <span>{role.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Final CTA Box */}
        <div className="bg-[#0D281E]/80 hover:bg-[#0D281E]/90 backdrop-blur-2xl rounded-[28px] p-8 sm:p-12 text-center max-w-3xl mx-auto border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_24px_60px_rgba(0,0,0,0.45)] transition-all">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Ready to Make Real Food Impact?
          </h3>
          <p className="text-[16px] text-neutral-200/90 mb-8 max-w-xl mx-auto">
            Whether you have surplus portions from an event or want to drive a rescue mission in your neighborhood, join FoodLink today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donor/new"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 fill-white stroke-none" />
              <span>Donate Surplus Now</span>
            </Link>
            <Link
              href="/donor"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold text-[15px] border border-white/20 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Open Donor Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
