"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Home,
  Truck,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  User,
  UtensilsCrossed,
  FileText,
  AlertCircle,
  Building,
  Check,
  ArrowRight,
} from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { register, role: currentRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("MESS");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("+91-98290-00000");
  const [fssaiLicence, setFssaiLicence] = useState("FSSAI-122240000099");
  const [capacityMeals, setCapacityMeals] = useState(120);
  const [vehicleType, setVehicleType] = useState("motorcycle");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register({
        name,
        email,
        password,
        role: selectedRole,
        organizationName: organization,
        phone,
        fssaiLicence: selectedRole === "MESS" || selectedRole === "DONOR" ? fssaiLicence : undefined,
        capacityMeals: selectedRole === "SHELTER" ? Number(capacityMeals) : undefined,
        vehicleType: selectedRole === "DRIVER" ? vehicleType : undefined,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Registration failed. Please check inputs.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during account creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      role: "MESS" as UserRole,
      label: "Mess / Dining",
      sub: "Hostels, Messes, Caterers",
      icon: UtensilsCrossed,
      color: "bg-emerald-100 text-emerald-900 border-emerald-200",
    },
    {
      role: "SHELTER" as UserRole,
      label: "Shelter NGO",
      sub: "Verified Beneficiary Homes",
      icon: Home,
      color: "bg-blue-100 text-blue-900 border-blue-200",
    },
    {
      role: "DRIVER" as UserRole,
      label: "Logistics Driver",
      sub: "Volunteer Dispatch Fleet",
      icon: Truck,
      color: "bg-purple-100 text-purple-900 border-purple-200",
    },
    {
      role: "SUPER_ADMIN" as UserRole,
      label: "Super Admin",
      sub: "Municipal Ops Command",
      icon: ShieldAlert,
      color: "bg-amber-100 text-amber-900 border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex flex-col justify-between p-3.5 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#0E3B2E] flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 34 34" aria-hidden="true">
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
              Stakeholder Onboarding
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[13px] text-[#5B6661] hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="text-[13px] font-bold text-[#0E3B2E] bg-white border border-[#DCD9D0] px-4 py-2 rounded-full hover:bg-[#EEEDE6] transition-all shadow-xs active:scale-[0.98]"
          >
            Sign In →
          </Link>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-2xl mx-auto w-full my-4 sm:my-6">
        <div className="bg-white border border-[#ECE9E1] rounded-[28px] sm:rounded-[32px] p-5 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-6">
          {/* Title & Header */}
          <div className="flex flex-col gap-1.5 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F7EE] border border-[#BDECD2] text-[11px] font-extrabold text-[#166534] mx-auto shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#1E9E5A]" />
              Enterprise Onboarding Portal
            </div>
            <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0E3B2E] tracking-tight">
              Create Stakeholder Account
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#5B6661]">
              Select your role to configure your verified operational workspace.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-[13px]">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          {/* Role Selector Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6661]">
              Step 1: Choose Your Role
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {roleOptions.map((opt) => {
                const isSelected = selectedRole === opt.role;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(opt.role);
                      setErrorMessage(null);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 active:scale-[0.98] ${
                      isSelected
                        ? "border-2 border-[#0E3B2E] bg-[#EEF8F1] shadow-xs"
                        : "border-[#ECE9E1] bg-[#FDFCFB] hover:border-[#0E3B2E]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${opt.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#1E9E5A] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#DCD9D0]" />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#13231C] leading-snug">{opt.label}</div>
                      <div className="text-[10px] text-[#5B6661] truncate">{opt.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#13231C] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#5B6661]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="h-11 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-3.5 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#13231C] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#5B6661]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  required
                  className="h-11 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-3.5 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#13231C] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#5B6661]" />
                  <span>Organization / Facility Name</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Central Mess / Hope Shelter"
                  required
                  className="h-11 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-3.5 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#13231C] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#5B6661]" />
                  <span>Create Password (Min 6 chars)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-11 border border-[#DCD9D0] focus:border-[#0E3B2E] bg-white rounded-xl px-3.5 text-[14px] font-semibold text-[#13231C] outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {(selectedRole === "MESS" || selectedRole === "DONOR") && (
              <div className="p-3.5 rounded-2xl bg-[#EEF8F1] border border-[#BDECD2] flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#166534] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1E9E5A]" />
                  <span>FSSAI License / Registration No.</span>
                </label>
                <input
                  type="text"
                  value={fssaiLicence}
                  onChange={(e) => setFssaiLicence(e.target.value)}
                  placeholder="FSSAI-122240000099"
                  required
                  className="h-10 border border-[#BDECD2] bg-white rounded-xl px-3.5 text-[13px] font-semibold text-[#13231C] outline-none"
                />
                <span className="text-[11px] text-[#5B6661]">
                  Mandatory food safety registration for kitchens and student dining facilities.
                </span>
              </div>
            )}

            {selectedRole === "SHELTER" && (
              <div className="p-3.5 rounded-2xl bg-[#EBF5FF] border border-[#BFDBFE] flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1E40AF] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Shelter Meal Capacity (Max plates per meal)</span>
                </label>
                <input
                  type="number"
                  value={capacityMeals}
                  onChange={(e) => setCapacityMeals(Number(e.target.value))}
                  min={10}
                  max={2000}
                  required
                  className="h-10 border border-[#BFDBFE] bg-white rounded-xl px-3.5 text-[13px] font-semibold text-[#13231C] outline-none"
                />
              </div>
            )}

            {selectedRole === "DRIVER" && (
              <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#5B21B6] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Volunteer Vehicle Type</span>
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="h-10 border border-[#DDD6FE] bg-white rounded-xl px-3 text-[13px] font-semibold text-[#13231C] outline-none"
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
              className="btn-primary h-12 text-[14px] sm:text-[15px] font-bold justify-center mt-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account & Issuing 15-Min JWT Session...</span>
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create {selectedRole.replace("_", " ")} Account</span>
                </>
              )}
            </button>
          </form>

          {/* Security & 15-min Session Guarantee */}
          <div className="text-center text-[11px] text-[#5B6661] pt-1">
            🔒 Sessions are cryptographically protected with HS256 JWT and auto-expire after <strong>15 minutes</strong> of inactivity for maximum data security.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#5B6661] py-2">
        FoodLink • Enterprise Surplus Food Rescue Platform • 2026
      </div>
    </div>
  );
}
