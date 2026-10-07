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
  Award,
} from "lucide-react";
import { APP_IMAGES } from "@/lib/images";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth/AuthContext";
import { DonorCertificateModal } from "@/components/donor/DonorCertificateModal";

export default function DonorDashboardPage() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const isHi = locale === "hi";
  const donorName = user?.organizationName || user?.name || "Shree Ram Marriage Garden";

  return (
    <div className="flex flex-col gap-6">
      {/* CERTIFICATE MODAL */}
      <DonorCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        defaultDonorName={donorName}
      />

      {/* TOP BAR: Search + Notifications + Profile Chip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <label className="flex-1 max-w-[640px] h-[52px] bg-white border border-[#ECE9E1] rounded-full flex items-center gap-3 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <Search className="w-5 h-5 text-[#5B6661] flex-shrink-0" />
          <input
            type="search"
            placeholder={isHi ? "दान, आश्रय या स्थान खोजें..." : "Search donations, shelters or places"}
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
            <img
              src={user?.avatarUrl || APP_IMAGES.marriageGarden}
              alt={donorName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[#ECE9E1]"
            />
            <div className="flex flex-col pr-2 text-left">
              <span className="text-[14px] font-bold text-[#13231C] leading-snug truncate max-w-[200px]">
                {donorName}
              </span>
              <span className="text-[12px] font-medium text-[#5B6661]">
                {isHi ? "सत्यापित दाता" : "Verified Stakeholder"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER: Good evening + Welcome back + Post button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <span className="text-[16px] font-medium text-[#5B6661]">
            {isHi ? "शुभ संध्या 👋" : "Good evening"}
          </span>
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            {isHi ? "स्वागत है, " : "Welcome back, "}
            <span className="text-[#F2622E]">{donorName.split(" ")[0]}.</span>
          </h1>
          <span className="text-[15px] font-medium text-[#5B6661]">
            {isHi
              ? "आपके भोजन दान ने इस महीने 3 आश्रयों तक सहायता पहुंचाई है।"
              : "Your donations reached 3 shelters this month."}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCertOpen(true)}
            className="inline-flex items-center justify-center gap-2 h-[50px] px-5 rounded-[16px] bg-[#E3F5EA] hover:bg-[#D1F0DC] text-[#0E3B2E] font-bold text-[14px] shadow-sm transition-all flex-shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <Award className="w-5 h-5 text-[#1E9E5A]" />
            <span>{isHi ? "प्रमाण पत्र देखें" : "View Certificate"}</span>
          </button>

          <Link
            href="/donor/new"
            prefetch={true}
            className="inline-flex items-center justify-center gap-2.5 h-[50px] px-6 rounded-[16px] bg-[#0E3B2E] hover:bg-[#17553F] text-white font-semibold text-[15px] shadow-sm transition-all flex-shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{isHi ? "अधिशेष भोजन पोस्ट करें" : "Post surplus food"}</span>
          </Link>
        </div>
      </div>

      {/* MAIN LAYOUT: Left 2 Cols (Metrics + Current + Table) & Right 1 Col (Level + Actions + Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 3 METRIC CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Meals Rescued */}
            <div className="ui-card p-5 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <span className="text-[14px] font-semibold text-[#5B6661]">
                {isHi ? "बचाया गया भोजन" : "Meals rescued"}
              </span>
              <span className="font-outfit text-[32px] sm:text-[36px] font-bold text-[#13231C] leading-none">
                1,240
              </span>
              <div className="flex items-center gap-1.5 text-[13px] text-[#166534] font-semibold mt-1">
                <span>↑ 18%</span>
                <span className="text-[#5B6661] font-normal">
                  {isHi ? "पिछले माह से" : "vs last month"}
                </span>
              </div>
            </div>

            {/* Card 2: Shelters Fed */}
            <div className="ui-card p-5 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <span className="text-[14px] font-semibold text-[#5B6661]">
                {isHi ? "आश्रय सहायतित" : "Shelters fed"}
              </span>
              <span className="font-outfit text-[32px] sm:text-[36px] font-bold text-[#13231C] leading-none">
                3
              </span>
              <span className="text-[13px] text-[#5B6661] mt-1">
                {isHi ? "आशा, सेवा घर, बाल संबल" : "Asha, Seva Ghar, Bal Sambhal"}
              </span>
            </div>

            {/* Card 3: Impact Points */}
            <div className="ui-card p-5 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <span className="text-[14px] font-semibold text-[#5B6661]">
                {isHi ? "प्रभाव अंक" : "Impact points"}
              </span>
              <span className="font-outfit text-[32px] sm:text-[36px] font-bold text-[#13231C] leading-none">
                860
              </span>
              <div className="flex items-center gap-1.5 text-[13px] text-[#C2410C] font-semibold mt-1">
                <span>⭐</span>
                <span>{isHi ? "140 अन्न रक्षक बनने के लिए" : "140 to Ann Rakshak"}</span>
              </div>
            </div>
          </div>

          {/* CURRENT DONATION IN PROGRESS (Full Card) */}
          <div className="ui-card p-6 flex flex-col gap-5 border-l-4 border-l-[#1E9E5A] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E5A] animate-pulse" />
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#166534]">
                  {isHi ? "वर्तमान दान प्रगति में" : "Current donation · in progress"}
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#5B6661]">#DN1025</span>
            </div>

            {/* 4-Step Visual Stepper */}
            <div className="relative pt-2 pb-1">
              <div className="absolute top-[22px] left-[12.5%] right-[12.5%] h-[2px] bg-[#E6E3DC]" />
              <div className="absolute top-[22px] left-[12.5%] w-[50%] h-[2px] bg-[#0E3B2E]" />

              <div className="relative grid grid-cols-4 text-center z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    {isHi ? "पोस्ट किया · 10:02 PM" : "Posted · 10:02 PM"}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    {isHi ? "मिलान हुआ · 10:03 PM" : "Matched · 10:03 PM"}
                  </span>
                </div>

                {/* Step 3 (Active) */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#E3F5EA] border-[3px] border-[#1E9E5A] text-[#166534] flex items-center justify-center">
                    <Truck className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className="text-[13px] font-bold text-[#13231C]">
                    {isHi ? "पिकअप जारी" : "Picking up"}
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#F1F0EB] text-[#5B6661] flex items-center justify-center">
                    <Flag className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className="text-[13px] text-[#5B6661]">
                    {isHi ? "वितरित" : "Delivered"}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Banner Box */}
            <div className="bg-[#F6F5F1] rounded-[18px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#13231C]">
                  {isHi ? "दाल-चावल · 50 भोजन" : "Dal-chawal · 50 meals"}
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  {isHi ? "सुरक्षित उपभोग: 11:00 PM तक" : "Safe until 11:00 PM"}
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
                  {isHi ? "रवि, 8 मिनट में आगमन" : "Ravi, arriving in 8 min"}
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  {isHi ? "पिकअप ओटीपी " : "Pickup OTP "}
                  <b className="text-[#13231C] tracking-[0.1em] font-bold">
                    4821
                  </b>
                </span>
              </div>

              <Link
                href="/donor/donations/1025"
                prefetch={true}
                className="btn-primary h-[46px] px-5 text-[14px]"
              >
                {isHi ? "लाइव ट्रैक करें" : "Track live"}
              </Link>
            </div>
          </div>

          {/* RECENT DONATIONS TABLE */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
                {isHi ? "हाल के दान" : "Recent donations"}
              </h2>
              <Link
                href="/donor/donations/1025"
                prefetch={true}
                className="text-[14px] font-semibold text-[#0E3B2E] underline hover:text-[#C2410C]"
              >
                {isHi ? "सभी देखें" : "See all"}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F5F1] text-[#5B6661] text-[13px] font-semibold">
                    <th className="py-3 px-4 rounded-l-[12px]">ID</th>
                    <th className="py-3 px-4">{isHi ? "भोजन" : "Food"}</th>
                    <th className="py-3 px-4">{isHi ? "मात्रा" : "Quantity"}</th>
                    <th className="py-3 px-4">{isHi ? "गंतव्य" : "Went to"}</th>
                    <th className="py-3 px-4">{isHi ? "स्थिति" : "Status"}</th>
                    <th className="py-3 px-4 rounded-r-[12px]">{isHi ? "तारीख" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EEE8] text-[14px]">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1024
                    </td>
                    <td className="py-3.5 px-4 font-medium">{isHi ? "वेज बिरयानी" : "Veg biryani"}</td>
                    <td className="py-3.5 px-4 font-medium">{isHi ? "30 भोजन" : "30 meals"}</td>
                    <td className="py-3.5 px-4">Seva Ghar</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        {isHi ? "वितरित" : "Delivered"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">20 Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1023
                    </td>
                    <td className="py-3.5 px-4 font-medium">{isHi ? "ब्रेड एवं बन" : "Bread & buns"}</td>
                    <td className="py-3.5 px-4 font-medium">{isHi ? "20 पैकेट" : "20 packs"}</td>
                    <td className="py-3.5 px-4">Care Centre</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#DCF5E4] text-[#166534]">
                        {isHi ? "वितरित" : "Delivered"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">18 Sep 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#13231C]">
                      #DN1022
                    </td>
                    <td className="py-3.5 px-4 font-medium">{isHi ? "चावल एवं दाल" : "Rice & dal"}</td>
                    <td className="py-3.5 px-4 font-medium">10 kg</td>
                    <td className="py-3.5 px-4">{isHi ? "रेस्क्यू डील" : "Rescue deal"}</td>
                    <td className="py-3.5 px-4">
                      <span className="ui-chip bg-[#FFF1D1] text-[#8A5A0B]">
                        {isHi ? "एकत्रित" : "Collected"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6661]">15 Sep 2026</td>
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
                  {isHi ? "आपका स्तर" : "Your level"}
                </span>
                <span className="font-outfit text-[26px] font-extrabold text-[#0E3B2E]">
                  {isHi ? "सेवा साथी" : "Seva Sathi"}
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
              <span className="text-[#5B6661]">
                {isHi ? "140 अन्न रक्षक के लिए" : "140 to Ann Rakshak"}
              </span>
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

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setIsCertOpen(true)}
                className="btn-primary justify-center text-[13px] py-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{isHi ? "प्रमाण पत्र" : "Certificate"}</span>
              </button>
              <Link
                href="/rewards"
                prefetch={true}
                className="btn-secondary justify-center bg-white text-[13px] py-2"
              >
                {isHi ? "पुरस्कार" : "Rewards"}
              </Link>
            </div>
          </div>

          {/* Quick Actions 2x2 Grid */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              {isHi ? "त्वरित कार्य" : "Quick actions"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/donor/new"
                prefetch={true}
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </span>
                <span>{isHi ? "भोजन पोस्ट" : "Post food"}</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCertOpen(true)}
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Award className="w-7 h-7 text-[#1E9E5A]" />
                <span>{isHi ? "प्रमाण पत्र" : "Certificate"}</span>
              </button>

              <Link
                href="/shelter"
                prefetch={true}
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <MapPin className="w-7 h-7 text-[#0E3B2E]" />
                <span>{isHi ? "निकटतम शेल्टर" : "Nearby shelters"}</span>
              </Link>

              <Link
                href="/admin/impact"
                prefetch={true}
                className="border border-[#ECE9E1] rounded-[16px] p-4 flex flex-col items-center gap-2.5 text-[13px] font-semibold text-center hover:bg-neutral-50 transition-colors"
              >
                <FileText className="w-7 h-7 text-[#0E3B2E]" />
                <span>{isHi ? "प्रभाव रिपोर्ट" : "Impact report"}</span>
              </Link>
            </div>
          </div>

          {/* Promo Card: Small donations add up */}
          <div className="ui-card p-6 bg-[#FDEEE6] border-[#F8DCCC] flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <span className="font-outfit text-[19px] font-bold text-[#7A2E0E]">
              {isHi ? "छोटे दान, बड़ा बदलाव" : "Small donations add up"}
            </span>
            <span className="text-[14px] leading-relaxed text-[#7A3A1C]">
              {isHi
                ? "केवल 10 भोजन भी आश्रय के शाम के समय का सहारा बनते हैं। जो बचे उसे दान करें।"
                : "Even 10 meals feed a shelter's evening shift. Post whatever is left."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
