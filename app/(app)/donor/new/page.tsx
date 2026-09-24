"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import { Switch } from "@/components/ui/Switch";
import { VegBadge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api/client";
import { FoodCategory } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";

export default function NewDonationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();

  // Stopwatch timer proving <60s target
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("COOKED_MEALS");
  const [quantity, setQuantity] = useState(30);
  const [unit, setUnit] = useState<"meals" | "kg">("meals");
  const [isVeg, setIsVeg] = useState(true);
  const [pickupAddress, setPickupAddress] = useState(
    "ITC Rajputana, Station Road, Jaipur"
  );
  const [safeUntilHours, setSafeUntilHours] = useState(4);
  const [attestationChecked, setAttestationChecked] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Chips
  const quickDishes = [
    "Dal Baati & Churma",
    "Paneer Butter Masala",
    "Assorted Rice & Roti",
    "Fresh Bakery Buns",
    "Seasonal Mixed Fruits",
  ];

  // AI photo mock parser
  const handleAiPhotoDrop = () => {
    setFoodName("Royal Banquet Paneer & Dal Baati");
    setCategory("COOKED_MEALS");
    setQuantity(45);
    setUnit("meals");
    setIsVeg(true);
    setSafeUntilHours(4);
    setAiApplied(true);
    toast({
      type: "info",
      title: "AI Analysis Complete",
      message: "Detected cooked vegetarian surplus dishes. Please review details.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      toast({
        type: "error",
        title: "Missing Dish Name",
        message: "Please enter or select what food you are donating.",
      });
      return;
    }
    if (!attestationChecked) {
      toast({
        type: "error",
        title: "Food Safety Attestation",
        message: "Please check the hygiene and safety attestation checkbox.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newDonation = await apiClient.createDonation({
        foodName,
        category,
        quantity,
        unit,
        isVeg,
        pickupAddress,
        safeUntil: new Date(
          Date.now() + safeUntilHours * 3600 * 1000
        ).toISOString(),
      });

      toast({
        type: "success",
        title: "Donation Published!",
        message: `Matched to nearby shelters in ${secondsElapsed} seconds.`,
      });

      router.push(`/donor/donations/${newDonation.id}`);
    } catch (err) {
      toast({
        type: "error",
        title: "Error publishing",
        message: "Please check your network and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar with Demo Stopwatch Timer */}
      <div className="flex items-center justify-between">
        <Link
          href="/donor"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-brand-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* 60s Target Live Stopwatch */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-900 shadow-2xs">
          <Clock className="w-4 h-4 text-accent-500 animate-spin" />
          <span>
            {t("newPost.timerLabel", "Post Timer")}:{" "}
            <span
              className={
                secondsElapsed > 60 ? "text-red-600 font-black" : "text-emerald-700 font-black"
              }
            >
              {secondsElapsed}s
            </span>{" "}
            / 60s
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-800 tracking-tight">
          {t("newPost.title", "Post Surplus Food")}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {t("newPost.subtitle", "Target: Broadcast your surplus in under 60 seconds")}
        </p>
      </div>

      {/* AI Photo Autofill Dropzone */}
      <div
        onClick={handleAiPhotoDrop}
        className="p-4 rounded-3xl bg-brand-50/60 border-2 border-dashed border-brand-300 hover:border-brand-600 transition-all cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-accent-500 group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-900 flex items-center gap-1">
              <span>{t("newPost.aiDropzone", "Instant AI Photo Autofill")}</span>
              <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
            </h4>
            <p className="text-[11px] text-neutral-500">
              Click or drop dish photo to autofill quantity, veg type & category
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-brand-800 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-2xs group-hover:bg-brand-800 group-hover:text-white transition-colors">
          Auto-Fill
        </span>
      </div>

      {/* AI Banner Notice if applied */}
      {aiApplied && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {t("newPost.aiNotice", "✨ AI suggestion applied. Please review before publishing.")}
          </span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="lg" className="space-y-5">
          {/* Dish Name */}
          <div className="space-y-2">
            <Input
              label={t("newPost.foodType", "Food Name / Dish")}
              placeholder={t("newPost.foodPlaceholder", "e.g. Dal Baati & Paneer Sabzi")}
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className={aiApplied ? "border-amber-400 bg-amber-50/20" : ""}
            />

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickDishes.map((dish) => (
                <button
                  type="button"
                  key={dish}
                  onClick={() => setFoodName(dish)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-brand-50 hover:text-brand-800 text-[11px] font-medium text-neutral-700 transition-colors"
                >
                  + {dish}
                </button>
              ))}
            </div>
          </div>

          {/* Category Segmented Control */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-neutral-800">
              {t("newPost.category", "Category")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: "COOKED_MEALS", label: "Cooked Meals" },
                  { id: "RAW_PRODUCE", label: "Raw Produce" },
                  { id: "BAKERY", label: "Bakery / Bread" },
                  { id: "DAIRY", label: "Dairy / Milk" },
                ] as const
              ).map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                    category === cat.id
                      ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                      : "bg-surface-subtle text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Unit Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800">
                {t("newPost.quantity", "Quantity")}
              </label>
              <div>
                <Stepper
                  value={quantity}
                  onChange={setQuantity}
                  min={5}
                  max={500}
                  step={5}
                  unit={unit}
                  size="lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Unit
              </label>
              <div className="flex bg-surface-subtle p-1 rounded-2xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setUnit("meals")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                    unit === "meals"
                      ? "bg-white text-brand-800 shadow-2xs"
                      : "text-neutral-500"
                  }`}
                >
                  Meals (Plates)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("kg")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                    unit === "kg"
                      ? "bg-white text-brand-800 shadow-2xs"
                      : "text-neutral-500"
                  }`}
                >
                  KG (Weight)
                </button>
              </div>
            </div>
          </div>

          {/* Veg / Non-Veg Compliance Toggle */}
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-neutral-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VegBadge isVeg={isVeg} showLabel={false} />
              <div>
                <div className="text-xs font-bold text-neutral-900">
                  {isVeg ? "Pure Vegetarian Food" : "Contains Meat / Poultry"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Strictly verified for shelter dietary matching
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVeg(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  isVeg
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-white text-neutral-600 border-neutral-200"
                }`}
              >
                Veg
              </button>
              <button
                type="button"
                onClick={() => setIsVeg(false)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  !isVeg
                    ? "bg-red-600 text-white border-red-600 shadow-2xs"
                    : "bg-white text-neutral-600 border-neutral-200"
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Safe Until Quick Chips */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
              <span>{t("newPost.safeUntil", "Safe Consumption Expiry Window")}</span>
              <span className="text-emerald-700 font-semibold text-[11px]">
                Safe for next {safeUntilHours} hours
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 4].map((hrs) => (
                <button
                  type="button"
                  key={hrs}
                  onClick={() => setSafeUntilHours(hrs)}
                  className={`py-2 rounded-2xl text-xs font-bold border transition-colors ${
                    safeUntilHours === hrs
                      ? "bg-brand-800 text-white border-brand-800 shadow-2xs"
                      : "bg-surface-subtle text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  +{hrs} Hours
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Address */}
          <Input
            label={t("newPost.pickupLocation", "Pickup Address")}
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => {
                  setPickupAddress("ITC Rajputana, Station Road, Jaipur");
                  toast({ type: "info", title: "GPS Acquired", message: "Location locked at ITC Rajputana, Jaipur." });
                }}
                className="text-xs font-bold text-brand-800 hover:underline"
              >
                GPS
              </button>
            }
          />

          {/* Food Safety Attestation */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="attest"
              checked={attestationChecked}
              onChange={(e) => setAttestationChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-800 focus:ring-brand-800 cursor-pointer"
            />
            <label
              htmlFor="attest"
              className="text-xs text-neutral-700 leading-snug cursor-pointer select-none"
            >
              <span className="font-bold text-neutral-900 block mb-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Food Safety & Hygiene Attestation</span>
              </span>
              {t(
                "newPost.safetyAttestation",
                "I attest that this food was hygienically prepared and stored properly."
              )}
            </label>
          </div>
        </Card>

        {/* Sticky Mobile One-Thumb Submit Button (56px tall) */}
        <div className="sticky bottom-20 lg:bottom-4 z-20">
          <Button
            type="submit"
            size="xl"
            variant="primary"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="shadow-float"
          >
            {t("newPost.publishNow", "Publish Surplus Food")}
          </Button>
        </div>
      </form>
    </div>
  );
}
