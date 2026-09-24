"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Users,
  Leaf,
  Star,
  Plus,
  ArrowRight,
  Search,
  Bell,
  Check,
  Truck,
  Flag,
  MapPin,
  FileText,
  Gift,
  Lock,
  Moon,
  Heart,
} from "lucide-react";

export default function DonorDashboardPage() {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* TOP BAR: Search + Notifications + Profile Chip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <label className="flex-1 max-w-[640px] h-[52px] bg-white border border-[#ECE9E1] rounded-full flex items-center gap-3 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <Search className="w-5 h-5 text-[#5B6661] flex-shrink-0" />
          <input
            type="search"
            placeholder="Search donations, shelters or places"
            className="border-0 outline-none text-[15px] flex-1 bg-transparent text-[#13231C] placeholder:text-[#5B6661]"
          />
        </label>

        <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setHasUnread(false)}
            aria-label="Notifications"
            className="w-[52px] h-[52px] rounded-full bg-white border border-[#ECE9E1] flex items-center justify-center relative cursor-pointer hover:bg-neutral-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors flex-shrink-0"
          >
            <Bell className="w-5 h-5 text-[#13231C]" />
            {hasUnread && (
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#F2622E] border-2 border-white" />
            )}
          </button>

          {/* User Profile Pill */}
          <div className="h-[52px] bg-white border border-[#ECE9E1] rounded-full flex items-center gap-3 px-4.5 pl-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="w-10 h-10 rounded-full bg-[#FDE8DD] text-[#C2410C] font-outfit text-base font-bold flex items-center justify-center flex-shrink-0">
              SR
            </span>
            <div className="flex flex-col pr-2 text-left">
              <span className="text-[14px] font-bold text-[#13231C] leading-snug">
                Shree Ram Marriage Garden
              </span>
              <span className="text-[12px] font-medium text-[#5B6661]">
                Seva Sathi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER: Good evening + Welcome back + Post button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <span className="text-[16px] font-medium text-[#5B6661]">
            Good evening
          </span>
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            Welcome back, <span className="text-[#F2622E]">Shree Ram.</span>
          </h1>
          <span className="text-[15px] font-medium text-[#5B6661]">
            Your donations reached 3 shelters this month.
          </span>
        </div>

        <Link
          href="/donor/new"
          className="inline-flex items-center justify-center gap-2.5 h-[50px] px-6 rounded-[16px] bg-[#0E3B2E] hover:bg-[#17553F] text-white font-semibold text-[15px] shadow-sm transition-all flex-shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Post surplus food</span>
        </Link>
      </div>

      {/* MAIN LAYOUT: Left 2 Cols (Metrics + Current + Table) & Right 1 Col (Level + Actions + Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Donations */}
            <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FDE8DD] flex items-center justify-center text-[#E0531F] flex-shrink-0">
                <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#5B6661]">
                  Donations
                </span>
                <span className="font-outfit text-[30px] font-bold text-[#13231C] leading-tight">
                  24
                </span>
                <span className="text-[12px] font-semibold text-[#166534]">
                  +4 this month
                </span>
              </div>
            </div>

            {/* Meals to people */}
            <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E3F5EA] flex items-center justify-center text-[#1E9E5A] flex-shrink-0">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#5B6661]">
                  Meals to people
                </span>
                <span className="font-outfit text-[30px] font-bold text-[#13231C] leading-tight">
                  1,240
                </span>
                <span className="text-[12px] font-semibold text-[#166534]">
                  +180 this month
                </span>
              </div>
            </div>

            {/* Food diverted */}
            <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E3F5EA] flex items-center justify-center text-[#1E9E5A] flex-shrink-0">
                <Leaf className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#5B6661]">
                  Food diverted
                </span>
                <span className="font-outfit text-[30px] font-bold text-[#13231C] leading-tight">
                  612 kg
                </span>
                <span className="text-[12px] font-semibold text-[#166534]">
                  +96 kg this month
                </span>
              </div>
            </div>

            {/* Impact points */}
            <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFF1D1] flex items-center justify-center text-[#E89B1C] flex-shrink-0">
                <Star className="w-6 h-6 fill-[#E89B1C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#5B6661]">
                  Impact points
                </span>
                <span className="font-outfit text-[30px] font-bold text-[#13231C] leading-tight">
                  860
                </span>
                <span className="text-[12px] font-semibold text-[#166534]">
                  +120 this month
                </span>
              </div>
            </div>
          </div>

          {/* CURRENT DONATION CARD (#DN1025) */}
          <div className="ui-card p-6 flex flex-col gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                  Current donation
                </h2>
                <span className="ui-chip bg-[#E0EAFF] text-[#1D4ED8]">
                  Driver on the way
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#13231C]">
                #DN1025
              </span>
            </div>

            {/* 4-Step Stepper Pipeline */}
            <div className="relative pt-2 pb-1">
              <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-[3px] bg-[#E6E3DC]" />
              <div className="absolute top-[18px] left-[12.5%] w-[45%] h-[3px] bg-[#0E3B2E]" />

              <div className="relative grid grid-cols-4 text-center z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    Posted · 10:02 PM
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    Matched · 10:03 PM
                  </span>
                </div>

                {/* Step 3 (Active) */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#E3F5EA] border-[3px] border-[#1E9E5A] text-[#166534] flex items-center justify-center">
                    <Truck className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className="text-[13px] font-bold text-[#13231C]">
                    Picking up
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#F1F0EB] text-[#5B6661] flex items-center justify-center">
                    <Flag className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">Delivered</span>
                </div>
              </div>
            </div>

            {/* Detail Banner Box */}
            <div className="bg-[#F6F5F1] rounded-[18px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Dal-chawal · 50 meals
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Safe until 11:00 PM
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Asha Shelter
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Malviya Nagar, Jaipur
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Ravi, arriving in 8 min
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Pickup OTP{" "}
                  <b className="text-[#13231C] tracking-[0.1em] font-bold">
                    4821
                  </b>
                </span>
              </div>

              <Link
                href="/donor/donations/1025"
                className="btn-primary h-[46px] px-5 text-[14px]"
              >
                Track live
              </Link>
            </div>
          </div>

          {/* RECENT DONATIONS TABLE */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                Recent donations
              </h2>
              <Link
                href="/donor/donations/1025"
                className="text-[14px] font-semibold text-[#0E3B2E] underline hover:text-[#C2410C]"
              >
                See all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F5F1] text-[#5B6661] text-[13px] font-semibold">
                    <th className="py-3 px-4 rounded-l-[12px]">ID</th>
                    <th className="py-3 px-4">Food</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Went to</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-[12px]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EEE8] text-[14px]">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1024
                    </td>
                    <td className="py-3.5 px-4 font-medium">Veg biryani</td>
                    <td className="py-3.5 px-4 font-medium">30 meals</td>
                    <td className="py-3.5 px-4">Seva Ghar</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        Delivered
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">20 Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1023
                    </td>
                    <td className="py-3.5 px-4 font-medium">Bread &amp; buns</td>
                    <td className="py-3.5 px-4 font-medium">20 packs</td>
                    <td className="py-3.5 px-4">Care Centre</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        Delivered
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">18 Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1022
                    </td>
                    <td className="py-3.5 px-4 font-medium">Rice &amp; dal</td>
                    <td className="py-3.5 px-4 font-medium">10 kg</td>
                    <td className="py-3.5 px-4">Rescue deal</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#FFF1D1] text-[#8A5A0B]">
                        Collected
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">15 Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1021
                    </td>
                    <td className="py-3.5 px-4 font-medium">Fruits</td>
                    <td className="py-3.5 px-4 font-medium">15 kg</td>
                    <td className="py-3.5 px-4">Pinjrapole Gaushala</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#F3E9DF] text-[#6B4423]">
                        Diverted
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">12 Sep 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 Col on lg) */}
        <div className="flex flex-col gap-6">
          {/* Your Level Card */}
          <div className="ui-card p-6 flex flex-col gap-4 bg-[#EEF6F0] border-[#DCEBE1] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-[#5B6661]">
                  Your level
                </span>
                <span className="font-outfit text-[26px] font-extrabold text-[#0E3B2E]">
                  Seva Sathi
                </span>
              </div>
              <span className="w-14 h-14 rounded-full bg-[#FDE8DD] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Heart className="w-7 h-7 fill-[#F2622E] stroke-none" />
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 bg-white rounded-full overflow-hidden">
              <div className="w-[86%] h-full bg-[#0E3B2E] rounded-full" />
            </div>

            <div className="flex justify-between text-[13px]">
              <span className="font-bold text-[#13231C]">860 / 1,000</span>
              <span className="text-[#5B6661]">140 to Ann Rakshak</span>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2 pt-1">
              <span
                title="First rescue"
                className="w-10 h-10 rounded-full bg-[#E3F5EA] flex items-center justify-center"
              >
                <Leaf className="w-5 h-5 text-[#1E9E5A]" />
              </span>
              <span
                title="100 meals"
                className="w-10 h-10 rounded-full bg-[#FDE8DD] flex items-center justify-center"
              >
                <Heart className="w-5 h-5 fill-[#F2622E] stroke-none" />
              </span>
              <span
                title="Night saver"
                className="w-10 h-10 rounded-full bg-[#FFF1D1] flex items-center justify-center"
              >
                <Moon className="w-5 h-5 fill-[#E89B1C] stroke-none" />
              </span>
              <span
                title="Locked"
                className="w-10 h-10 rounded-full bg-[#E9E7E1] flex items-center justify-center"
              >
                <Lock className="w-4 h-4 text-[#8A938F]" />
              </span>
            </div>

            <Link
              href="/rewards"
              className="btn-secondary w-full justify-center bg-white mt-1"
            >
              View rewards
            </Link>
          </div>

          {/* Quick Actions 2x2 Grid */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              Quick actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/donor/new"
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </span>
                <span>Post food</span>
              </Link>

              <Link
                href="/shelter"
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <MapPin className="w-7 h-7 text-[#0E3B2E]" />
                <span>Nearby shelters</span>
              </Link>

              <Link
                href="/admin/impact"
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <FileText className="w-7 h-7 text-[#0E3B2E]" />
                <span>Impact report</span>
              </Link>

              <Link
                href="/rewards"
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <Gift className="w-7 h-7 text-[#E0531F]" />
                <span>Rewards</span>
              </Link>
            </div>
          </div>

          {/* Promo Card: Small donations add up */}
          <div className="ui-card p-6 bg-[#FDEEE6] border-[#F8DCCC] flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <span className="font-outfit text-[19px] font-bold text-[#7A2E0E]">
              Small donations add up
            </span>
            <span className="text-[14px] leading-relaxed text-[#7A3A1C]">
              Even 10 meals feed a shelter&apos;s evening shift. Post whatever is left.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
