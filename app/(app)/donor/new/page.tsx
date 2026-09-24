"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  Camera,
  MapPin,
  Check,
} from "lucide-react";

export default function PostSurplusFoodPage() {
  const router = useRouter();
  const [foodName, setFoodName] = useState("Dal-chawal with jeera aloo");
  const [category, setCategory] = useState("Cooked");
  const [isVeg, setIsVeg] = useState(true);
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState("Meals");
  const [preparedAt, setPreparedAt] = useState("8:30 PM");
  const [safeUntil, setSafeUntil] = useState("11:00 PM");
  const [isConfirmed, setIsConfirmed] = useState(true);

  const foodSuggestions = [
    "Dal-chawal",
    "Roti-sabzi",
    "Biryani",
    "Snacks",
    "Sweets",
    "Bread",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/donor/donations/1025");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER: Breadcrumb + Title + Timer Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/donor"
            className="text-[14px] font-semibold text-[#5B6661] hover:text-[#0E3B2E]"
          >
            Dashboard / Post food
          </Link>
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            Post surplus food
          </h1>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            Takes less than a minute. We start finding a shelter as soon as you post.
          </span>
        </div>

        <span className="inline-flex items-center gap-2 h-[38px] px-3.5 rounded-full bg-white border border-[#ECE9E1] text-[14px] font-bold text-[#13231C] shadow-2xs flex-shrink-0">
          <Clock className="w-4 h-4 text-[#1E9E5A]" />
          <span>00:38</span>
        </span>
      </div>

      {/* 2-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN FORM (2 Cols on lg) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 ui-card p-6 sm:p-7 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
        >
          {/* AI Banner */}
          <div className="flex items-center gap-3 p-3.5 px-4 rounded-[14px] bg-[#FFF6E5] text-[#7A4A06] text-[14px] font-semibold">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>Suggested from your photo. Check the details before posting.</span>
          </div>

          {/* What food is it? */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="food" className="text-[14px] font-bold text-[#13231C]">
              What food is it?
            </label>
            <input
              id="food"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="h-[50px] border border-[#F1D9A6] bg-[#FFFBF2] rounded-[14px] px-4 text-[15px] text-[#13231C] outline-none focus:border-[#F2622E]"
            />
            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {foodSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFoodName(item)}
                  className={`h-10 px-4 rounded-full text-[14px] font-semibold transition-all ${
                    foodName.toLowerCase().includes(item.toLowerCase())
                      ? "bg-[#0E3B2E] text-white"
                      : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:border-[#0E3B2E]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Veg/Non-veg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">Category</span>
              <div className="flex bg-[#F1F0EB] rounded-[14px] p-1">
                {["Cooked", "Raw", "Packaged", "Bakery"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex-1 h-11 rounded-[12px] text-[14px] font-semibold transition-all ${
                      category === cat
                        ? "bg-white text-[#0E3B2E] font-bold shadow-xs"
                        : "text-[#2A3A33] hover:text-[#0E3B2E]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Veg or Non-veg */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">
                Veg or non-veg
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  className={`flex-1 h-14 rounded-[14px] text-[15px] font-bold flex items-center justify-center gap-2.5 transition-all ${
                    isVeg
                      ? "border-2 border-[#1E9E5A] bg-[#EEF8F1] text-[#166534]"
                      : "border border-[#DCD9D0] bg-white text-[#2A3A33]"
                  }`}
                >
                  <span className="w-4 h-4 border-2 border-[#1E9E5A] rounded-[3px] flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#1E9E5A]" />
                  </span>
                  <span>Veg</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  className={`flex-1 h-14 rounded-[14px] text-[15px] font-bold flex items-center justify-center gap-2.5 transition-all ${
                    !isVeg
                      ? "border-2 border-[#B91C1C] bg-rose-50 text-[#B91C1C]"
                      : "border border-[#DCD9D0] bg-white text-[#2A3A33]"
                  }`}
                >
                  <span className="w-4 h-4 border-2 border-[#B91C1C] rounded-[3px] flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
                  </span>
                  <span>Non-veg</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quantity & Prepared at */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* How much */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-bold text-[#13231C]">How much?</span>
              <div className="flex gap-2.5">
                <div className="flex items-center border border-[#DCD9D0] rounded-[14px] h-[50px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(5, quantity - 5))}
                    className="w-12 h-[50px] bg-[#F6F5F1] text-[22px] font-semibold text-[#0E3B2E] hover:bg-[#EEEDE6]"
                  >
                    −
                  </button>
                  <span className="font-outfit w-16 text-center text-[20px] font-bold text-[#13231C]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className="w-12 h-[50px] bg-[#F6F5F1] text-[22px] font-semibold text-[#0E3B2E] hover:bg-[#EEEDE6]"
                  >
                    +
                  </button>
                </div>

                <div className="flex bg-[#F1F0EB] rounded-[14px] p-1 flex-1">
                  {["Meals", "Kg"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`flex-1 h-[42px] rounded-[12px] text-[14px] font-semibold transition-all ${
                        unit === u
                          ? "bg-white text-[#0E3B2E] font-bold shadow-xs"
                          : "text-[#2A3A33]"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prepared at */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="prep" className="text-[14px] font-bold text-[#13231C]">
                Prepared at
              </label>
              <input
                id="prep"
                type="text"
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] bg-white rounded-[14px] px-4 text-[15px] text-[#13231C] outline-none focus:border-[#0E3B2E]"
              />
            </div>
          </div>

          {/* Safe until */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[14px] font-bold text-[#13231C]">Safe until</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {["+1 hr", "+2 hr", "11:00 PM", "+4 hr"].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSafeUntil(time)}
                  className={`h-10 px-4 rounded-full text-[14px] font-semibold transition-all ${
                    safeUntil === time
                      ? "bg-[#0E3B2E] text-white"
                      : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:border-[#0E3B2E]"
                  }`}
                >
                  {time}
                </button>
              ))}
              <span className="text-[13px] text-[#5B6661] ml-1">
                Shelters only get food they can receive before this time.
              </span>
            </div>
          </div>

          {/* Pickup location */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[14px] font-bold text-[#13231C]">
              Pickup location
            </span>
            <div className="flex flex-col sm:flex-row gap-3.5">
              <div className="flex-1 h-[120px] rounded-[16px] bg-[#E7EFE9] relative overflow-hidden flex items-center justify-center">
                <svg
                  width="100%"
                  height="120"
                  viewBox="0 0 600 120"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 70h600M180 0v120M420 0v120M0 25h600"
                    stroke="#FFFFFF"
                    strokeWidth="10"
                  />
                  <path d="M0 100L600 40" stroke="#FFFFFF" strokeWidth="6" />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#F2622E] flex items-center justify-center shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-[280px] flex flex-col justify-center gap-2">
                <span className="text-[15px] font-bold text-[#13231C]">
                  Shree Ram Marriage Garden
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Gate 2, Malviya Nagar, Jaipur
                </span>
                <button
                  type="button"
                  className="btn-secondary h-10 px-4 text-[13px] self-start"
                >
                  Use my location
                </button>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F0EEE8] pt-5 mt-2">
            <label className="flex items-center gap-2.5 text-[14px] font-medium text-[#13231C] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-5 h-5 accent-[#0E3B2E] rounded-[4px]"
              />
              <span>I confirm this food was stored safely and is fit to eat.</span>
            </label>

            <button
              type="submit"
              disabled={!isConfirmed}
              className="btn-primary h-[54px] px-8 text-[16px] w-full sm:w-auto justify-center disabled:opacity-50"
            >
              Post food
            </button>
          </div>
        </form>

        {/* RIGHT ASIDE (1 Col on lg) */}
        <div className="flex flex-col gap-6">
          {/* Photo Card */}
          <div className="ui-card p-6 flex flex-col gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              Photo
            </h2>
            <div className="h-[150px] rounded-[16px] bg-[#F4E4CC] flex flex-col items-center justify-center gap-2 text-[#7A4A06] font-semibold text-[13px]">
              <Camera className="w-8 h-8 opacity-80" />
              <span>Food photo</span>
            </div>
            <span className="text-[13px] text-[#5B6661] leading-relaxed">
              We suggest the details from your photo. You check them before posting.
            </span>
            <button
              type="button"
              className="btn-secondary w-full justify-center h-11 text-[13px]"
            >
              <Camera className="w-4 h-4" />
              <span>Change photo</span>
            </button>
          </div>

          {/* What happens next */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              What happens next
            </h2>
            <ol className="flex flex-col gap-4 text-[14px] leading-relaxed">
              <li className="flex gap-3">
                <span className="font-outfit w-7 h-7 rounded-full bg-[#E3F5EA] text-[#166534] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>We check nearby shelters for space, food preference and timing.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-outfit w-7 h-7 rounded-full bg-[#E3F5EA] text-[#166534] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>The best one gets a WhatsApp offer. No reply in 30 seconds, the next one does.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-outfit w-7 h-7 rounded-full bg-[#E3F5EA] text-[#166534] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>A volunteer picks up with your OTP.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-outfit w-7 h-7 rounded-full bg-[#E3F5EA] text-[#166534] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <span>You get proof of delivery and points.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
