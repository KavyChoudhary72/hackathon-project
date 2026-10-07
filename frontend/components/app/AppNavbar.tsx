"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Building2,
  Home,
  Truck,
  LogOut,
  UtensilsCrossed,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";

export const AppNavbar: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const { user, role, logout, switchRole, demoAccounts } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case "SUPER_ADMIN":
        return "👑";
      case "MESS":
        return "🍲";
      case "DONOR":
        return "🏨";
      case "SHELTER":
        return "🏠";
      case "DRIVER":
        return "🛵";
      default:
        return "👤";
    }
  };

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
          className="relative p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white" />
          )}
        </button>

        {/* Interactive Active Auth Role User Chip with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-1 sm:pl-2 p-1.5 rounded-full bg-white/90 hover:bg-white border border-[#ECE9E1] transition-all shadow-xs cursor-pointer select-none"
            title="Account & Persona Menu"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#0E3B2E] text-white flex items-center justify-center font-bold text-sm">
              {getRoleIcon(role)}
            </div>
            <div className="hidden md:flex flex-col text-left pr-2">
              <div className="text-xs font-bold text-[#13231C] flex items-center gap-1">
                <span className="truncate max-w-[130px]">{user.name.split("(")[0]}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#1E9E5A] flex items-center gap-1">
                <span>{role.replace("_", " ")}</span>
              </div>
            </div>
          </button>

          {/* User Account Popover Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#ECE9E1] p-3 text-xs space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
              {/* Profile Header */}
              <div className="p-3 bg-[#F6F5F1] rounded-xl border border-[#ECE9E1] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[13px] text-[#0E3B2E] truncate">
                    {user.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7F7EE] text-[#166534] border border-[#BDECD2]">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#1E9E5A]" />
                    JWT Active
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661] truncate">
                  {user.email}
                </span>
                <span className="text-[11px] font-semibold text-[#13231C] truncate pt-0.5">
                  🏢 {user.organizationName}
                </span>
              </div>

              {/* Quick Persona Switcher */}
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B6661] px-1">
                  Switch Persona (1-Click):
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => {
                        switchRole(acc.role);
                        setDropdownOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left font-bold transition-all flex items-center gap-1.5 ${
                        role === acc.role
                          ? "bg-[#0E3B2E] text-white"
                          : "bg-[#F6F5F1] text-[#13231C] hover:bg-[#EEEDE6]"
                      }`}
                    >
                      <span className="text-xs">{getRoleIcon(acc.role)}</span>
                      <span className="text-[11px] truncate">{acc.badgeLabel.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#ECE9E1] pt-2 flex flex-col gap-1">
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full py-2 px-2.5 rounded-xl hover:bg-[#F6F5F1] text-[#0E3B2E] font-bold flex items-center gap-2 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Login / Register Hub</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-2.5 rounded-xl hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
