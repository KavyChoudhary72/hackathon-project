"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  PackageOpen,
  Trophy,
  BarChart3,
  Building2,
  Truck,
  Tag,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Sliders,
  Scale,
  Sparkles,
  ArrowLeftRight,
  UserCheck,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();
  const { locale, t } = useI18n();

  // Role-Specific Navigation Links with full Bilingual (EN/HI) Support
  const getNavLinks = () => {
    const isHi = locale === "hi";

    if (role === "DONOR") {
      return [
        {
          href: "/donor",
          label: isHi ? "रसोई डैशबोर्ड" : "Kitchen Dashboard",
          icon: LayoutDashboard,
          active: pathname === "/donor",
        },
        {
          href: "/donor/new",
          label: isHi ? "अधिशेष भोजन पोस्ट करें" : "Post Surplus (<30s)",
          icon: PlusCircle,
          active: pathname === "/donor/new",
          highlight: true,
        },
        {
          href: "/donor/donations/1025",
          label: isHi ? "सक्रिय दान एवं ओटीपी" : "Active Donations & OTP",
          icon: PackageOpen,
          active: pathname.startsWith("/donor/donations"),
        },
        {
          href: "/certificate",
          label: isHi ? "प्रशंसा प्रमाण पत्र" : "Official Certificate",
          icon: Award,
          active: pathname === "/certificate",
          highlight: true,
        },
        {
          href: "/admin/impact",
          label: isHi ? "सीएसआर एवं प्रभाव रिपोर्ट" : "CSR Tax Receipts",
          icon: BarChart3,
          active: pathname.startsWith("/admin/impact"),
        },
        {
          href: "/rewards",
          label: isHi ? "सेवा साथी पुरस्कार" : "Seva Sathi Rewards",
          icon: Trophy,
          active: pathname === "/rewards",
        },
      ];
    }

    if (role === "SHELTER") {
      return [
        {
          href: "/shelter",
          label: isHi ? "आश्रय इनटेक एवं प्रस्ताव" : "Shelter Intake & Offers",
          icon: Building2,
          active: pathname === "/shelter",
          highlight: true,
        },
        {
          href: "/admin/quality-reports",
          label: isHi ? "FSSAI गुणवत्ता रिपोर्ट" : "FSSAI Spoilage Reports",
          icon: Scale,
          active: pathname === "/admin/quality-reports",
        },
        {
          href: "/admin/impact",
          label: isHi ? "भोजन प्रभाव लेजर" : "Meal Impact Ledger",
          icon: BarChart3,
          active: pathname.startsWith("/admin/impact"),
        },
        {
          href: "/certificate",
          label: isHi ? "प्रशंसा प्रमाण पत्र" : "Official Certificate",
          icon: Award,
          active: pathname === "/certificate",
        },
        {
          href: "/rewards",
          label: isHi ? "पुरस्कार एवं बैज" : "Rewards & Badges",
          icon: Trophy,
          active: pathname === "/rewards",
        },
      ];
    }

    if (role === "DRIVER") {
      return [
        {
          href: "/driver",
          label: isHi ? "बचाव मिशन एवं ओटीपी" : "Rescue Missions & OTP",
          icon: Truck,
          active: pathname === "/driver",
          highlight: true,
        },
        {
          href: "/rewards",
          label: isHi ? "स्वयंसेवक अंक" : "Volunteer Points",
          icon: Trophy,
          active: pathname === "/rewards",
        },
        {
          href: "/admin/impact",
          label: isHi ? "शहर बचाव प्रभाव" : "City Rescue Impact",
          icon: BarChart3,
          active: pathname.startsWith("/admin/impact"),
        },
      ];
    }

    // SUPER_ADMIN (Dedicated Governance & Audit Command Center)
    return [
      {
        href: "/admin",
        label: isHi ? "एडमिन कमांड सेंटर" : "Admin Command Center",
        icon: LayoutDashboard,
        active: pathname === "/admin",
        highlight: true,
      },
      {
        href: "/admin/donations",
        label: isHi ? "इंजन निर्णय एवं ऑडिट" : "Rescue & Engine Audit",
        icon: Sliders,
        active: pathname === "/admin/donations",
      },
      {
        href: "/admin/verifications",
        label: isHi ? "दाता एवं आश्रय सत्यापन" : "Partner Verifications",
        icon: UserCheck,
        active: pathname === "/admin/verifications",
      },
      {
        href: "/admin/quality-reports",
        label: isHi ? "FSSAI विवाद कतार" : "FSSAI Dispute Queue",
        icon: Scale,
        active: pathname === "/admin/quality-reports",
      },
      {
        href: "/admin/rules",
        label: isHi ? "नियम एवं रिवॉर्ड विन्यास" : "Rules & Point Config",
        icon: Trophy,
        active: pathname === "/admin/rules",
      },
      {
        href: "/admin/impact",
        label: isHi ? "शहर संचालन एवं ईएसजी" : "City Ops & ESG Ledger",
        icon: BarChart3,
        active: pathname === "/admin/impact",
      },
      {
        href: "/certificate",
        label: isHi ? "प्रमाण पत्र जनरेटर" : "Certificate Hub",
        icon: Award,
        active: pathname === "/certificate",
      },
      {
        href: "/rewards",
        label: isHi ? "लीडरबोर्ड एवं बैज" : "Leaderboard & Badges",
        icon: Trophy,
        active: pathname === "/rewards",
      },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 min-h-[920px] bg-white border border-[#ECE9E1] rounded-[28px] p-[24px_16px_20px] flex-shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sticky top-6 self-start">
        <div className="flex flex-col gap-5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2.5 select-none">
            <svg width="32" height="32" viewBox="0 0 34 34" aria-hidden="true" className="flex-shrink-0">
              <path d="M17 30s-11-6.6-11-14.2A6 6 0 0 1 17 12a6 6 0 0 1 11 3.8C28 23.4 17 30 17 30z" fill="#F2622E" />
              <path d="M16 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#1E9E5A" />
              <path d="M16 12c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5z" fill="#F5B82E" />
            </svg>
            <span className="font-outfit text-[23px] font-extrabold tracking-tight text-[#0E3B2E]">
              Food<span className="text-[#1E9E5A]">Link</span>
            </span>
          </Link>

          {/* Active Role Card Pill */}
          <div
            className={`p-3 rounded-[16px] border flex flex-col gap-1 text-left ${
              role === "SUPER_ADMIN"
                ? "bg-amber-50/80 border-amber-200/80 text-amber-950"
                : role === "DONOR"
                ? "bg-emerald-50/80 border-emerald-200/80 text-emerald-950"
                : role === "SHELTER"
                ? "bg-blue-50/80 border-blue-200/80 text-blue-950"
                : "bg-purple-50/80 border-purple-200/80 text-purple-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white shadow-2xs">
                {role === "SUPER_ADMIN"
                  ? "👑 Super Admin"
                  : role === "DONOR"
                  ? (locale === "hi" ? "🏨 होटल / मेस" : "🏨 Hotel / Mess")
                  : role === "SHELTER"
                  ? (locale === "hi" ? "🏠 आश्रय एनजीओ" : "🏠 Shelter NGO")
                  : (locale === "hi" ? "🛵 चालक बेड़ा" : "🛵 Driver Fleet")}
              </span>
              <Link
                href="/login"
                className="text-[11px] font-bold text-[#0E3B2E] hover:underline flex items-center gap-1"
                title="Switch Profile"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>{locale === "hi" ? "बदलें" : "Switch"}</span>
              </Link>
            </div>
            <span className="text-[13px] font-extrabold truncate mt-0.5">
              {user.organizationName}
            </span>
            <span className="text-[11px] opacity-75 truncate">
              {user.name}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center gap-3 h-[46px] px-3.5 rounded-[14px] text-[14px] font-semibold transition-all ${
                    item.active
                      ? "bg-[#0E3B2E] text-white shadow-sm"
                      : "text-[#2A3A33] hover:text-[#0E3B2E] hover:bg-[#F6F5F1]"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 stroke-[2.2]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Footer Links */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[#ECE9E1]/80 mt-4">
          <div className="flex flex-col gap-1 px-2 text-[13px] font-medium text-[#2A3A33]">
            <Link
              href="/login"
              prefetch={true}
              className="h-8 flex items-center gap-2 hover:text-[#0E3B2E] transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{locale === "hi" ? "भूमिका स्विचर पोर्टल" : "Role Switcher Portal"}</span>
            </Link>
            <button
              onClick={logout}
              className="h-8 flex items-center gap-2 hover:text-rose-700 text-left transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{locale === "hi" ? "लॉग आउट" : "Log out"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE9E1] px-2 py-2 flex items-center justify-around">
        {navLinks.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
                item.active ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[56px]">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
