"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Check,
  Truck,
  Flag,
  Phone,
} from "lucide-react";

export default function LiveTrackerPage({
  params,
}: {
  params: { id: string };
}) {
  const donationId = params?.id || "DN1025";

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER: Breadcrumb + Title + Matched Chip + Safe Time Left */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/donor"
            className="text-[14px] font-semibold text-[#5B6661] hover:text-[#0E3B2E]"
          >
            My donations / #{donationId}
          </Link>

          <div className="flex flex-wrap items-center gap-3.5">
            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
              Dal-chawal · 50 meals
            </h1>
            <span className="ui-chip bg-[#DCF5E4] text-[#166534] h-8 text-[14px]">
              Matched
            </span>
          </div>

          <span className="text-[15px] text-[#5B6661]">
            Veg · cooked · posted 10:02 PM · safe until 11:00 PM
          </span>
        </div>

        <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#FFF4DB] text-[#7A4A06] text-[14px] font-bold shadow-2xs flex-shrink-0">
          <Clock className="w-4 h-4 text-[#7A4A06]" />
          <span>54 min of safe time left</span>
        </span>
      </div>

      {/* 4-STEP PIPELINE CARD */}
      <div className="ui-card p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="relative pt-2 pb-1">
          <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-[3px] bg-[#E6E3DC]" />
          <div className="absolute top-[18px] left-[12.5%] w-[25%] h-[3px] bg-[#0E3B2E]" />

          <div className="relative grid grid-cols-4 text-center z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span className="text-[14px] font-bold text-[#13231C]">Posted</span>
              <span className="text-[12px] text-[#5B6661]">10:02 PM</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span className="text-[14px] font-bold text-[#13231C]">Matched</span>
              <span className="text-[12px] text-[#5B6661]">10:03 PM</span>
            </div>

            {/* Step 3 (Active) */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#E3F5EA] border-[3px] border-[#1E9E5A] text-[#166534] flex items-center justify-center">
                <Truck className="w-4 h-4 stroke-[2.2]" />
              </span>
              <span className="text-[14px] font-bold text-[#13231C]">Picked up</span>
              <span className="text-[12px] text-[#5B6661]">Driver on the way</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#F1F0EB] text-[#5B6661] flex items-center justify-center">
                <Flag className="w-4 h-4 stroke-[2.2]" />
              </span>
              <span className="text-[14px] font-semibold text-[#5B6661]">Delivered</span>
              <span className="text-[12px] text-[#5B6661]">—</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN RESPONSIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Finding a shelter & Pickup */}
        <div className="flex flex-col gap-6">
          {/* Finding a Shelter Card */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                Finding a shelter
              </h2>
              <span className="text-[13px] text-[#5B6661]">
                Offers move on after 30 sec
              </span>
            </div>

            {/* Candidate 1: Timed Out */}
            <div className="flex items-start gap-3.5 pt-1">
              <span className="w-8 h-8 rounded-full bg-[#F1F0EB] flex items-center justify-center flex-shrink-0 text-[#5B6661]">
                <Clock className="w-4 h-4" />
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Seva Ghar · 3.4 km
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Offered 10:02:14 PM · no reply in 30 sec, moved on
                </span>
              </div>
              <span className="ui-chip bg-[#F1F0EB] text-[#5B6661]">
                Timed out
              </span>
            </div>

            {/* Candidate 2: Accepted */}
            <div className="flex items-start gap-3.5 bg-[#EEF8F1] rounded-[16px] p-3.5 -mx-1.5">
              <span className="w-8 h-8 rounded-full bg-[#1E9E5A] text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Asha Shelter · 2.1 km
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Offered 10:02:44 PM · accepted on WhatsApp in 18 sec
                </span>
              </div>
              <span className="ui-chip bg-[#1E9E5A] text-white font-bold">
                Accepted
              </span>
            </div>
          </div>

          {/* Pickup Card */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
              Pickup
            </h2>

            <div className="flex items-center gap-3.5">
              <span className="font-outfit w-[52px] h-[52px] rounded-full bg-[#E0EAFF] text-[#1D4ED8] font-bold text-lg flex items-center justify-center flex-shrink-0">
                RK
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[16px] font-bold text-[#13231C]">
                  Ravi Kumar
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Volunteer · bike · arriving in 8 min
                </span>
              </div>
              <a
                href="tel:+919876543210"
                className="btn-secondary h-11 px-4 text-[14px]"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
            </div>

            {/* Pickup OTP Box */}
            <div className="bg-[#0E3B2E] rounded-[18px] p-5 px-6 flex items-center justify-between text-white">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-[#C9DDD3]">
                  Pickup OTP
                </span>
                <span className="text-[13px] text-[#A9C9BA]">
                  Share only with the driver at pickup
                </span>
              </div>
              <span className="font-outfit text-[40px] font-extrabold tracking-[0.2em]">
                4821
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Why Asha Shelter? Match Score Breakdown */}
        <div className="ui-card p-6 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                Why Asha Shelter?
              </h2>
              <span className="text-[14px] text-[#5B6661]">
                2.1 km · ~12 min · room for 60 meals · accepts cooked veg
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-outfit text-[40px] font-extrabold text-[#166534] leading-none">
                86%
              </span>
              <span className="text-[12px] text-[#5B6661]">match score</span>
            </div>
          </div>

          {/* 4 Factor Bars */}
          <div className="flex flex-col gap-3">
            {/* Distance */}
            <div className="flex items-center gap-3.5 text-[14px]">
              <span className="w-40 text-[#13231C]">
                Distance <span className="text-[#5B6661]">(40%)</span>
              </span>
              <div className="flex-1 h-2.5 bg-[#F1F0EB] rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-[#0E3B2E] rounded-full" />
              </div>
              <b className="w-9 text-right font-bold text-[#13231C]">0.92</b>
            </div>

            {/* Space */}
            <div className="flex items-center gap-3.5 text-[14px]">
              <span className="w-40 text-[#13231C]">
                Space <span className="text-[#5B6661]">(30%)</span>
              </span>
              <div className="flex-1 h-2.5 bg-[#F1F0EB] rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-[#0E3B2E] rounded-full" />
              </div>
              <b className="w-9 text-right font-bold text-[#13231C]">0.80</b>
            </div>

            {/* Food preference */}
            <div className="flex items-center gap-3.5 text-[14px]">
              <span className="w-40 text-[#13231C]">
                Food preference <span className="text-[#5B6661]">(20%)</span>
              </span>
              <div className="flex-1 h-2.5 bg-[#F1F0EB] rounded-full overflow-hidden">
                <div className="w-[100%] h-full bg-[#0E3B2E] rounded-full" />
              </div>
              <b className="w-9 text-right font-bold text-[#13231C]">1.00</b>
            </div>

            {/* Urgency */}
            <div className="flex items-center gap-3.5 text-[14px]">
              <span className="w-40 text-[#13231C]">
                Urgency <span className="text-[#5B6661]">(10%)</span>
              </span>
              <div className="flex-1 h-2.5 bg-[#F1F0EB] rounded-full overflow-hidden">
                <div className="w-[60%] h-full bg-[#F2622E] rounded-full" />
              </div>
              <b className="w-9 text-right font-bold text-[#13231C]">0.60</b>
            </div>
          </div>

          {/* Filtered Out Shelters */}
          <div className="border-t border-[#F0EEE8] pt-4 flex flex-col gap-3">
            <span className="text-[15px] font-bold text-[#13231C]">
              Filtered out · 4 shelters
            </span>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="font-semibold text-[#13231C]">
                Nayi Umeed Home
              </span>
              <span className="text-[#9A3412] text-right">
                48 min away, safe for 35 min more
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="font-semibold text-[#13231C]">
                Sahara Night Shelter
              </span>
              <span className="text-[#9A3412]">full tonight</span>
            </div>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="font-semibold text-[#13231C]">
                Roshni Children&apos;s Home
              </span>
              <span className="text-[#9A3412]">doesn&apos;t accept cooked food</span>
            </div>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="font-semibold text-[#13231C]">Apna Ghar</span>
              <span className="text-[#9A3412]">closed at 10:30 PM</span>
            </div>
          </div>

          {/* Fallback Note */}
          <div className="bg-[#F6F5F1] rounded-[14px] p-3.5 px-4 text-[13px] leading-relaxed text-[#5B6661] mt-auto">
            If no shelter can take it in time, this becomes a rescue deal nearby, then goes to animal feed or biogas. Nothing is thrown away.
          </div>
        </div>
      </div>
    </div>
  );
}