"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Navigation,
  Phone,
  Check,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Package,
  Award,
  DollarSign,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { APP_IMAGES } from "@/lib/images";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DriverMissionPage() {
  const { user } = useAuth();
  const driverName = user?.name || "Ramesh Kumar";
  const vehicleInfo = user?.vehicleType
    ? `Vehicle: ${user.vehicleType.toUpperCase()}`
    : "Vehicle: Motorcycle (RJ-14-EA-4821)";
  const [otp, setOtp] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleKeyClick = (digit: string) => {
    if (otp.length < 4) {
      setOtp((prev) => [...prev, digit]);
    }
  };

  const handleDelete = () => {
    setOtp((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (otp.length === 4) {
      setIsConfirmed(true);
    }
  };

  // Keyboard shortcut listener for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        if (otp.length < 4) {
          setOtp((prev) => (prev.length < 4 ? [...prev, e.key] : prev));
        }
      } else if (e.key === "Backspace") {
        setOtp((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter" && otp.length === 4) {
        setIsConfirmed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [otp]);

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* TOP HEADER: Driver Greeting + Availability + Mission Step Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#ECE9E1] rounded-[24px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <img
            src={APP_IMAGES.deliveryDriver}
            alt="Ravi Kumar"
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-xs border border-[#CDE8D6]"
          />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0E3B2E] tracking-tight">
                Hi {driverName}
              </h1>
              <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>On Duty · Ready for Dispatch</span>
              </span>
              <span className="ui-chip bg-[#F1F0EB] text-[#5B6661] text-[12px] hidden md:inline-flex">
                {vehicleInfo}
              </span>
            </div>
            <span className="text-[14px] text-[#5B6661]">
              Jaipur Central Logistics Hub · Verified Volunteer Driver
            </span>
          </div>
        </div>

        {/* Mission Step Badge & Emergency Support */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="ui-chip bg-[#E0EAFF] text-[#1D4ED8] h-10 px-4 text-[14px] font-extrabold shadow-xs">
            {isConfirmed ? "Step 2 of 2: In Transit" : "Step 1 of 2: Food Pickup"}
          </span>
          <a
            href="tel:+919829099999"
            className="btn-secondary h-10 px-3.5 text-[13px] font-bold text-[#C2410C] border-[#FAD7C8] hover:bg-[#FFF5F0]"
          >
            <AlertTriangle className="w-4 h-4 text-[#C2410C]" />
            <span className="hidden sm:inline">Emergency Helpline</span>
          </a>
        </div>
      </div>

      {/* 4 DRIVER SHIFT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Rescues Done */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E3F5EA] flex items-center justify-center text-[#1E9E5A] flex-shrink-0">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Rescues Today
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              4 <span className="text-base font-medium text-[#5B6661]">trips</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              100% on-time delivery
            </span>
          </div>
        </div>

        {/* Metric 2: Meals Saved */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FDE8DD] flex items-center justify-center text-[#E0531F] flex-shrink-0">
            <Package className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Meals Transported
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              210 <span className="text-base font-medium text-[#5B6661]">meals</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              ~84 kg diverted
            </span>
          </div>
        </div>

        {/* Metric 3: Shift Earnings */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFF1D1] flex items-center justify-center text-[#E89B1C] flex-shrink-0">
            <DollarSign className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Fuel &amp; Stipend
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              ₹480
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              +₹120 this mission
            </span>
          </div>
        </div>

        {/* Metric 4: Driver Rating */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E0EAFF] flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Volunteer Rating
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              4.95 ★
            </span>
            <span className="text-[12px] font-semibold text-[#1D4ED8]">
              Gold Tier Rescuer
            </span>
          </div>
        </div>
      </div>

      {/* MAIN DESKTOP GRID: 2 Columns Left (Route Map, Destination Hub, Manifest) + 1 Column Right (OTP Verification Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT 2 COLUMNS: Mission Map & Manifest */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* ROUTE NAVIGATION & MAP CARD */}
          <div className="ui-card overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {/* Map Canvas Graphic */}
            <div className="h-[240px] bg-[#E7EFE9] relative overflow-hidden flex items-center justify-center">
              <svg
                width="100%"
                height="240"
                viewBox="0 0 700 240"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Roads */}
                <path d="M0 80h700M0 160h700M160 0v240M460 0v240" stroke="#FFFFFF" strokeWidth="14" />
                <path d="M0 210L700 30" stroke="#FFFFFF" strokeWidth="9" />
                {/* Route Path */}
                <path
                  d="M160 160 L160 80 L460 80 L560 50"
                  fill="none"
                  stroke="#0E3B2E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 12"
                />
                {/* Pickup Origin Point */}
                <circle cx="160" cy="160" r="11" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="4" />
                {/* Delivery Destination Pin */}
                <circle cx="560" cy="50" r="11" fill="#F2622E" stroke="#FFFFFF" strokeWidth="4" />
              </svg>

              {/* Origin Marker Badge */}
              <div className="absolute left-32 bottom-8 bg-[#1D4ED8] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>📍 Pickup</span>
              </div>

              {/* Target Marker Badge */}
              <div className="absolute right-24 top-6 bg-[#F2622E] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>🏠 Asha Shelter</span>
              </div>
            </div>

            {/* Location Details & Dual Navigation Actions */}
            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pickup Details Box */}
                <div className="p-4.5 rounded-[18px] bg-[#F6F5F1] border border-[#ECE9E1] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#C2410C]">
                      📍 Step 1: Pickup Location
                    </span>
                    <span className="ui-chip bg-[#FDE8DD] text-[#9A3412] text-[11px] font-bold">
                      1.4 km · ~5 min
                    </span>
                  </div>
                  <span className="font-outfit text-[20px] font-bold text-[#13231C]">
                    Shree Ram Marriage Garden
                  </span>
                  <span className="text-[14px] text-[#5B6661]">
                    Gate 2, JLN Marg, Malviya Nagar, Jaipur
                  </span>
                  <div className="flex gap-2 pt-1">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 h-[44px] text-[14px] font-bold justify-center"
                    >
                      <Navigation className="w-4 h-4 fill-white" />
                      <span>Navigate</span>
                    </a>
                    <a
                      href="tel:+919829011111"
                      className="btn-secondary h-[44px] px-3.5 text-[13px] font-semibold justify-center"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Donor</span>
                    </a>
                  </div>
                </div>

                {/* Dropoff Details Box */}
                <div className="p-4.5 rounded-[18px] bg-[#F6F5F1] border border-[#ECE9E1] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#166534]">
                      🏠 Step 2: Dropoff Location
                    </span>
                    <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[11px] font-bold">
                      2.1 km · ~7 min
                    </span>
                  </div>
                  <span className="font-outfit text-[20px] font-bold text-[#13231C]">
                    Asha Shelter
                  </span>
                  <span className="text-[14px] text-[#5B6661]">
                    Sector 4, Near Community Hall, Malviya Nagar
                  </span>
                  <div className="flex gap-2 pt-1">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex-1 h-[44px] text-[14px] font-semibold justify-center"
                    >
                      <Navigation className="w-4 h-4 text-[#0E3B2E]" />
                      <span>Preview Route</span>
                    </a>
                    <a
                      href="tel:+919829022222"
                      className="btn-secondary h-[44px] px-3.5 text-[13px] font-semibold justify-center"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Shelter</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Food Cargo Integrity & Packing Spec */}
              <div className="bg-[#FFF9F6] border border-[#FAD7C8] rounded-[18px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={APP_IMAGES.dalChawal}
                    alt="Cargo Manifest"
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-xs border border-[#FAD7C8]"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-[#13231C]">
                      Cargo Manifest: 50 meals (Dal-chawal &amp; Roti)
                    </span>
                    <span className="text-[13px] text-[#5B6661]">
                      Insulated hot packaging · Pure Veg · Safe cutoff: 11:00 PM
                    </span>
                  </div>
                </div>
                <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold">
                  ✓ FSSAI Seal Intact
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 COL): Interactive OTP Terminal & Support */}
        <div className="flex flex-col gap-6">
          {/* INTERACTIVE OTP PAD TERMINAL */}
          {!isConfirmed ? (
            <div className="ui-card p-6 flex flex-col gap-5 items-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-outfit text-[20px] font-bold text-[#13231C]">
                  Donor Pickup OTP Verification
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  Ask the donor at Shree Ram Garden for the 4-digit code.
                </span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3].map((idx) => {
                  const digit = otp[idx] || "";
                  const isActive = otp.length === idx;
                  return (
                    <span
                      key={idx}
                      className={`w-14 h-16 rounded-[16px] font-outfit text-[28px] font-bold flex items-center justify-center bg-white transition-all ${
                        digit
                          ? "border-2 border-[#0E3B2E] text-[#13231C] shadow-sm"
                          : isActive
                          ? "border-2 border-[#F2622E] shadow-sm ring-4 ring-[#F2622E]/10"
                          : "border border-[#DCD9D0] text-transparent"
                      }`}
                    >
                      {digit}
                    </span>
                  );
                })}
              </div>

              {/* Numeric Keypad for Touch & Mouse */}
              <div className="grid grid-cols-3 gap-2 w-full bg-[#F1F0EB] p-3 rounded-[20px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleKeyClick(n)}
                    className="h-14 rounded-[14px] bg-white text-[#13231C] font-outfit text-[22px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all"
                  >
                    {n}
                  </button>
                ))}
                <span />
                <button
                  type="button"
                  onClick={() => handleKeyClick("0")}
                  className="h-14 rounded-[14px] bg-white text-[#13231C] font-outfit text-[22px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label="Delete digit"
                  className="h-14 rounded-[14px] bg-white text-[#5B6661] text-[20px] font-bold shadow-2xs hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={otp.length < 4}
                className={`w-full h-14 rounded-[16px] text-[16px] font-bold transition-all flex items-center justify-center gap-2 ${
                  otp.length === 4
                    ? "bg-[#0E3B2E] text-white cursor-pointer hover:bg-[#17553F] shadow-md"
                    : "bg-[#C9D3CE] text-[#4A5752] cursor-not-allowed"
                }`}
              >
                <Check className="w-5 h-5 stroke-[2.8]" />
                <span>Confirm Food Pickup</span>
              </button>
            </div>
          ) : (
            /* CONFIRMED PICKUP SUCCESS STATE */
            <div className="ui-card p-6 flex flex-col gap-4 items-center text-center bg-[#EEF8F1] border-2 border-[#A8E0BA] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <span className="w-16 h-16 rounded-full bg-[#1E9E5A] text-white flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[24px] font-extrabold text-[#0E3B2E]">
                  Pickup Verified &amp; Loaded!
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  50 meals secured. Please proceed to <b>Asha Shelter (2.1 km)</b>. You will request their delivery OTP upon arrival.
                </span>
              </div>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full h-13 justify-center text-[15px] font-bold mt-2"
              >
                <Navigation className="w-4 h-4 fill-white" />
                <span>Start Delivery Navigation</span>
              </a>
            </div>
          )}

          {/* DRIVER SAFETY & GUIDELINES */}
          <div className="ui-card p-6 flex flex-col gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0E3B2E]" />
              <span className="font-outfit text-[17px] font-bold text-[#13231C]">
                Volunteer Safety Checklist
              </span>
            </div>
            <ul className="text-[13px] text-[#5B6661] space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Keep delivery box strapped tightly on motorcycle rack.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Never open meal foil seals in transit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Call emergency dispatch if delayed by traffic.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}