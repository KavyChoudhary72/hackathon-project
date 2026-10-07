"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Utensils,
  Truck,
  ShieldCheck,
  Phone,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  History,
  Building2,
  RefreshCw,
  Info,
} from "lucide-react";
import { APP_IMAGES } from "@/lib/images";
import { useAuth } from "@/lib/auth/AuthContext";

export default function ShelterAppPage() {
  const { user } = useAuth();
  const [capacity, setCapacity] = useState(user?.capacityMeals || 60);
  const [isAccepted, setIsAccepted] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const shelterName = user?.organizationName || (lang === "EN" ? "Akshaya Patra Jaipur" : "अक्षय पात्र जयपुर");

  const handleAccept = () => {
    setIsAccepted(true);
    setCapacity((prev) => Math.max(0, prev - 50));
  };

  const handleDecline = () => {
    setIsAccepted(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* TOP HEADER: Shelter Identity + Live Operational Status + Language Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#ECE9E1] rounded-[24px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <img
            src={APP_IMAGES.ashaShelter}
            alt="Asha Shelter"
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-xs border border-[#CDE8D6]"
          />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0E3B2E] tracking-tight">
                {shelterName}
              </h1>
              <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>{lang === "EN" ? "Open & Accepting" : "खुला है · भोजन स्वीकार्य"}</span>
              </span>
              <span className="ui-chip bg-[#F1F0EB] text-[#5B6661] text-[12px] hidden md:inline-flex">
                FSSAI Reg: RJ-SHELTER-2024
              </span>
            </div>
            <span className="text-[14px] text-[#5B6661] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C2410C]" />
              <span>Sector 4, Malviya Nagar, Jaipur · Capacity: {capacity} meals</span>
            </span>
          </div>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex bg-[#F6F5F1] border border-[#ECE9E1] rounded-full p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`h-[36px] px-4 rounded-full text-[13px] font-bold transition-all ${
                lang === "EN"
                  ? "bg-[#0E3B2E] text-white shadow-xs"
                  : "text-[#2A3A33] hover:text-[#0E3B2E]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("HI")}
              className={`h-[36px] px-4 rounded-full text-[13px] font-bold transition-all ${
                lang === "HI"
                  ? "bg-[#0E3B2E] text-white shadow-xs"
                  : "text-[#2A3A33] hover:text-[#0E3B2E]"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Capacity */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E3F5EA] flex items-center justify-center text-[#1E9E5A] flex-shrink-0">
            <Utensils className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              {lang === "EN" ? "Available Intake" : "उपलब्ध क्षमता"}
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              {capacity} <span className="text-base font-medium text-[#5B6661]">meals</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              {lang === "EN" ? "Broadcasted Live" : "लाइव प्रसारित"}
            </span>
          </div>
        </div>

        {/* Metric 2: Meals Received Tonight */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FDE8DD] flex items-center justify-center text-[#E0531F] flex-shrink-0">
            <Truck className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              {lang === "EN" ? "Received Tonight" : "आज प्राप्त"}
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              {isAccepted ? "80" : "30"} <span className="text-base font-medium text-[#5B6661]">meals</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              {isAccepted ? "2 deliveries" : "1 delivery completed"}
            </span>
          </div>
        </div>

        {/* Metric 3: Response Time */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFF1D1] flex items-center justify-center text-[#E89B1C] flex-shrink-0">
            <Clock className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              {lang === "EN" ? "Avg Accept Time" : "स्वीकृति समय"}
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              42 <span className="text-base font-medium text-[#5B6661]">sec</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              Top 5% in Jaipur
            </span>
          </div>
        </div>

        {/* Metric 4: Compliance / Rating */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E0EAFF] flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              {lang === "EN" ? "Trust & Quality" : "गुणवत्ता स्कोर"}
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              99.2%
            </span>
            <span className="text-[12px] font-semibold text-[#1D4ED8]">
              Verified Partner
            </span>
          </div>
        </div>
      </div>

      {/* MAIN DESKTOP GRID: 2 Columns Left (Inbound Offer & Intake Log) + 1 Column Right (Capacity Controls & WhatsApp Dispatch) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT 2 COLUMNS: Inbound Offer & History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* INBOUND OFFER / ACTIVE DELIVERY DISPATCH */}
          {!isAccepted ? (
            <div className="ui-card p-6 flex flex-col gap-5 border-2 border-[#F2622E] shadow-[0_6px_24px_rgba(242,98,46,0.12)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#F8E3D8]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#F2622E] animate-ping" />
                  <span className="font-outfit text-[20px] font-bold text-[#C2410C]">
                    {lang === "EN" ? "⚡ Live Inbound Food Rescue Offer" : "⚡ नया भोजन बचाव प्रस्ताव"}
                  </span>
                </div>
                <span className="ui-chip bg-[#FDE8DD] text-[#9A3412] font-extrabold text-[13px] h-8 px-3.5">
                  {lang === "EN" ? "Reply window: 0:24" : "समय शेष: 0:24"}
                </span>
              </div>

              {/* Offer Details Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-[#FFF9F6] p-5 rounded-[20px] border border-[#FAD7C8]">
                <div className="flex items-center gap-4">
                  <img
                    src={APP_IMAGES.dalChawal}
                    alt="Food Offer"
                    className="w-20 h-20 rounded-[18px] object-cover flex-shrink-0 shadow-xs border border-[#FAD7C8]"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-outfit text-3xl font-extrabold text-[#13231C]">
                      50 meals
                    </span>
                    <span className="text-[15px] font-semibold text-[#13231C]">
                      Dal-chawal &amp; Fresh Roti · <span className="text-[#166534] font-bold">100% Pure Veg</span>
                    </span>
                    <span className="text-[13px] text-[#5B6661] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E0531F]" />
                      <span>Safe window until <b>11:00 PM tonight</b> (FSSAI Verified)</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 pl-2 sm:pl-0">
                  <span className="text-[13px] font-medium text-[#5B6661]">From Donor:</span>
                  <span className="font-outfit text-[17px] font-bold text-[#0E3B2E]">
                    Shree Ram Marriage Garden
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    JLN Marg, Malviya Nagar
                  </span>
                </div>
              </div>

              {/* Matching Badges */}
              <div className="flex flex-wrap gap-2.5">
                <span className="ui-chip bg-[#F1F0EB] text-[#2A3A33] text-[13px] h-8 px-3">
                  📍 2.1 km distance
                </span>
                <span className="ui-chip bg-[#F1F0EB] text-[#2A3A33] text-[13px] h-8 px-3">
                  🛵 ~12 min driver transit
                </span>
                <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[13px] h-8 px-3">
                  ✓ Fits shelter capacity ({capacity} available)
                </span>
                <span className="ui-chip bg-[#E0EAFF] text-[#1D4ED8] text-[13px] h-8 px-3">
                  ⭐ High-rated banquet donor
                </span>
              </div>

              {/* Actions Button Row */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="btn-primary flex-1 h-[54px] text-[16px] font-bold justify-center shadow-md active:scale-[0.99]"
                >
                  <Check className="w-5 h-5 stroke-[2.8]" />
                  <span>{lang === "EN" ? "Accept 50 Meals Tonight" : "50 भोजन स्वीकार करें"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="btn-secondary sm:w-44 h-[54px] text-[15px] font-semibold justify-center"
                >
                  {lang === "EN" ? "Decline / Pass" : "अस्वीकार करें"}
                </button>
              </div>
            </div>
          ) : (
            /* ACCEPTED STATE: LIVE DELIVERY TRACKER & SECURE OTP */
            <div className="ui-card p-6 flex flex-col gap-5 bg-[#EEF8F1] border-2 border-[#A8E0BA] shadow-[0_6px_24px_rgba(22,101,52,0.1)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#C8E8D2]">
                <span className="text-[17px] font-extrabold text-[#166534] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </span>
                  <span>{lang === "EN" ? "Offer Accepted! 50 Meals En Route" : "प्रस्ताव स्वीकृत! 50 भोजन रास्ते में है"}</span>
                </span>
                <span className="ui-chip bg-[#DCF5E4] text-[#166534] font-bold">
                  Status: Driver Dispatched
                </span>
              </div>

              {/* Delivery Details & OTP Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#0E3B2E] text-white font-outfit text-lg font-bold flex items-center justify-center">
                      RK
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-[#13231C]">
                        Driver Ravi Kumar
                      </span>
                      <span className="text-[13px] text-[#5B6661]">
                        Motorcycle RJ-14-EA-2024 · ★ 4.95
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-[#CDE8D6] flex flex-col gap-1 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#5B6661]">Estimated Arrival:</span>
                      <b className="text-[#13231C]">10:24 PM (~12 mins)</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5B6661]">Donor Source:</span>
                      <b className="text-[#13231C]">Shree Ram Marriage Garden</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5B6661]">Package Count:</span>
                      <b className="text-[#13231C]">50 meal containers (Veg)</b>
                    </div>
                  </div>
                </div>

                {/* Handover OTP Highlight Box */}
                <div className="bg-[#0E3B2E] text-white rounded-[22px] p-6 flex flex-col items-center justify-center text-center gap-2 shadow-lg">
                  <span className="text-[13px] font-medium text-[#C9DDD3] tracking-wide uppercase">
                    {lang === "EN" ? "Delivery Handover OTP" : "डिलीवरी ओटीपी (OTP)"}
                  </span>
                  <span className="font-outfit text-[48px] font-black tracking-[0.25em] leading-none text-[#F6F5F1]">
                    7390
                  </span>
                  <span className="text-[12px] text-[#A2C7B5] max-w-[240px]">
                    {lang === "EN"
                      ? "Share this OTP with driver Ravi only when food boxes are verified."
                      : "भोजन प्राप्त होने के बाद यह ओटीपी ड्राइवर को दें।"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TONIGHT'S INTAKE & PREVIOUS DELIVERIES LOG TABLE */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#0E3B2E]" />
                <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                  {lang === "EN" ? "Tonight's Food Intake Log" : "आज के भोजन वितरण का विवरण"}
                </h2>
              </div>
              <Link
                href="/admin/quality-reports"
                className="text-[13px] font-bold text-[#C2410C] hover:underline"
              >
                {lang === "EN" ? "Report Food Issue →" : "समस्या की रिपोर्ट करें →"}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F5F1] text-[#5B6661] text-[13px] font-semibold">
                    <th className="py-3 px-4 rounded-l-[12px]">Manifest ID</th>
                    <th className="py-3 px-4">Food Description</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Donor Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-[12px]">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EEE8] text-[14px]">
                  {isAccepted && (
                    <tr className="bg-[#F3FAF5]">
                      <td className="py-3.5 px-4 font-bold text-[#0E3B2E]">#DN1025</td>
                      <td className="py-3.5 px-4 font-semibold text-[#13231C]">Dal-chawal &amp; Roti</td>
                      <td className="py-3.5 px-4 font-bold text-[#166534]">50 meals</td>
                      <td className="py-3.5 px-4">Shree Ram Marriage Garden</td>
                      <td className="py-3.5 px-4">
                        <span className="ui-chip bg-[#E0EAFF] text-[#1D4ED8] font-bold">
                          En Route
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5B6661]">ETA 10:24 PM</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">#DN1024</td>
                    <td className="py-3.5 px-4 font-medium">Veg Biryani &amp; Raita</td>
                    <td className="py-3.5 px-4 font-medium">30 meals</td>
                    <td className="py-3.5 px-4">Hotel Clarks Amer</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        Delivered
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">9:15 PM</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">#DN1019</td>
                    <td className="py-3.5 px-4 font-medium">Puri Sabzi &amp; Halwa</td>
                    <td className="py-3.5 px-4 font-medium">40 meals</td>
                    <td className="py-3.5 px-4">Pink City Banquet</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        Delivered
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">Yesterday 8:40 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 COL): Capacity Controller + Guidelines + WhatsApp Dispatch */}
        <div className="flex flex-col gap-6">
          {/* CAPACITY STEPPER CONTROLLER */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <span className="font-outfit text-[18px] font-bold text-[#13231C]">
                {lang === "EN" ? "Update Tonight's Capacity" : "आज की क्षमता सेट करें"}
              </span>
              <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[11px] font-bold">
                Auto-Synced
              </span>
            </div>

            <p className="text-[13px] text-[#5B6661]">
              {lang === "EN"
                ? "How many meals can your kitchen shelter and distribute tonight?"
                : "आज रात आपका आश्रय गृह कितने भोजन ले सकता है?"}
            </p>

            {/* Big Stepper */}
            <div className="flex items-center justify-between bg-[#F6F5F1] p-4 rounded-[20px] border border-[#ECE9E1]">
              <button
                type="button"
                onClick={() => setCapacity(Math.max(0, capacity - 5))}
                aria-label="Fewer meals"
                className="w-14 h-14 rounded-full bg-white text-[28px] font-extrabold text-[#0E3B2E] flex items-center justify-center hover:bg-[#F0EEE8] shadow-xs active:scale-95 transition-all"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <span className="font-outfit text-[56px] font-extrabold text-[#0E3B2E] leading-none">
                  {capacity}
                </span>
                <span className="text-[13px] text-[#5B6661] font-semibold">meals remaining</span>
              </div>

              <button
                type="button"
                onClick={() => setCapacity(capacity + 5)}
                aria-label="More meals"
                className="w-14 h-14 rounded-full bg-white text-[28px] font-extrabold text-[#0E3B2E] flex items-center justify-center hover:bg-[#F0EEE8] shadow-xs active:scale-95 transition-all"
              >
                +
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCapacity(preset)}
                  className="py-2 rounded-xl bg-white border border-[#DCD9D0] text-[12px] font-bold text-[#0E3B2E] hover:bg-[#F6F5F1] transition-all"
                >
                  {preset}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCapacity(0)}
                className="py-2 rounded-xl bg-[#FDEEE6] border border-[#F8DCCC] text-[12px] font-bold text-[#C2410C] hover:bg-[#FAD7C8] transition-all"
              >
                Full (0)
              </button>
            </div>

            <span className="text-[13px] font-semibold text-[#166534] flex items-center gap-1.5 pt-1">
              <Check className="w-4 h-4 stroke-[2.8]" />
              <span>{lang === "EN" ? "Saved live. Donors matched instantly." : "लाइव सुरक्षित। डोनर्स तुरंत मैच होंगे।"}</span>
            </span>
          </div>

          {/* WHATSAPP & SMS DISPATCH INTEGRATION BANNER */}
          <div className="ui-card p-6 bg-[#F0FDF4] border-[#DCFCE7] flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-outfit text-[17px] font-bold text-[#14532D]">
                WhatsApp Rescue Bot Active
              </span>
            </div>
            <p className="text-[13px] text-[#166534] leading-relaxed">
              Offers are also dispatched via WhatsApp to <b>+91-9829022222</b>. Reply <b>HAAN</b> to accept or <b>NAHI</b> to decline from any phone.
            </p>
          </div>

          {/* FSSAI INTAKE SAFETY GUIDELINES */}
          <div className="ui-card p-6 flex flex-col gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0E3B2E]" />
              <span className="font-outfit text-[17px] font-bold text-[#13231C]">
                Food Safety Protocol
              </span>
            </div>
            <ul className="text-[13px] text-[#5B6661] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Verify container seal and hot temperature (&gt; 60°C).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Distribute within the 4-hour safe window.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                <span>Check vegetarian certification label.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}