"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";

export const AppNavbar: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-8 bg-surface-base/90 backdrop-blur-md border-b border-neutral-200/60">
      {/* Search Bar matching reference image */}
      <div className="flex-1 max-w-xl">
        <Input
          pill
          leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
          placeholder="Search donations, shelters, or places..."
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

        {/* User Profile Chip from Reference Images 2 & 4 */}
        <div className="flex items-center gap-3 pl-1 sm:pl-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
              alt="Vikas Mehta"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1">
              <span>Vikas Mehta</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="text-[11px] font-semibold text-brand-700 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span>Community Hero</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
