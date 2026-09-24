"use client";

import React, { useState } from "react";
import { Navigation, Phone, Check } from "lucide-react";

export default function DriverMissionPage() {
  const [otp, setOtp] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleKeyClick = (digit: string) => {
    if (otp.length < 4) {
      setOtp([...otp, digit]);
    }
  };

  const handleDelete = () => {
    setOtp(otp.slice(0, -1));
  };

  const handleConfirm = () => {
    if (otp.length === 4) {
      setIsConfirmed(true);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto w-full flex flex-col gap-4 py-2">
      {/* TOP HEADER: Driver Greeting + Available status + Step Badge */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col gap-0.5">
          <span className="font-outfit text-[24px] font-extrabold text-[#0E3B2E]">
            Hi Ravi
          </span>
          <span className="text-[13px] font-semibold text-[#166534] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E9E5A]" />
            <span>You&apos;re available</span>
          </span>
        </div>

        <span className="ui-chip bg-[#E0EAFF] text-[#1D4ED8] h-8 text-[13px] font-bold">
          Step 1 of 2
        </span>
      </div>

      {/* ROUTE MAP CARD */}
      <div className="ui-card overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {/* Map Vector Graphic */}
        <div className="h-[200px] bg-[#E7EFE9] relative overflow-hidden flex items-center justify-center">
          <svg
            width="100%"
            height="200"
            viewBox="0 0 390 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 60h390M0 140h390M90 0v200M260 0v200"
              stroke="#FFFFFF"
              strokeWidth="12"
            />
            <path d="M0 180L390 20" stroke="#FFFFFF" strokeWidth="7" />
            <path
              d="M90 140 L90 60 L260 60 L300 40"
              fill="none"
              stroke="#0E3B2E"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 10"
            />
            <circle
              cx="90"
              cy="140"
              r="9"
              fill="#1D4ED8"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
          </svg>
          {/* Target Destination Pin */}
          <div className="absolute right-16 top-3 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[#F2622E] flex items-center justify-center shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Pickup Location Details */}
        <div className="p-5 flex flex-col gap-3">
          <span className="text-[13px] font-bold text-[#C2410C]">
            Pickup · 1.4 km
          </span>
          <span className="font-outfit text-[22px] font-bold text-[#13231C] leading-tight">
            Shree Ram Marriage Garden
          </span>
          <span className="text-[14px] text-[#5B6661]">
            Gate 2, Malviya Nagar · 50 meals, dal-chawal
          </span>

          <div className="flex gap-2.5 pt-1">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-2 h-[52px] text-[15px] font-bold justify-center"
            >
              <Navigation className="w-4 h-4 fill-white" />
              <span>Open route</span>
            </a>
            <a
              href="tel:+919876543210"
              className="btn-secondary flex-1 h-[52px] text-[15px] font-semibold justify-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* INTERACTIVE OTP PAD CARD */}
      {!isConfirmed ? (
        <div className="ui-card p-5 flex flex-col gap-4 items-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <span className="text-[16px] font-bold text-[#13231C]">
            Enter pickup OTP from the donor
          </span>

          {/* 4 Digit Boxes */}
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const digit = otp[idx] || "";
              const isActive = otp.length === idx;
              return (
                <span
                  key={idx}
                  className={`w-14 h-16 rounded-[14px] font-outfit text-[28px] font-bold flex items-center justify-center bg-white transition-all ${
                    digit
                      ? "border-2 border-[#0E3B2E] text-[#13231C]"
                      : isActive
                      ? "border-2 border-[#F2622E]"
                      : "border border-[#DCD9D0] text-transparent"
                  }`}
                >
                  {digit}
                </span>
              );
            })}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full bg-[#F1F0EB] p-2.5 rounded-[18px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeyClick(n)}
                className="h-13 rounded-[12px] bg-white text-[#13231C] font-outfit text-[22px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all"
              >
                {n}
              </button>
            ))}
            <span />
            <button
              type="button"
              onClick={() => handleKeyClick("0")}
              className="h-13 rounded-[12px] bg-white text-[#13231C] font-outfit text-[22px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete"
              className="h-13 rounded-[12px] bg-white text-[#5B6661] text-[20px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={otp.length < 4}
            className={`w-full h-14 rounded-[16px] text-[16px] font-bold transition-all ${
              otp.length === 4
                ? "bg-[#0E3B2E] text-white cursor-pointer hover:bg-[#17553F]"
                : "bg-[#C9D3CE] text-[#4A5752] cursor-not-allowed"
            }`}
          >
            Confirm pickup
          </button>
        </div>
      ) : (
        /* CONFIRMED STATE */
        <div className="ui-card p-6 flex flex-col gap-3 items-center text-center bg-[#EEF8F1] border-[#CDE8D6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <span className="w-12 h-12 rounded-full bg-[#1E9E5A] text-white flex items-center justify-center">
            <Check className="w-6 h-6 stroke-[3]" />
          </span>
          <span className="font-outfit text-[22px] font-bold text-[#0E3B2E]">
            Pickup confirmed!
          </span>
          <span className="text-[14px] text-[#5B6661]">
            Food verified and loaded. Ready for delivery to Asha Shelter.
          </span>
        </div>
      )}

      {/* FOOTER NOTE */}
      <span className="text-[13px] text-center text-[#5B6661] leading-relaxed pt-1">
        Next: deliver to Asha Shelter, 2.1 km. You&apos;ll need their OTP.
      </span>
    </div>
  );
}