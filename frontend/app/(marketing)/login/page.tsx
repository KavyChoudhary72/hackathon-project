"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Eye,
  EyeOff,
  User,
  UtensilsCrossed,
  FileText,
  AlertCircle,
  Building,
  Check,
  Zap,
  Clock,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS, UserRole } from "@/lib/auth/AuthContext";

function SessionExpiredBanner() {
  const searchParams = useSearchParams();
  const isExpired =
    searchParams?.get("session_expired") === "true" || searchParams?.get("expired") === "true";

  if (!isExpired) return null;

  return (
    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-amber-900 text-[13px] animate-in fade-in">
      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <span className="font-extrabold text-[14px] text-amber-950">
          Security Session Expired (15-min limit)
        </span>
        <span className="text-amber-800">
          Your session reached the maximum 15-minute security lifetime and was securely logged out.
          Please sign in again with your verified credentials or use 1-Click Launch.
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, register, switchRole, role: currentRole, user } = useAuth();

  // Mode: "login" or "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SUPER_ADMIN");

  // Login form state (pre-filled with user's requested Super Admin)
  const [email, setEmail] = useState("kavychoudhary27@gmail.com");
  const [password, setPassword] = useState("Superadmin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regPhone, setRegPhone] = useState("+91-98290-00000");
  const [regFssai, setRegFssai] = useState("FSSAI-122240000099");
  const [regCapacity, setRegCapacity] = useState(150);
  const [regVehicleType, setRegVehicleType] = useState("motorcycle");

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setErrorMessage(null);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === r);
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || "Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: selectedRole,
        organizationName: regOrg,
        phone: regPhone,
        fssaiLicence: selectedRole === "MESS" || selectedRole === "DONOR" ? regFssai : undefined,
        capacityMeals: selectedRole === "SHELTER" ? Number(regCapacity) : undefined,
        vehicleType: selectedRole === "DRIVER" ? regVehicleType : undefined,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Registration failed. Please check your information.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoEnter = async (r: UserRole) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    await switchRole(r);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#0E3B2E] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 34 34" aria-hidden="true">
              <path
                d="M17 30s-11-6.6-11-14.2A6 6 0 0 1 17 12a6 6 0 0 1 11 3.8C28 23.4 17 30 17 30z"
                fill="#F2622E"
              />
              <path d="M16 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#1E9E5A" />
              <path d="M16 12c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5z" fill="#F5B82E" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-[22px] font-extrabold tracking-tight text-[#0E3B2E] leading-tight">
              Food<span className="text-[#1E9E5A]">Link</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6661]">
              Enterprise Surplus Rescue
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[13px] font-semibold text-[#5B6661] hover:text-[#0E3B2E] px-3 py-1.5 transition-colors hidden sm:inline-block"
          >
            ← Back to Home
          </Link>
          <Link
            href="/signup"
            className="text-[13px] font-bold text-[#0E3B2E] bg-white border border-[#DCD9D0] px-4 py-2 rounded-full hover:bg-[#EEEDE6] transition-all shadow-xs"
          >
            Register Stakeholder →
          </Link>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-4xl mx-auto w-full my-6 sm:my-8">
        <div className="bg-white border border-[#ECE9E1] rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-8">
          {/* Header & Subtitle */}
          <div className="flex flex-col gap-2.5 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F7EE] border border-[#BDECD2] text-[12px] font-extrabold text-[#166534] mx-auto shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1E9E5A]" />
              Enterprise Role-Based Access Control (RBAC) · 15-Min Protected Session
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#0E3B2E] tracking-tight">
              {authMode === "login" ? "Welcome Back to FoodLink" : "Create Enterprise Account"}
            </h1>
            <p className="text-[14px] text-[#5B6661] leading-relaxed">
              {authMode === "login"
                ? "Select your operational role below for instant authenticated access or sign in with verified credentials."
                : "Register a verified stakeholder account for your Mess, Shelter, or Logistics Fleet."}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-center p-1 bg-[#F6F5F1] rounded-2xl mx-auto mt-2 border border-[#ECE9E1] shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage(null);
                }}
                className={`px-6 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
                  authMode === "login"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "text-[#5B6661] hover:text-[#0E3B2E]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMessage(null);
                }}
                className={`px-6 py-2 rounded-xl text-[13px] font-extrabold transition-all ${
                  authMode === "register"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "text-[#5B6661] hover:text-[#0E3B2E]"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Session Expired Banner */}
          <Suspense fallback={null}>
            <SessionExpiredBanner />
          </Suspense>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 text-[13px] animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          {/* 4-ROLE CARDS */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#5B6661] px-1">
              Select Stakeholder Persona:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {DEMO_ACCOUNTS.filter((acc) => acc.role !== "DONOR").map((acc) => {
                const isSelected = selectedRole === acc.role;
                return (
                  <div
                    key={acc.role}
                    onClick={() => handleSelectRole(acc.role)}
                    className={`p-4 rounded-[22px] border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-2 border-[#0E3B2E] bg-[#EEF8F1]/70 shadow-sm ring-2 ring-[#0E3B2E]/10"
                        : "border-[#ECE9E1] bg-[#FDFCFB] hover:border-[#0E3B2E] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs ${
                          acc.role === "SUPER_ADMIN"
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : acc.role === "MESS"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            : acc.role === "SHELTER"
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : "bg-purple-100 text-purple-900 border border-purple-200"
                        }`}
                      >
                        {acc.role === "SUPER_ADMIN" && <ShieldAlert className="w-5 h-5" />}
                        {acc.role === "MESS" && <UtensilsCrossed className="w-5 h-5" />}
                        {acc.role === "SHELTER" && <Home className="w-5 h-5" />}
                        {acc.role === "DRIVER" && <Truck className="w-5 h-5" />}
                      </div>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#1E9E5A] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-[#DCD9D0]" />
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

                    {authMode === "login" && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickDemoEnter(acc.role);
                        }}
                        className={`w-full py-2 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-[#0E3B2E] text-white shadow-xs hover:bg-[#154d3d]"
                            : "bg-white border border-[#DCD9D0] text-[#0E3B2E] hover:bg-[#0E3B2E] hover:text-white"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-[#F2622E]" />
                        <span>1-Click Launch</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIGN IN FORM */}
          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 max-w-md mx-auto w-full pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#5B6661]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  required
                  className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5B6661]" />
                    <span>Password</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#5B6661] hover:text-[#0E3B2E] font-semibold flex items-center gap-1"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Show
                      </>
                    )}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 pr-10 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary h-12 text-[15px] font-bold justify-center mt-2 shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating with JWT...</span>
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In as {selectedRole.replace("_", " ")}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT / REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 max-w-lg mx-auto w-full pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#5B6661]" />
                    <span>Full Name / Contact Lead</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#5B6661]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. lead@mess.org"
                    required
                    className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#5B6661]" />
                    <span>Organization / Establishment</span>
                  </label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="e.g. MNIT Hostels / City Shelter"
                    required
                    className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5B6661]" />
                    <span>Create Password</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="h-12 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                  />
                </div>
              </div>

              {/* Role-Specific Custom Inputs */}
              {(selectedRole === "MESS" || selectedRole === "DONOR") && (
                <div className="flex flex-col gap-1.5 bg-[#EEF8F1] p-4 rounded-2xl border border-[#BDECD2]">
                  <label className="text-[13px] font-bold text-[#166534] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1E9E5A]" />
                    <span>FSSAI License / Registration No.</span>
                  </label>
                  <input
                    type="text"
                    value={regFssai}
                    onChange={(e) => setRegFssai(e.target.value)}
                    placeholder="FSSAI-122240000099"
                    required
                    className="h-11 border border-[#BDECD2] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none"
                  />
                  <span className="text-[11px] text-[#5B6661]">
                    Required by food safety regulations for all commercial kitchens and university messes.
                  </span>
                </div>
              )}

              {selectedRole === "SHELTER" && (
                <div className="flex flex-col gap-1.5 bg-[#EBF5FF] p-4 rounded-2xl border border-[#BFDBFE]">
                  <label className="text-[13px] font-bold text-[#1E40AF] flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-[#2563EB]" />
                    <span>Shelter Meal Capacity (Plates per meal)</span>
                  </label>
                  <input
                    type="number"
                    value={regCapacity}
                    onChange={(e) => setRegCapacity(Number(e.target.value))}
                    min={10}
                    max={2000}
                    required
                    className="h-11 border border-[#BFDBFE] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none"
                  />
                  <span className="text-[11px] text-[#5B6661]">
                    Used by the Cascade Match Engine to evaluate surplus batch compatibility.
                  </span>
                </div>
              )}

              {selectedRole === "DRIVER" && (
                <div className="flex flex-col gap-1.5 bg-[#F5F3FF] p-4 rounded-2xl border border-[#DDD6FE]">
                  <label className="text-[13px] font-bold text-[#5B21B6] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#7C3AED]" />
                    <span>Volunteer Vehicle Type</span>
                  </label>
                  <select
                    value={regVehicleType}
                    onChange={(e) => setRegVehicleType(e.target.value)}
                    className="h-11 border border-[#DDD6FE] bg-white rounded-xl px-4 text-[14px] font-semibold text-[#13231C] outline-none"
                  >
                    <option value="motorcycle">Motorcycle / Scooter</option>
                    <option value="e-rickshaw">Electric Cargo Rickshaw</option>
                    <option value="van">Delivery Van / Auto</option>
                    <option value="four-wheeler">Four-Wheeler Car</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary h-12 text-[15px] font-bold justify-center mt-2 shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account & signing JWT...</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register as {selectedRole.replace("_", " ")}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Official Super Admin Credentials Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF6E5] border border-[#FDE3B8] flex items-start gap-3.5 text-[#7A4A06]">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5 text-[13px] flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-[#7A4A06] text-[14px] flex items-center gap-1.5">
                  <span>👑 Official Super Admin Credentials:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#F59E0B] text-white text-[10px] font-extrabold">
                    VERIFIED
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectRole("SUPER_ADMIN");
                    setEmail("kavychoudhary27@gmail.com");
                    setPassword("Superadmin@12345");
                    setAuthMode("login");
                  }}
                  className="text-[11px] font-bold text-[#7A4A06] underline hover:text-[#451A03]"
                >
                  Click to Auto-Fill ↗
                </button>
              </div>

              <div className="bg-white/80 rounded-xl p-2.5 border border-[#FDE3B8] font-mono text-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#451A03]">
                <div>
                  <strong>Email:</strong> <span className="select-all">kavychoudhary27@gmail.com</span>
                </div>
                <div>
                  <strong>Password:</strong> <span className="select-all">Superadmin@12345</span>
                </div>
              </div>

              <div className="text-[12px] text-[#7A4A06]/90 pt-1">
                Other test accounts: <strong>Mess</strong> (<code>mess.mnit@jaipur.ac.in</code> / <code>Mess@12345</code>), <strong>Shelter</strong> (<code>shelter.akshaya@jaipur.org</code> / <code>Shelter@12345</code>), <strong>Driver</strong> (<code>driver.ramesh@logistics.in</code> / <code>Driver@12345</code>).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[12px] text-[#5B6661] py-2">
        FoodLink AI Surplus Rescue Platform • Enterprise JWT Authentication & RBAC Engine • 2026
      </div>
    </div>
  );
}
