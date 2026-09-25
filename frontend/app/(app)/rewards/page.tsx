"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Leaf,
  Moon,
  Lock,
  Star,
  Crown,
  Download,
  Award,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { DonorCertificateModal } from "@/components/donor/DonorCertificateModal";

export default function RewardsPage() {
  const { locale } = useI18n();
  const [isCertOpen, setIsCertOpen] = useState(false);
  const isHi = locale === "hi";

  return (
    <div className="flex flex-col gap-6">
      {/* CERTIFICATE MODAL */}
      <DonorCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        defaultDonorName="Shree Ram Marriage Garden"
      />

      {/* HEADER */}
      <div className="flex flex-col gap-1.5 pt-1">
        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
          {isHi ? "पुरस्कार एवं सम्मान" : "Rewards & Badges"}
        </h1>
        <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
          {isHi
            ? "वास्तव में लोगों तक पहुंचने वाले भोजन पर अंक मिलते हैं। केवल पोस्ट करने पर कभी नहीं।"
            : "Points for food that actually reaches people. Never for just posting."}
        </span>
      </div>

      {/* TOP ROW: Big Level Card & 4 Metrics (1.5fr 1fr on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Level Card (7 of 12 cols) */}
        <div className="lg:col-span-7 ui-card p-6 sm:p-8 bg-[#FFF9EC] border-[#F3E6C6] flex flex-col sm:flex-row items-center gap-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex-1 flex flex-col gap-3.5 w-full">
            <span className="text-[15px] font-medium text-[#5B6661]">
              {isHi ? "आपका स्तर" : "Your level"}
            </span>
            <span className="font-outfit text-4xl sm:text-[44px] font-extrabold text-[#0E3B2E] leading-none">
              {isHi ? "सेवा साथी" : "Seva Sathi"}
            </span>

            <div className="h-3 bg-white rounded-full overflow-hidden w-full">
              <div className="w-[86%] h-full bg-[#0E3B2E] rounded-full" />
            </div>

            <div className="flex justify-between text-[14px]">
              <b className="font-bold text-[#13231C]">860 / 1,000 {isHi ? "अंक" : "points"}</b>
              <span className="text-[#5B6661]">
                {isHi ? "140 अन्न रक्षक के लिए" : "140 to Ann Rakshak"}
              </span>
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
            <span className="text-[13px] text-[#5B6661]">
              {isHi ? "प्रभाव अंक" : "Impact points"}
            </span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              24
            </span>
            <span className="text-[13px] text-[#5B6661]">
              {isHi ? "सफल दान" : "Donations"}
            </span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              1,240
            </span>
            <span className="text-[13px] text-[#5B6661]">
              {isHi ? "बचाया गया भोजन" : "Meals to people"}
            </span>
          </div>

          <div className="bg-[#F6F5F1] rounded-[16px] p-4 flex flex-col gap-0.5">
            <span className="font-outfit text-[26px] font-bold text-[#13231C] leading-tight">
              {isHi ? "3 सप्ताह" : "3 weeks"}
            </span>
            <span className="text-[13px] text-[#5B6661]">
              {isHi ? "सक्रिय लकीर" : "Current streak"}
            </span>
          </div>
        </div>
      </div>

      {/* YOUR JOURNEY CARD */}
      <div className="ui-card p-6 sm:p-8 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
          {isHi ? "आपकी सेवा यात्रा" : "Your journey"}
        </h2>

        <div className="relative pt-2 pb-2">
          <div className="absolute top-[32px] left-[12.5%] right-[12.5%] h-[3px] bg-[#E6E3DC]" />
          <div className="absolute top-[32px] left-[12.5%] w-[30%] h-[3px] bg-[#0E3B2E]" />

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center z-10">
            {/* Level 1 */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-16 h-16 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center font-bold text-[18px] shadow-sm">
                1
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#13231C]">
                {isHi ? "अन्न मित्र" : "Anna Mitra"}
              </span>
              <span className="text-[13px] text-[#166534] font-semibold">
                {isHi ? "पूर्ण" : "Completed"}
              </span>
            </div>

            {/* Level 2 (Active) */}
            <div className="flex flex-col items-center gap-2">
              <span className="w-16 h-16 rounded-full bg-[#E3F5EA] border-[3px] border-[#1E9E5A] text-[#166534] flex items-center justify-center font-bold text-[18px]">
                2
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#13231C]">
                {isHi ? "सेवा साथी" : "Seva Sathi"}
              </span>
              <span className="text-[13px] text-[#0E3B2E] font-bold">
                {isHi ? "सक्रिय (860 अंक)" : "Active (860 pts)"}
              </span>
            </div>

            {/* Level 3 */}
            <div className="flex flex-col items-center gap-2 text-[#8A938F]">
              <span className="w-16 h-16 rounded-full bg-[#EFEDE8] text-[#8A938F] flex items-center justify-center font-bold text-[18px]">
                3
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#8A938F]">
                {isHi ? "अन्न रक्षक" : "Ann Rakshak"}
              </span>
              <span className="text-[13px] text-[#8A938F]">1,000 pts</span>
            </div>

            {/* Level 4 */}
            <div className="flex flex-col items-center gap-2 text-[#8A938F]">
              <span className="w-16 h-16 rounded-full bg-[#EFEDE8] text-[#8A938F] flex items-center justify-center font-bold text-[18px]">
                4
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#8A938F]">
                {isHi ? "जीवन दाता" : "Jeevan Daata"}
              </span>
              <span className="text-[13px] text-[#8A938F]">2,500 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-COLUMN BOTTOM ROW: Rewards, Badges, Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Redeem Rewards */}
        <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
            {isHi ? "अंक भुनाएं" : "Redeem rewards"}
          </h2>

          <div className="flex flex-col gap-3">
            <div className="border border-[#ECE9E1] rounded-[16px] p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#13231C]">
                  {isHi ? "बायोगैस खाद वाउचर" : "Biogas compost voucher"}
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  {isHi ? "500 अंक · 5 किग्रा जैविक खाद" : "500 points · 5 kg organic compost"}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary h-9 px-3.5 text-[13px] cursor-pointer"
              >
                {isHi ? "भुनाएं" : "Redeem"}
              </button>
            </div>

            <div className="border border-[#ECE9E1] rounded-[16px] p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#13231C]">
                  {isHi ? "वृक्षारोपण प्रमाणपत्र" : "Tree plantation in your name"}
                </span>
                <span className="text-[13px] text-[#5B6661]">
                  {isHi ? "750 अंक · जयपुर नगर निगम साझेदारी" : "750 points · JMC green belt"}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary h-9 px-3.5 text-[13px] cursor-pointer"
              >
                {isHi ? "भुनाएं" : "Redeem"}
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Badges (6 grid) */}
        <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
            {isHi ? "बैज एवं पदक" : "Badges"}
          </h2>

          <div className="grid grid-cols-3 gap-3 text-center text-[12px] font-bold text-[#13231C]">
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#E3F5EA] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#1E9E5A]" />
              </span>
              <span>{isHi ? "प्रथम बचाव" : "First rescue"}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#FDE8DD] flex items-center justify-center">
                <Heart className="w-6 h-6 fill-[#F2622E] stroke-none" />
              </span>
              <span>100 meals</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="w-13 h-13 rounded-full bg-[#FFF1D1] flex items-center justify-center">
                <Moon className="w-6 h-6 fill-[#E89B1C] stroke-none" />
              </span>
              <span>{isHi ? "रात्रि रक्षक" : "Night saver"}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>1,000 meals</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>{isHi ? "शून्य अपशिष्ट" : "Zero-waste"}</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[#8A938F]">
              <span className="w-13 h-13 rounded-full bg-[#EFEDE8] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8A938F]" />
              </span>
              <span>{isHi ? "4 सप्ताह लकीर" : "4-week streak"}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Recognition Certificate */}
        <div className="flex flex-col gap-6">
          <div className="ui-card p-6 flex flex-col gap-3 flex-1 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span>{isHi ? "प्रशंसा प्रमाण पत्र" : "Recognition certificate"}</span>
            </h2>
            <span className="text-[14px] text-[#5B6661] leading-relaxed">
              {isHi
                ? "आपके भोजन, बचाए गए किग्रा और स्तर के साथ आधिकारिक जयपुर फूड रेस्क्यू प्रमाण पत्र।"
                : "Your meals, kg diverted and level on one page, ready for your CSR report."}
            </span>
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={() => setIsCertOpen(true)}
                className="btn-primary w-full justify-center text-[14px] cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{isHi ? "प्रमाण पत्र देखें / PDF" : "View / Download certificate"}</span>
              </button>
            </div>
          </div>

          {/* Sponsor Rewards */}
          <div className="ui-card p-6 bg-[#FDEEE6] border-[#F8DCCC] flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <span className="ui-chip bg-white text-[#9A3412] self-start text-[12px] font-bold">
              {isHi ? "शीघ्र आ रहा है" : "Coming soon"}
            </span>
            <span className="font-outfit text-[18px] font-bold text-[#7A2E0E]">
              {isHi ? "ब्रांड प्रायोजक पुरस्कार" : "Sponsor rewards"}
            </span>
            <span className="text-[13px] text-[#7A3A1C] leading-relaxed">
              {isHi
                ? "भागीदार ब्रांडों से वृक्षारोपण और भोजन प्रायोजन।"
                : "Tree planting and meal sponsorships from partner brands."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}