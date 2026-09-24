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
                className="bg-white/90 backdrop-blur-md rounded-[24px] p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-neutral-100/80 transition-all hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${role.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${role.accent}`} />
                  </div>
                  <h3 className="text-[20px] font-black text-[#142921] mb-2.5">
                    {role.title}
                  </h3>
                  <p className="text-[14px] text-[#5F6F67] leading-relaxed mb-6">
                    {role.desc}
                  </p>
                </div>

                <Link
                  href={role.link}
                  className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#142921] hover:text-emerald-700 transition-colors"
                >
                  <span>{role.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Final CTA Box */}
        <div className="bg-[#113A2B]/95 backdrop-blur-md rounded-[28px] p-8 sm:p-12 text-center max-w-3xl mx-auto border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
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
