"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, Sparkles, UserCheck, ShieldAlert, Building2, Home, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/AuthContext";

export const AppNavbar: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const { user, role } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-8 bg-surface-base/90 backdrop-blur-md border-b border-neutral-200/60">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <Input
          pill
          leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
          placeholder="Search surplus batches, shelters, or donor kitchens..."
          className="bg-white/90 border-neutral-200 shadow-2xs text-xs sm:text-sm"
        />
      </div>

      {/* Right Utility Group */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-white p-1 rounded-full border border-neutral-200 shadow-2xs text-xs font-bold">
          <button
            onClick={() => setLocale("en")}
            className={`px-2.5 py-0.5 rounded-full transition-colors ${
              locale === "en"
                ? "bg-brand-800 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale("hi")}
            className={`px-2.5 py-0.5 rounded-full transition-colors ${
              locale === "hi"
                ? "bg-brand-800 text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setHasUnread(false)}
          className="relative p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white" />
          )}
        </button>

        {/* Active Auth Role User Chip */}
        <Link
          href="/login"
          className="flex items-center gap-2.5 pl-1 sm:pl-2 p-1.5 rounded-full bg-white/80 hover:bg-white border border-[#ECE9E1] transition-all shadow-xs"
          title="Click to Switch Roles"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#0E3B2E] text-white flex items-center justify-center font-bold text-xs">
            {role === "SUPER_ADMIN" ? "👑" : role === "DONOR" ? "🏨" : role === "SHELTER" ? "🏠" : "🛵"}
          </div>
          <div className="hidden md:flex flex-col text-left pr-2">
            <div className="text-xs font-bold text-[#13231C] flex items-center gap-1">
              <span className="truncate max-w-[140px]">{user.name.split("(")[0]}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E9E5A] flex items-center gap-1">
              <span>{role.replace("_", " ")}</span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
