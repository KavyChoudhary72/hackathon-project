"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mockEngine } from "@/lib/mock/engine";
import { useToast } from "@/components/ui/Toast";
import { RotateCcw, Play, Zap, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const DemoBar: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const handleRoleSwitch = (path: string) => {
    router.push(path);
  };

  const handleReset = () => {
    mockEngine.reset();
    toast({
      type: "info",
      title: "Demo Reset",
      message: "Mock database restored to initial Jaipur seed state.",
    });
    router.refresh();
  };

  const triggerCascadeTimeout = () => {
    const donations = mockEngine.getDonations();
    if (donations.length > 0) {
      mockEngine.declineShelterOffer(donations[0].id, "shelter_hope");
      toast({
        type: "info",
        title: "Cascade Triggered",
        message: "Asha Shelter timed out -> Automatically cascaded to next shelter!",
      });
      router.push(`/donor/donations/${donations[0].id}`);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-900/90 text-white text-xs font-bold shadow-float backdrop-blur-md border border-brand-700 hover:bg-brand-900 transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Demo Controls</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Expanded control panel */}
      {isOpen && (
        <div className="mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-float border border-neutral-200 text-neutral-800 text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="font-extrabold text-brand-900 text-xs uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
              <span>Judge Quick Switcher</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 text-[10px] font-bold">
              Mock Mode ON
            </span>
          </div>

          {/* Quick Role Jump */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-500">
              Switch Persona / Screen:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleRoleSwitch("/donor")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                🏢 Donor Hub
              </button>
              <button
                onClick={() => handleRoleSwitch("/donor/new")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                ⚡ &lt;60s Post
              </button>
              <button
                onClick={() => handleRoleSwitch("/shelter")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                🏠 Shelter View
              </button>
              <button
                onClick={() => handleRoleSwitch("/driver")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                🛵 Driver Mission
              </button>
              <button
                onClick={() => handleRoleSwitch("/admin/impact")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                📊 CSR & Impact
              </button>
              <button
                onClick={() => handleRoleSwitch("/rewards")}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 font-semibold text-left transition-colors"
              >
                🎁 Rewards Hub
              </button>
            </div>
          </div>

          {/* Live Scenarios */}
          <div className="space-y-1.5 pt-1 border-t border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-500">
              Live Edge Scenarios:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={triggerCascadeTimeout}
                className="flex-1 px-2 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Trigger Timeout</span>
              </button>
              <button
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold transition-colors flex items-center justify-center gap-1"
                title="Reset seed data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
