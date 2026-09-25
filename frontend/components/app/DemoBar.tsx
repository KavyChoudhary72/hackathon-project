"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mockEngine } from "@/lib/mock/engine";
import { useToast } from "@/components/ui/Toast";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import {
  RotateCcw,
  Play,
  Zap,
  ChevronUp,
  ChevronDown,
  ShieldAlert,
  Building2,
  Home,
  Truck,
  Sparkles,
} from "lucide-react";

export const DemoBar: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { role: activeRole, switchRole, user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    toast({
      type: "info",
      title: `Switched to ${targetRole.replace("_", " ")}`,
      message: `Now operating as ${user.organizationName || targetRole}`,
    });
  };

  const handleReset = () => {
    mockEngine.reset();
    toast({
      type: "info",
      title: "Demo Reset",
      message: "Database restored to initial Jaipur scenario state.",
    });
    router.refresh();
  };

  const triggerCascadeTimeout = () => {
    const donations = mockEngine.getDonations();
    if (donations.length > 0) {
      mockEngine.declineShelterOffer(donations[0].id, "shelter_hope");
      toast({
        type: "info",
        title: "Cascade Escalated",
        message: "Shelter response timed out -> Automatically cascaded to next ranked shelter!",
      });
      router.push(`/donor/donations/${donations[0].id}`);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3B2E] text-white text-[12px] font-bold shadow-lg backdrop-blur-md border border-[#1E9E5A]/40 hover:bg-[#165543] transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-[#1E9E5A] animate-ping" />
        <span>Judge Quick RBAC Switcher</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Expanded control panel */}
      {isOpen && (
        <div className="mt-2 w-84 bg-white/98 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[#ECE9E1] text-[#13231C] text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E1]">
            <span className="font-extrabold text-[#0E3B2E] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F2622E]" />
              <span>1-Click Persona Simulator</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EEF8F1] text-[#166534] text-[10px] font-extrabold border border-[#BDECD2]">
              Active: {activeRole.replace("_", " ")}
            </span>
          </div>

          {/* 1-Click Role Switcher Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5B6661]">
              Switch Role & Transform Workspace:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect("SUPER_ADMIN")}
                className={`p-2.5 rounded-xl text-left font-bold transition-all flex items-center gap-2 ${
                  activeRole === "SUPER_ADMIN"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-[#F6F5F1] text-[#13231C] hover:bg-[#EEEDE6]"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] truncate leading-tight">Super Admin</span>
                  <span className="text-[9px] opacity-70 truncate">City Ops & Audit</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("DONOR")}
                className={`p-2.5 rounded-xl text-left font-bold transition-all flex items-center gap-2 ${
                  activeRole === "DONOR"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-[#F6F5F1] text-[#13231C] hover:bg-[#EEEDE6]"
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] truncate leading-tight">Hotel Clarks</span>
                  <span className="text-[9px] opacity-70 truncate">Commercial Donor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("SHELTER")}
                className={`p-2.5 rounded-xl text-left font-bold transition-all flex items-center gap-2 ${
                  activeRole === "SHELTER"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-[#F6F5F1] text-[#13231C] hover:bg-[#EEEDE6]"
                }`}
              >
                <Home className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] truncate leading-tight">Akshaya Patra</span>
                  <span className="text-[9px] opacity-70 truncate">Shelter NGO</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("DRIVER")}
                className={`p-2.5 rounded-xl text-left font-bold transition-all flex items-center gap-2 ${
                  activeRole === "DRIVER"
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-[#F6F5F1] text-[#13231C] hover:bg-[#EEEDE6]"
                }`}
              >
                <Truck className="w-4 h-4 text-purple-400" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] truncate leading-tight">Driver Ramesh</span>
                  <span className="text-[9px] opacity-70 truncate">Logistics Fleet</span>
                </div>
              </button>
            </div>
          </div>

          {/* Live Scenarios */}
          <div className="space-y-1.5 pt-2 border-t border-[#ECE9E1]">
            <span className="text-[11px] font-semibold text-[#5B6661]">
              Live Cascade Simulation:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={triggerCascadeTimeout}
                className="flex-1 px-3 py-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Play className="w-3.5 h-3.5 text-[#F2622E]" />
                <span>Simulate Timeout</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-[#F6F5F1] text-[#2A3A33] hover:bg-[#EEEDE6] font-bold transition-colors flex items-center justify-center gap-1 text-[11px]"
                title="Reset scenario data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
