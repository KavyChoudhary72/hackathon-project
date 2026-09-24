"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Leaf,
  Moon,
  Lock,
  Star,
  Crown,
  Download,
} from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1.5 pt-1">
        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
          Rewards
        </h1>
        <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
          Points for food that actually reaches people. Never for just posting.
        </span>
      </div>

      {/* TOP ROW: Big Level Card & 4 Metrics (1.5fr 1fr on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Level Card (7 of 12 cols) */}
        <div className="lg:col-span-7 ui-card p-6 sm:p-8 bg-[#FFF9EC] border-[#F3E6C6] flex flex-col sm:flex-row items-center gap-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex-1 flex flex-col gap-3.5 w-full">
            <span className="text-[15px] font-medium text-[#5B6661]">
              Your level
            </span>
            <span className="font-outfit text-4xl sm:text-[44px] font-extrabold text-[#0E3B2E] leading-none">
              Seva Sathi
            </span>

            <div className="h-3 bg-white rounded-full overflow-hidden w-full">
              <div className="w-[86%] h-full bg-[#0E3B2E] rounded-full" />
            </div>

            <div className="flex justify-between text-[14px]">
              <b className="font-bold text-[#13231C]">860 / 1,000 points</b>
              <span className="text-[#5B6661]">140 to Ann Rakshak</span>
            </div>
          </div>

          {/* Big Glowing Heart Badge */}
          <span className="w-[120px] sm:w-[132px] h-[120px] sm:h-[132px] rounded-full bg-[#FDE8DD] border-[8px] border-white shadow-[0_10px_30px_rgba(242,98,46,0.25)] flex items-center justify-center flex-shrink-0">
            <Heart className="w-14 h-14 fill-[#F2622E] stroke-none" />
          </span>
        </div>

        {/* 4 Stats Cards (5 of 12 cols) */}
        <div className="lg:col-span-5 ui-card p-6 grid grid-cols-2 gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              860
            </span>
            <span className="text-[13px] text-[#5B6661]">Impact points</span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              24
            </span>
            <span className="text-[13px] text-[#5B6661]">Donations</span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              1,240
            </span>
            <span className="text-[13px] text-[#5B6661]">Meals to people</span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              3 weeks
            </span>
            <span className="text-[13px] text-[#5B6661]">Current streak</span>
          </div>
        </div>
      </div>

      {/* YOUR JOURNEY CARD */}
      <div className="ui-card p-6 sm:p-8 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
          Your journey
        </h2>

        <div className="relative pt-2 pb-2">
          <div className="absolute top-[32px] left-[12.5%] right-[12.5%] h-[3px] bg-[#E6E3DC]" />
          <div className="absolute top-[32px] left-[12.5%] w-[30%] h-[3px] bg-[#0E3B2E]" />

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center z-10">
            {/* Level 1 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-13 h-13 rounded-full bg-[#E3F5EA] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#1E9E5A]" />
              </span>
              <span className="text-[15px] font-bold text-[#13231C]">
                Annadaan Mitra
              </span>
              <span className="text-[13px] text-[#5B6661]">0–249 points</span>
            </div>

            {/* Level 2 (You're here) */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-13 h-13 rounded-full bg-[#FDE8DD] outline-3 outline-[#F2622E] outline-offset-3 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-[#F2622E] stroke-none" />
              </span>
              <span className="text-[15px] font-bold text-[#13231C]">
                Seva Sathi
              </span>
              <span className="ui-chip bg-[#DCF5E4] text-[#166534] h-6 text-[12px] font-bold">
                You&apos;re here
              </span>
            </div>

            {/* Level 3 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-13 h-13 rounded-full bg-[#FFF1D1] flex items-center justify-center">
                <Star className="w-6 h-6 fill-[#E89B1C] stroke-none" />
              </span>
              <span className="text-[15px] font-bold text-[#13231C]">
                Ann Rakshak
              </span>
              <span className="text-[13px] text-[#5B6661]">1,000–4,999 points</span>
            </div>

            {/* Level 4 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-13 h-13 rounded-full bg-[#0E3B2E] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#F5B82E]" />
              </span>
              <span className="text-[15px] font-bold text-[#13231C]">
                Annapurna Champion
              </span>
              <span className="text-[13px] text-[#5B6661]">5,000+ points</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN RESPONSIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Col 1: How to earn */}
        <div className="ui-card p-6 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div>
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C] mb-3">
              How to earn
            </h2>

            <div className="divide-y divide-[#F0EEE8] text-[14px]">
              <div className="py-2.5 flex justify-between">
                <span>Meal delivered to a shelter</span>
                <b className="text-[#166534] font-bold">+1 each</b>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Meal collected as a rescue deal</span>
                <b className="text-[#166534] font-bold">+0.3 each</b>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Kg sent for animal feed or biogas</span>
                <b className="text-[#166534] font-bold">+0.2 each</b>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>First delivered donation</span>
                <b className="text-[#166534] font-bold">+25</b>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Posted with 3+ hours of safe time</span>
                <b className="text-[#166534] font-bold">+10</b>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>Week with 2+ deliveries</span>
                <b className="text-[#166534] font-bold">+20</b>
              </div>
            </div>
          </div>

          <span className="text-[12px] text-[#5B6661] leading-relaxed pt-3 border-t border-[#F0EEE8]">
            Up to 300 points a day. Points are removed if a shelter reports unfit food and we confirm it.
          </span>
        </div>

        {/* Col 2: Badges · 3 of 6 */}
        <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
            Badges · 3 of 6
          </h2>

          <div className="grid grid-cols-3 gap-y-5 gap-x-2 text-center text-[13px] font-semibold">
            {/* Unlocked 1 */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#E3F5EA] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#1E9E5A]" />
              </span>
              <span>First rescue</span>
            </div>

            {/* Unlocked 2 */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#FDE8DD] flex items-center justify-center">
                <Heart className="w-6 h-6 fill-[#F2622E] stroke-none" />
              </span>
              <span>100 meals</span>
            </div>

            {/* Unlocked 3 */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#FFF1D1] flex items-center justify-center">
                <Moon className="w-6 h-6 fill-[#E89B1C] stroke-none" />
              </span>
              <span>Night saver</span>
            </div>

            {/* Locked 4 */}
            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>1,000 meals</span>
            </div>

            {/* Locked 5 */}
            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>Zero-waste week</span>
            </div>

            {/* Locked 6 */}
            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>4-week streak</span>
            </div>
          </div>
        </div>

        {/* Col 3: Recognition Certificate + Sponsor Rewards */}
        <div className="flex flex-col gap-6">
          {/* Certificate Card */}
          <div className="ui-card p-6 flex flex-col gap-3 flex-1 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              Recognition certificate
            </h2>
            <span className="text-[14px] text-[#5B6661] leading-relaxed">
              Your meals, kg diverted and level on one page, ready for your CSR report.
            </span>
            <div className="mt-auto pt-2">
              <Link
                href="/admin/impact"
                className="btn-primary w-full justify-center text-[14px]"
              >
                <Download className="w-4 h-4" />
                <span>Download certificate</span>
              </Link>
            </div>
          </div>

          {/* Sponsor Rewards (Coming soon) */}
          <div className="ui-card p-6 bg-[#FDEEE6] border-[#F8DCCC] flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <span className="ui-chip bg-white text-[#9A3412] self-start text-[12px]">
              Coming soon
            </span>
            <span className="font-outfit text-[18px] font-bold text-[#7A2E0E]">
              Sponsor rewards
            </span>
            <span className="text-[13px] text-[#7A3A1C] leading-relaxed">
              Tree planting and meal sponsorships from partner brands.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}