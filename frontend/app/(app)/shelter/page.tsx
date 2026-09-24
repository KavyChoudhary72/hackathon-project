"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, AlertCircle } from "lucide-react";

export default function ShelterAppPage() {
  const [capacity, setCapacity] = useState(60);
  const [isAccepted, setIsAccepted] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI">("EN");

  const handleAccept = () => {
    setIsAccepted(true);
    setCapacity((prev) => Math.max(0, prev - 50));
  };

  return (
    <div className="max-w-[440px] mx-auto w-full flex flex-col gap-4 py-2">
      {/* TOP HEADER: Shelter Name + Language Switcher */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col gap-0.5">
          <span className="font-outfit text-[24px] font-extrabold text-[#0E3B2E]">
            Asha Shelter
          </span>
          <span className="text-[13px] text-[#5B6661]">
            Malviya Nagar, Jaipur
          </span>
        </div>

        <div className="flex bg-white border border-[#ECE9E1] rounded-full p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setLang("EN")}
            className={`h-[34px] px-3.5 rounded-full text-[13px] font-bold transition-all ${
              lang === "EN"
                ? "bg-[#0E3B2E] text-white"
                : "text-[#2A3A33] hover:text-[#0E3B2E]"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("HI")}
            className={`h-[34px] px-3.5 rounded-full text-[13px] font-bold transition-all ${
              lang === "HI"
                ? "bg-[#0E3B2E] text-white"
                : "text-[#2A3A33] hover:text-[#0E3B2E]"
            }`}
          >
            हिं
          </button>
        </div>
      </div>

      {/* CAPACITY STEPPER CARD */}
      <div className="ui-card p-5 flex flex-col gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <span className="text-[16px] font-bold text-[#13231C]">
          How many meals can you take tonight?
        </span>

        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => setCapacity(Math.max(0, capacity - 5))}
            aria-label="Fewer meals"
            className="w-13 h-13 rounded-full bg-[#F6F5F1] text-[26px] font-bold text-[#0E3B2E] flex items-center justify-center hover:bg-[#EDECE6] active:scale-95 transition-all"
          >
            −
          </button>

          <div className="flex flex-col items-center">
            <span className="font-outfit text-[52px] font-extrabold text-[#0E3B2E] leading-none">
              {capacity}
            </span>
            <span className="text-[13px] text-[#5B6661] font-medium">meals</span>
          </div>

          <button
            type="button"
            onClick={() => setCapacity(capacity + 5)}
            aria-label="More meals"
            className="w-13 h-13 rounded-full bg-[#F6F5F1] text-[26px] font-bold text-[#0E3B2E] flex items-center justify-center hover:bg-[#EDECE6] active:scale-95 transition-all"
          >
            +
          </button>
        </div>

        <span className="text-[13px] font-semibold text-[#166534] flex items-center gap-1.5">
          <Check className="w-4 h-4 stroke-[2.8]" />
          <span>Saved. Donors see this right away.</span>
        </span>
      </div>

      {/* INCOMING OFFER CARD (Orange border) */}
      {!isAccepted ? (
        <div className="ui-card p-5 flex flex-col gap-3.5 border-2 border-[#F2622E] shadow-[0_4px_16px_rgba(242,98,46,0.08)]">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-bold text-[#C2410C]">
              New offer
            </span>
            <span className="ui-chip bg-[#FDE8DD] text-[#9A3412] font-bold h-7">
              Reply in 0:24
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-[72px] h-[72px] rounded-[16px] bg-[#F4E4CC] flex items-center justify-center text-[11px] font-bold text-[#7A4A06] flex-shrink-0">
              Food Photo
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-outfit text-[24px] font-bold text-[#13231C] leading-tight">
                50 meals
              </span>
              <span className="text-[14px] text-[#13231C]">
                Dal-chawal · <span className="text-[#166534] font-bold">Veg</span>
              </span>
              <span className="text-[13px] text-[#5B6661]">
                Safe until 11:00 PM
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            <span className="ui-chip bg-[#F1F0EB] text-[#2A3A33] text-[12px]">
              2.1 km · ~12 min
            </span>
            <span className="ui-chip bg-[#F1F0EB] text-[#2A3A33] text-[12px]">
              fits your space
            </span>
            <span className="ui-chip bg-[#F1F0EB] text-[#2A3A33] text-[12px]">
              cooked veg
            </span>
          </div>

          <span className="text-[13px] text-[#5B6661]">
            From Shree Ram Marriage Garden
          </span>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="btn-primary flex-2 h-[56px] text-[17px] font-bold justify-center"
            >
              Accept
            </button>
            <button
              type="button"
              className="btn-secondary flex-1 h-[56px] text-[16px] font-semibold justify-center"
            >
              Decline
            </button>
          </div>
        </div>
      ) : (
        /* ACCEPTED CONFIRMATION CARD */
        <div className="ui-card p-5 flex flex-col gap-3.5 bg-[#EEF8F1] border-[#CDE8D6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <span className="text-[15px] font-bold text-[#166534] flex items-center gap-2">
            <Check className="w-5 h-5 stroke-[2.8]" />
            <span>Accepted · 50 meals on the way</span>
          </span>

          <span className="text-[14px] text-[#13231C]">
            Driver Ravi · arriving about 10:24 PM
          </span>

          <div className="bg-[#0E3B2E] text-white rounded-[16px] p-4 flex flex-col items-center gap-1">
            <span className="text-[13px] text-[#C9DDD3]">
              Give this OTP to the driver
            </span>
            <span className="font-outfit text-[40px] font-extrabold tracking-[0.2em]">
              7390
            </span>
          </div>
        </div>
      )}

      {/* EARLIER TONIGHT CARD */}
      <div className="ui-card p-5 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <span className="text-[16px] font-bold text-[#13231C]">
          Earlier tonight
        </span>

        <div className="flex justify-between items-center text-[14px]">
          <span>
            <b>30 meals</b> · Veg biryani
          </span>
          <span className="ui-chip bg-[#DCF5E4] text-[#166534]">Delivered</span>
        </div>

        <Link
          href="/admin/quality-reports"
          className="text-[13px] font-semibold text-[#5B6661] underline hover:text-[#C2410C]"
        >
          Report a problem with this food
        </Link>
      </div>

      {/* WHATSAPP FOOTNOTE */}
      <span className="text-[13px] text-center text-[#5B6661] leading-relaxed pt-2">
        Offers also arrive on WhatsApp. Reply <b>HAAN</b> to accept.
      </span>
    </div>
  );
}