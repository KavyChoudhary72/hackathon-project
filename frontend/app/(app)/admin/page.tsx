"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Scale,
  Building2,
  ShieldCheck,
  PackageOpen,
  BarChart3,
  Award,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Eye,
  Settings2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n";
import { apiClient } from "@/lib/api/client";
import { Donation, OrganizationVerification, PlatformRules, ImpactData } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";

export default function SuperAdminCommandCenter() {
  const { user, switchRole } = useAuth();
  const { locale } = useI18n();
  const { toast } = useToast();
  const isHi = locale === "hi";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [verifications, setVerifications] = useState<OrganizationVerification[]>([]);
  const [rules, setRules] = useState<PlatformRules | null>(null);
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [donList, verList, ruleSet, impData] = await Promise.all([
          apiClient.getDonations(),
          apiClient.getVerifications(),
          apiClient.getPlatformRules(),
          apiClient.getImpact(),
        ]);
        setDonations(donList);
        setVerifications(verList);
        setRules(ruleSet);
        setImpact(impData);
      } catch (err) {
        console.error("Failed to load admin overview data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeDonationsCount = donations.filter(
    (d) => d.status === "MATCHED" || d.status === "DRIVER_ASSIGNED" || d.status === "IN_TRANSIT"
  ).length;

  const pendingVerificationsCount = verifications.filter((v) => v.status === "PENDING_REVIEW").length;

  return (
    <div className="flex flex-col gap-7">
      {/* HEADER WITH BADGE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="ui-chip bg-amber-100 text-amber-900 font-extrabold text-[12px] uppercase tracking-wider px-2.5 py-1">
              {isHi ? "सुपर एडमिन कमांड" : "Super Admin Command"}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-[#1E9E5A] font-semibold bg-[#E3F5EA] px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#1E9E5A] animate-pulse" />
              {isHi ? "लाइव जयपुर नेटवर्क" : "Live Jaipur Network"}
            </span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            {isHi ? "शहर संचालन एवं प्रशासन" : "City Operations & Governance"}
          </h1>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            {isHi
              ? "अधिशेष भोजन बचाव, आश्रय सत्यापन, FSSAI विवाद एवं रिवॉर्ड नियमों का केंद्रीय नियंत्रण।"
              : "Central control for rescue operations, shelter verifications, dispute resolution, and reward rules."}
          </span>
        </div>

        {/* QUICK LINK TO ESG */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/impact"
            className="btn-secondary h-10 px-4 text-[13px] font-bold flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-[#1E9E5A]" />
            <span>{isHi ? "ईएसजी प्रभाव लेजर" : "ESG Impact Ledger"}</span>
          </Link>
          <Link
            href="/certificate"
            className="btn-primary h-10 px-4 text-[13px] font-bold flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>{isHi ? "प्रमाण पत्र" : "Certificates"}</span>
          </Link>
        </div>
      </div>

      {/* TOP LIVE KPI TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Rescues */}
        <div className="ui-card p-5 border-l-4 border-l-[#1E9E5A] flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#5B6661] text-[13px] font-medium">
            <span>{isHi ? "सक्रिय बचाव मिशन" : "Active Rescues"}</span>
            <PackageOpen className="w-4 h-4 text-[#1E9E5A]" />
          </div>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C] leading-none">
            {activeDonationsCount}
          </span>
          <span className="text-[12px] text-[#1E9E5A] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHi ? "रीयल-टाइम जीपीएस ट्रैकिंग" : "Real-time route tracked"}
          </span>
        </div>

        {/* Pending Verifications */}
        <div className="ui-card p-5 border-l-4 border-l-[#E89B1C] flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#5B6661] text-[13px] font-medium">
            <span>{isHi ? "लंबित सत्यापन" : "Pending Verifications"}</span>
            <UserCheck className="w-4 h-4 text-[#E89B1C]" />
          </div>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C] leading-none">
            {pendingVerificationsCount}
          </span>
          <Link
            href="/admin/verifications"
            className="text-[12px] text-[#D97706] hover:underline font-semibold flex items-center gap-1"
          >
            {isHi ? "समीक्षा एवं अनुमोदन करें" : "Review & approve"} &rarr;
          </Link>
        </div>

        {/* FSSAI Dispute Queue */}
        <div className="ui-card p-5 border-l-4 border-l-[#DC2626] flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#5B6661] text-[13px] font-medium">
            <span>{isHi ? "FSSAI विवाद कतार" : "Dispute Queue"}</span>
            <Scale className="w-4 h-4 text-[#DC2626]" />
          </div>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C] leading-none">
            1 Open
          </span>
          <Link
            href="/admin/quality-reports"
            className="text-[12px] text-[#DC2626] hover:underline font-semibold flex items-center gap-1"
          >
            {isHi ? "विवाद समाधान देखें" : "Arbitrate report"} &rarr;
          </Link>
        </div>

        {/* Configured Reward Rate */}
        <div className="ui-card p-5 border-l-4 border-l-[#0E3B2E] flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#5B6661] text-[13px] font-medium">
            <span>{isHi ? "सक्रिय रिवॉर्ड दर" : "Active Point Rate"}</span>
            <Settings2 className="w-4 h-4 text-[#0E3B2E]" />
          </div>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C] leading-none">
            {rules?.pointsPerMeal || 10} <span className="text-[16px] font-semibold text-[#5B6661]">pts/meal</span>
          </span>
          <Link
            href="/admin/rules"
            className="text-[12px] text-[#0E3B2E] hover:underline font-semibold flex items-center gap-1"
          >
            {isHi ? "नियम एवं अंक बदलें" : "Configure point rules"} &rarr;
          </Link>
        </div>
      </div>

      {/* "VIEW AS / ROLE SWITCHER" HELPER BANNER (TESTING & SUPPORT) */}
      <div className="ui-card p-5 bg-gradient-to-r from-[#F4F9F6] to-[#EBF6EE] border-[#CDE8D7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-full bg-[#1E9E5A]/15 text-[#0E3B2E] flex items-center justify-center flex-shrink-0 font-bold">
            <Eye className="w-5 h-5 text-[#1E9E5A]" />
          </span>
          <div className="flex flex-col">
            <span className="font-outfit text-[17px] font-bold text-[#0E3B2E]">
              {isHi ? "भूमिका परीक्षण एवं सहायता मोड (View As)" : "Role Testing & Impersonation (View As)"}
            </span>
            <span className="text-[13px] text-[#4A5D54]">
              {isHi
                ? "दाता रसोई, आश्रय इनटेक, या डिलीवरी चालक के दृष्टिकोण का तुरंत परीक्षण करें।"
                : "Test operational workflows as a Donor Kitchen, Shelter Intake Coordinator, or Volunteer Driver."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              switchRole("DONOR");
              toast({ type: "info", title: "Switched to Donor View", message: "Viewing portal as Hotel Clarks Amer." });
            }}
            className="px-3 py-1.5 bg-white border border-[#C2DEC8] hover:border-[#1E9E5A] rounded-xl text-[12px] font-bold text-[#0E3B2E] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E9E5A]" />
            <span>{isHi ? "होटल दाता दृश्य" : "Donor View"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole("SHELTER");
              toast({ type: "info", title: "Switched to Shelter View", message: "Viewing intake as Akshaya Patra Foundation." });
            }}
            className="px-3 py-1.5 bg-white border border-[#C2DEC8] hover:border-[#1E9E5A] rounded-xl text-[12px] font-bold text-[#0E3B2E] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E5A]" />
            <span>{isHi ? "आश्रय इनटेक दृश्य" : "Shelter View"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole("DRIVER");
              toast({ type: "info", title: "Switched to Driver View", message: "Viewing dispatch as Volunteer Green Fleet." });
            }}
            className="px-3 py-1.5 bg-white border border-[#C2DEC8] hover:border-[#1E9E5A] rounded-xl text-[12px] font-bold text-[#0E3B2E] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E9E5A]" />
            <span>{isHi ? "चालक दृश्य" : "Driver View"}</span>
          </button>
        </div>
      </div>

      {/* CORE GOVERNANCE MODULES GRID */}
      <div className="flex flex-col gap-3">
        <h2 className="font-outfit text-[22px] font-bold text-[#13231C]">
          {isHi ? "प्रशासन एवं नियंत्रण मॉड्यूल" : "Super Admin Governance Modules"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Donation & Matching Engine Audit */}
          <Link
            href="/admin/donations"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#E3F5EA] text-[#166534] flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6 text-[#1E9E5A]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "इंजन निर्णय एवं बचाव ऑडिट" : "Rescue & Matching Engine Audit"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "सभी लाइव दानों, एआई स्कोरिंग (दूरी, क्षमता, विश्वसनीयता), और मैच ओवरराइड की जांच करें।"
                    : "Inspect live donations, AI multi-factor matching scores, and manually override shelter assignments."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#1E9E5A] flex items-center gap-1 mt-2">
              {isHi ? "ऑडिट कंसोल खोलें" : "Open Audit Console"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 2. Shelter & Donor Verification */}
          <Link
            href="/admin/verifications"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#FFF9EC] text-[#B45309] flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6 text-[#E89B1C]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "आश्रय एवं दाता सत्यापन" : "Shelter & Donor Verifications"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "FSSAI लाइसेंस, स्वच्छता अनुपालन, दैनिक क्षमता, और संस्थागत पंजीकरण का अनुमोदन या निलंबन करें।"
                    : "Approve, verify, or suspend food donors and shelters based on FSSAI licenses and hygiene checks."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#1E9E5A] flex items-center gap-1 mt-2">
              {isHi ? "सत्यापन हब खोलें" : "Open Verification Hub"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 3. Platform Rules & Point Configurator */}
          <Link
            href="/admin/rules"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center font-bold">
                <Settings2 className="w-6 h-6 text-[#7C3AED]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "प्लेटफ़ॉर्म नियम एवं अंक विन्यास" : "Platform Rules & Reward Config"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "प्रति भोजन अंक, फोटो बोनस, प्रारंभिक पोस्ट बोनस, अधिकतम यात्रा त्रिज्या और समय सीमा बदलें।"
                    : "Adjust reward points per meal, photo bonuses, maximum rescue travel radius, and safe window thresholds."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#7C3AED] flex items-center gap-1 mt-2">
              {isHi ? "नियम विन्यास खोलें" : "Configure Rules"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 4. FSSAI Dispute Resolution */}
          <Link
            href="/admin/quality-reports"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center font-bold">
                <Scale className="w-6 h-6 text-[#DC2626]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "FSSAI गुणवत्ता विवाद कतार" : "FSSAI Dispute Resolution"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "खराब भोजन या तापमान उल्लंघन रिपोर्ट की जांच करें, अंक रद्द करें या अनुपालन जुर्माना लगाएं।"
                    : "Arbitrate spoilage and temperature breach complaints, reverse points, and issue quality notices."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#DC2626] flex items-center gap-1 mt-2">
              {isHi ? "विवाद कतार खोलें" : "Open Dispute Queue"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 5. City Ops & ESG Ledger */}
          <Link
            href="/admin/impact"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#DCF5E4] text-[#166534] flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6 text-[#1E9E5A]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "शहर संचालन एवं ईएसजी लेजर" : "City Ops & ESG Impact Ledger"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "प्रमाणित सीएसआर टैक्स रसीदें, कुल भोजन संख्या, और कार्बन डाइऑक्साइड उत्सर्जन बचत का लाइव लेजर।"
                    : "Verified municipal impact figures, CSR tax audit receipts, and greenhouse emission offsets."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#1E9E5A] flex items-center gap-1 mt-2">
              {isHi ? "लेजर देखें" : "View ESG Ledger"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 6. City Leaderboard & Badges */}
          <Link
            href="/rewards"
            className="ui-card p-6 flex flex-col justify-between gap-4 hover:border-[#1E9E5A] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#FFF9EC] text-[#B45309] flex items-center justify-center font-bold">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-[20px] font-bold text-[#13231C] group-hover:text-[#0E3B2E]">
                  {isHi ? "जयपुर लीडरबोर्ड एवं सम्मान" : "Jaipur Leaderboard & Badges"}
                </span>
                <span className="text-[14px] text-[#5B6661] leading-relaxed">
                  {isHi
                    ? "सर्वश्रेष्ठ प्रदर्शन करने वाले होटल दाताओं, स्वयंसेवकों और बायोगैस भागीदारों की रैंकिंग।"
                    : "Public impact rankings for commercial banquet donors, NGO shelters, and rescue drivers."}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-bold text-[#B45309] flex items-center gap-1 mt-2">
              {isHi ? "लीडरबोर्ड देखें" : "View Leaderboard"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
