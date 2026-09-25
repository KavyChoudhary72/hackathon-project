"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings2,
  Trophy,
  ArrowLeft,
  Save,
  RotateCcw,
  Sparkles,
  Calculator,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Flame,
  Camera,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiClient } from "@/lib/api/client";
import { PlatformRules } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";

export default function AdminRulesConfiguratorPage() {
  const { locale } = useI18n();
  const { toast } = useToast();
  const isHi = locale === "hi";

  const [rules, setRules] = useState<PlatformRules>({
    pointsPerMeal: 10,
    photoBonus: 25,
    earlyPostBonus: 50,
    streakBonus: 100,
    maxRadiusKm: 20,
    spoilageThresholdMin: 240,
    cascadeTimeoutSec: 30,
    rescueDealDiscountCap: 50,
  });

  const [saving, setSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Interactive Live Point Simulator State
  const [simMeals, setSimMeals] = useState<number>(40);
  const [simHasPhoto, setSimHasPhoto] = useState<boolean>(true);
  const [simIsEarly, setSimIsEarly] = useState<boolean>(true);

  useEffect(() => {
    async function loadRules() {
      try {
        const currentRules = await apiClient.getPlatformRules();
        setRules(currentRules);
      } catch (err) {
        console.error("Failed to load platform rules:", err);
      }
    }
    loadRules();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiClient.updatePlatformRules(rules);
      setRules(updated);
      setHasSaved(true);
      toast({
        type: "success",
        title: "Platform Rules Updated",
        message: "Reward points formula and operational thresholds saved successfully.",
      });
      setTimeout(() => setHasSaved(false), 3000);
    } catch (err) {
      toast({
        type: "error",
        title: "Update Failed",
        message: "Could not save platform rules.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaultVals: PlatformRules = {
      pointsPerMeal: 10,
      photoBonus: 25,
      earlyPostBonus: 50,
      streakBonus: 100,
      maxRadiusKm: 20,
      spoilageThresholdMin: 240,
      cascadeTimeoutSec: 30,
      rescueDealDiscountCap: 50,
    };
    setRules(defaultVals);
    apiClient.updatePlatformRules(defaultVals);
    toast({
      type: "info",
      title: "Reset to System Defaults",
      message: "Standard Jaipur municipal guidelines restored.",
    });
  };

  // Simulator Calculation
  const simBase = simMeals * (rules.pointsPerMeal || 10);
  const simPhoto = simHasPhoto ? (rules.photoBonus || 25) : 0;
  const simEarly = simIsEarly ? (rules.earlyPostBonus || 50) : 0;
  const simTotal = simBase + simPhoto + simEarly;

  return (
    <div className="flex flex-col gap-7 max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-[13px] text-[#5B6661] hover:text-[#0E3B2E] flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHi ? "वापस एडमिन कमांड" : "Back to Admin"}</span>
            </Link>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            {isHi ? "प्लेटफ़ॉर्म नियम एवं रिवॉर्ड विन्यास" : "Platform Rules & Reward Point Config"}
          </h1>
          <span className="text-[15px] text-[#5B6661]">
            {isHi
              ? "सुपर एडमिन अपनी इच्छानुसार सेवा साथी अंक प्रणाली और परिचालन सीमाओं को संशोधित कर सकता है।"
              : "Customize the Seva Sathi rewards formula, bonus multipliers, and dispatch safety thresholds."}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn-secondary h-10 px-3.5 text-[13px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#5B6661]" />
            <span>{isHi ? "डिफ़ॉल्ट रीसेट" : "Reset Defaults"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary h-10 px-5 text-[13px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {hasSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{isHi ? "सहेजा गया!" : "Saved!"}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? (isHi ? "सहेज रहे हैं..." : "Saving...") : (isHi ? "नियम सहेजें" : "Save Changes")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT: RULE CONFIGURATION FORM (LEFT) & LIVE SIMULATOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT FORM (7 of 12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* SECTION 1: REWARD POINT SYSTEM */}
          <div className="ui-card p-6 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#ECE9E1] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#E89B1C]" />
                <h2 className="font-outfit text-[19px] font-bold text-[#13231C]">
                  {isHi ? "सेवा साथी अंक प्रणाली" : "Seva Sathi Reward Formulas"}
                </h2>
              </div>
              <span className="ui-chip bg-[#FFF9EC] text-[#B45309] text-[11px] font-bold">
                {isHi ? "लाइव गणना" : "Live Impact"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Points Per Rescued Meal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1">
                  <span>{isHi ? "प्रति भोजन अंक" : "Points per Rescued Meal"}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rules.pointsPerMeal}
                    onChange={(e) =>
                      setRules({ ...rules, pointsPerMeal: Number(e.target.value) || 1 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px] text-[#0E3B2E]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    pts / meal
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Standard guideline: 10 pts/meal</span>
              </div>

              {/* AI Photo Verification Bonus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1">
                  <span>{isHi ? "AI फोटो सत्यापन बोनस" : "AI Photo Bonus"}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={rules.photoBonus}
                    onChange={(e) =>
                      setRules({ ...rules, photoBonus: Number(e.target.value) || 0 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px] text-[#0E3B2E]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    pts bonus
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">For clear container photo uploads</span>
              </div>

              {/* Early Rescue Window Bonus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1">
                  <span>{isHi ? "प्रारंभिक सूचना बोनस (>2 घंटे)" : "Early Post Bonus (>2 hr)"}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={rules.earlyPostBonus}
                    onChange={(e) =>
                      setRules({ ...rules, earlyPostBonus: Number(e.target.value) || 0 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px] text-[#0E3B2E]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    pts bonus
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Awarded when food posted &gt;120m safe window</span>
              </div>

              {/* 4-Week Streak Bonus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C] flex items-center gap-1">
                  <span>{isHi ? "4-सप्ताह निरंतरता बोनस" : "4-Week Streak Bonus"}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={rules.streakBonus}
                    onChange={(e) =>
                      setRules({ ...rules, streakBonus: Number(e.target.value) || 0 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px] text-[#0E3B2E]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    pts bonus
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">For weekly continuous surplus donation</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: DISPATCH & SAFETY THRESHOLDS */}
          <div className="ui-card p-6 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#ECE9E1] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#1E9E5A]" />
                <h2 className="font-outfit text-[19px] font-bold text-[#13231C]">
                  {isHi ? "परिचालन एवं खाद्य सुरक्षा सीमाएं" : "Dispatch & Safety Thresholds"}
                </h2>
              </div>
              <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[11px] font-bold">
                FSSAI Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Max Rescue Radius */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C]">
                  {isHi ? "अधिकतम बचाव त्रिज्या" : "Max Rescue Travel Radius"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={rules.maxRadiusKm}
                    onChange={(e) =>
                      setRules({ ...rules, maxRadiusKm: Number(e.target.value) || 20 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    km radius
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Hard filter cutoff for Tier 1 matching</span>
              </div>

              {/* Safe Window Spoilage Threshold */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C]">
                  {isHi ? "अधिकतम उपभोग समय सीमा" : "Safe Spoilage Window"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="60"
                    max="480"
                    value={rules.spoilageThresholdMin}
                    onChange={(e) =>
                      setRules({ ...rules, spoilageThresholdMin: Number(e.target.value) || 240 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    minutes
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Cooked food consumption window limit</span>
              </div>

              {/* Cascade Timeout */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C]">
                  {isHi ? "आश्रय ऑटो-कैस्केड टाइमआउट" : "Shelter Cascade Timeout"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={rules.cascadeTimeoutSec}
                    onChange={(e) =>
                      setRules({ ...rules, cascadeTimeoutSec: Number(e.target.value) || 30 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    seconds
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Time before auto-escalating to backup shelter</span>
              </div>

              {/* Tier 2 Rescue Deal Max Discount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#13231C]">
                  {isHi ? "टियर 2 बचाव डील अधिकतम छूट" : "Tier 2 Deal Discount Cap"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={rules.rescueDealDiscountCap}
                    onChange={(e) =>
                      setRules({ ...rules, rescueDealDiscountCap: Number(e.target.value) || 50 })
                    }
                    className="ui-input py-2.5 px-3 font-mono font-bold text-[16px]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#5B6661] font-semibold">
                    % discount
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6661]">Maximum allowed consumer rescue deal price cut</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE POINT SIMULATOR (5 of 12) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="ui-card p-6 bg-gradient-to-b from-[#FFFDF9] to-[#FFF8EE] border-[#F3E6C6] flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sticky top-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#E89B1C]" />
              <h3 className="font-outfit text-[20px] font-bold text-[#0E3B2E]">
                {isHi ? "लाइव अंक सिम्युलेटर" : "Live Points Simulator"}
              </h3>
            </div>
            <span className="text-[13px] text-[#5B6661] leading-snug">
              {isHi
                ? "यह जांचें कि आपके वर्तमान नियमों के आधार पर किसी डिलीवरी पर कितने अंक दिए जाएंगे।"
                : "Verify live point distribution with your configured multipliers before saving."}
            </span>

            {/* SIMULATOR INPUTS */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-[#ECE9E1]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#13231C]">
                  {isHi ? "भोजन संख्या (Meals)" : "Simulated Meals"}
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={simMeals}
                  onChange={(e) => setSimMeals(Number(e.target.value))}
                  className="w-full accent-[#0E3B2E]"
                />
                <div className="flex justify-between text-[12px] font-bold text-[#0E3B2E]">
                  <span>10 meals</span>
                  <span className="bg-[#E3F5EA] px-2 py-0.5 rounded-md">{simMeals} meals</span>
                  <span>200 meals</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#ECE9E1] pt-3 text-[13px]">
                <span className="font-medium text-[#13231C] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#1E9E5A]" />
                  {isHi ? "AI फोटो अपलोड (+बोनस)" : "AI Verified Photo"}
                </span>
                <input
                  type="checkbox"
                  checked={simHasPhoto}
                  onChange={(e) => setSimHasPhoto(e.target.checked)}
                  className="w-4 h-4 accent-[#1E9E5A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#ECE9E1] pt-3 text-[13px]">
                <span className="font-medium text-[#13231C] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E89B1C]" />
                  {isHi ? "प्रारंभिक सूचना >2h (+बोनस)" : "Early Post (>2 hr)"}
                </span>
                <input
                  type="checkbox"
                  checked={simIsEarly}
                  onChange={(e) => setSimIsEarly(e.target.checked)}
                  className="w-4 h-4 accent-[#1E9E5A] cursor-pointer"
                />
              </div>
            </div>

            {/* BREAKDOWN BOX */}
            <div className="flex flex-col gap-2 bg-[#F6F5F1] p-4 rounded-2xl text-[13px]">
              <div className="flex justify-between text-[#5B6661]">
                <span>Base ({simMeals} meals × {rules.pointsPerMeal} pts):</span>
                <span className="font-mono font-bold text-[#13231C]">+{simBase} pts</span>
              </div>
              {simHasPhoto && (
                <div className="flex justify-between text-[#5B6661]">
                  <span>AI Photo Bonus:</span>
                  <span className="font-mono font-bold text-[#1E9E5A]">+{simPhoto} pts</span>
                </div>
              )}
              {simIsEarly && (
                <div className="flex justify-between text-[#5B6661]">
                  <span>Early Post Bonus:</span>
                  <span className="font-mono font-bold text-[#E89B1C]">+{simEarly} pts</span>
                </div>
              )}

              <div className="border-t border-[#ECE9E1] pt-2 mt-1 flex justify-between items-baseline">
                <span className="font-bold text-[#0E3B2E] text-[15px]">Total Reward Points:</span>
                <span className="font-outfit text-[28px] font-extrabold text-[#0E3B2E]">
                  {simTotal} <span className="text-[14px] font-semibold text-[#5B6661]">pts</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary w-full justify-center h-11 text-[14px] font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isHi ? "इस विन्यास को सक्रिय करें" : "Apply & Save Rules"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
