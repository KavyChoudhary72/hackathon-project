"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Building2,
  Home,
  Truck,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Info,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS, UserRole } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole, role: currentRole, user } = useAuth();

  const [email, setEmail] = useState("admin@surplus2shelter.org");
  const [password, setPassword] = useState("Admin@2026");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SUPER_ADMIN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === r);
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleDirectRoleLogin = (r: UserRole) => {
    switchRole(r);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <path
              d="M17 30s-11-6.6-11-14.2A6 6 0 0 1 17 12a6 6 0 0 1 11 3.8C28 23.4 17 30 17 30z"
              fill="#F2622E"
            />
            <path d="M16 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#1E9E5A" />
            <path d="M16 12c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5z" fill="#F5B82E" />
          </svg>
          <span className="font-outfit text-[24px] font-extrabold tracking-tight text-[#0E3B2E]">
            Food<span className="text-[#1E9E5A]">Link</span>
          </span>
        </Link>

        <Link
          href="/donor"
          className="text-[13px] font-bold text-[#0E3B2E] bg-white border border-[#DCD9D0] px-4 py-2 rounded-full hover:bg-[#EEEDE6] transition-all shadow-xs"
        >
          Enter Dashboard Directly →
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl mx-auto w-full my-8">
        <div className="bg-white border border-[#ECE9E1] rounded-[28px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col gap-8">
          {/* Header & Subtitle */}
          <div className="flex flex-col gap-2 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F7EE] border border-[#BDECD2] text-[12px] font-extrabold text-[#166534] mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#1E9E5A]" />
              Role-Based Access Control (RBAC)
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#0E3B2E] tracking-tight">
              Sign in to Surplus2Shelter
            </h1>
            <p className="text-[14px] text-[#5B6661]">
              Select a role below for instant 1-click access during judge evaluation or enter credentials.
            </p>
          </div>

          {/* 1-CLICK ROLE SELECTOR CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedRole === acc.role;
              return (
                <div
                  key={acc.role}
                  onClick={() => handleSelectRole(acc.role)}
                  className={`p-4 rounded-[20px] border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "border-2 border-[#0E3B2E] bg-[#EEF8F1]/70 shadow-sm"
                      : "border-[#ECE9E1] bg-[#FDFCFB] hover:border-[#0E3B2E] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        acc.role === "SUPER_ADMIN"
                          ? "bg-amber-100 text-amber-900"
                          : acc.role === "DONOR"
                          ? "bg-emerald-100 text-emerald-900"
                          : acc.role === "SHELTER"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-purple-100 text-purple-900"
                      }`}
                    >
                      {acc.role === "SUPER_ADMIN" && <ShieldAlert className="w-5 h-5" />}
                      {acc.role === "DONOR" && <Building2 className="w-5 h-5" />}
                      {acc.role === "SHELTER" && <Home className="w-5 h-5" />}
                      {acc.role === "DRIVER" && <Truck className="w-5 h-5" />}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#1E9E5A]" />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-[#13231C]">
                      {acc.badgeLabel}
                    </span>
                    <span className="text-[12px] text-[#5B6661] line-clamp-1">
                      {acc.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectRoleLogin(acc.role);
                    }}
                    className={`w-full py-2 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-[#0E3B2E] text-white shadow-xs"
                        : "bg-white border border-[#DCD9D0] text-[#0E3B2E] hover:bg-[#0E3B2E] hover:text-white"
                    }`}
                  >
                    <span>1-Click Enter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Standard Form Login */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto w-full pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5B6661]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#5B6661]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary h-12 text-[15px] font-bold justify-center mt-2 shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In as {selectedRole.replace("_", " ")}</span>
            </button>
          </form>

          {/* Hackathon Credentials Callout */}
          <div className="p-4 rounded-2xl bg-[#FFF6E5] border border-[#FDE3B8] flex items-start gap-3 text-[#7A4A06]">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-[13px]">
              <span className="font-extrabold text-[#7A4A06]">
                🔑 Hackathon Jury Credentials (Pre-Configured):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[12px]">
                <div>👑 <strong>Super Admin:</strong> <span className="underline">admin@surplus2shelter.org</span> / <span className="underline">Admin@2026</span></div>
                <div>🏨 <strong>Hotel / Mess:</strong> <span className="underline">hotel.clarks@jaipur.com</span> / <span className="underline">Donor@2026</span></div>
                <div>🏠 <strong>Shelter NGO:</strong> <span className="underline">akshaya.patra@jaipur.org</span> / <span className="underline">Shelter@2026</span></div>
                <div>🛵 <strong>Driver Fleet:</strong> <span className="underline">driver.ramesh@logistics.in</span> / <span className="underline">Driver@2026</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[12px] text-[#5B6661]">
        Surplus2Shelter • Real-Time AI Food Rescue Routing • AmiHacks 2026
      </div>
    </div>
  );
}
