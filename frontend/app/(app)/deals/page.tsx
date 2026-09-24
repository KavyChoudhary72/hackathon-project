"use client";

import React, { useState } from "react";
import { Navigation } from "lucide-react";

export default function RescueDealsPage() {
  const [filter, setFilter] = useState("all");
  const [claimedDeal, setClaimedDeal] = useState<string | null>("Veg thali");

  return (
    <div className="max-w-[440px] mx-auto w-full flex flex-col gap-3.5 py-2 pb-16">
      {/* HEADER: Title + Subtitle */}
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="font-outfit text-[28px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
          Rescue deals near you
        </h1>
        <span className="text-[14px] text-[#5B6661]">
          Fresh surplus at a nominal price. Pickup only.
        </span>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => setFilter("distance")}
          className={`h-[34px] px-3.5 rounded-full text-[13px] font-semibold transition-all ${
            filter === "distance" || filter === "all"
              ? "bg-[#0E3B2E] text-white"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33]"
          }`}
        >
          Within 3 km
        </button>

        <button
          type="button"
          onClick={() => setFilter("veg")}
          className={`h-[34px] px-3.5 rounded-full text-[13px] font-semibold transition-all ${
            filter === "veg"
              ? "bg-[#0E3B2E] text-white"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33]"
          }`}
        >
          Veg only
        </button>

        <button
          type="button"
          onClick={() => setFilter("map")}
          className={`h-[34px] px-3.5 rounded-full text-[13px] font-semibold transition-all ${
            filter === "map"
              ? "bg-[#0E3B2E] text-white"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33]"
          }`}
        >
          Map
        </button>
      </div>

      {/* DEAL CARD 1: Veg Thali */}
      <div className="ui-card p-4 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3.5">
          <div className="w-[76px] h-[76px] rounded-[16px] bg-[#F4E4CC] flex items-center justify-center text-[11px] font-bold text-[#7A4A06] flex-shrink-0">
            Photo
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[16px] font-bold text-[#13231C]">
              Veg thali
            </span>
            <span className="text-[13px] text-[#5B6661]">
              Hotel Saffron Kitchen · 1.2 km
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[11px] h-6 px-2.5">
                Veg
              </span>
              <span className="ui-chip bg-[#FFF1D1] text-[#7A4A06] text-[11px] h-6 px-2.5">
                Collect by 9:30 PM
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-[#F0EEE8]">
          <div>
            <span className="font-outfit text-[26px] font-extrabold text-[#13231C]">
              ₹20
            </span>
            <span className="text-[13px] text-[#5B6661]"> / meal · 18 left</span>
          </div>

          <button
            type="button"
            onClick={() => setClaimedDeal("Veg thali")}
            className="h-11 px-5 rounded-[14px] bg-[#0E3B2E] hover:bg-[#17553F] text-white font-bold text-[14px] shadow-2xs transition-all active:scale-95"
          >
            Claim
          </button>
        </div>
      </div>

      {/* DEAL CARD 2: Bread & Buns */}
      <div className="ui-card p-4 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3.5">
          <div className="w-[76px] h-[76px] rounded-[16px] bg-[#EFE3D0] flex items-center justify-center text-[11px] font-bold text-[#6B4423] flex-shrink-0">
            Photo
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[16px] font-bold text-[#13231C]">
              Bread &amp; buns
            </span>
            <span className="text-[13px] text-[#5B6661]">
              Baker&apos;s Corner · 2.4 km
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[11px] h-6 px-2.5">
                Veg
              </span>
              <span className="ui-chip bg-[#FFF1D1] text-[#7A4A06] text-[11px] h-6 px-2.5">
                Collect by 10:15 PM
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-[#F0EEE8]">
          <div>
            <span className="font-outfit text-[26px] font-extrabold text-[#13231C]">
              ₹10
            </span>
            <span className="text-[13px] text-[#5B6661]"> / pack · 12 left</span>
          </div>

          <button
            type="button"
            onClick={() => setClaimedDeal("Bread & buns")}
            className="h-11 px-5 rounded-[14px] bg-[#0E3B2E] hover:bg-[#17553F] text-white font-bold text-[14px] shadow-2xs transition-all active:scale-95"
          >
            Claim
          </button>
        </div>
      </div>

      {/* CLAIMED BOTTOM SHEET / CARD */}
      {claimedDeal && (
        <div className="ui-card p-5 pt-3.5 flex flex-col gap-4 bg-white border border-[#ECE9E1] shadow-[0_8px_30px_rgba(14,59,46,0.12)] mt-2">
          <span className="w-11 h-1.5 rounded-full bg-[#DCD9D0] self-center" />

          <div className="flex justify-between items-center">
            <span className="font-outfit text-[22px] font-bold text-[#13231C]">
              Claimed · {claimedDeal}
            </span>
            <button
              type="button"
              onClick={() => setClaimedDeal(null)}
              className="text-[12px] font-semibold text-[#5B6661] hover:text-[#0E3B2E]"
            >
              Dismiss
            </button>
          </div>

          {/* Show this OTP at pickup */}
          <div className="bg-[#0E3B2E] text-white rounded-[18px] p-4.5 flex flex-col items-center gap-1">
            <span className="text-[13px] text-[#C9DDD3]">
              Show this OTP at pickup
            </span>
            <span className="font-outfit text-[44px] font-extrabold tracking-[0.2em]">
              5531
            </span>
          </div>

          <div className="flex flex-col gap-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#5B6661]">Meals</span>
              <b className="font-bold text-[#13231C]">2</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6661]">
                Pay the restaurant (cash or UPI)
              </span>
              <b className="font-bold text-[#13231C]">₹40</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B6661]">Collect by</span>
              <b className="font-bold text-[#13231C]">9:30 PM</b>
            </div>
          </div>

          <span className="text-[12px] leading-relaxed bg-[#F6F5F1] rounded-[12px] p-2.5 px-3 text-[#5B6661]">
            Surplus food sold directly by Hotel Saffron Kitchen. Eat before the time shown.
          </span>

          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[54px] rounded-[16px] bg-[#C2410C] hover:bg-[#A8370A] text-white text-[16px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Navigation className="w-5 h-5 fill-white" />
            <span>Get directions</span>
          </a>
        </div>
      )}
    </div>
  );
}