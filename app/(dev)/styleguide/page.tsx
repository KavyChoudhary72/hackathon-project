"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge, VegBadge, StatusBadge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import {
  Heart,
  ArrowRight,
  Search,
  Sparkles,
  Bell,
  CheckCircle2,
  Truck,
  Building2,
  Leaf,
  Layers,
} from "lucide-react";

export default function StyleguidePage() {
  const { locale, setLocale, t } = useI18n();
  const { toast, celebrate } = useToast();

  // Interactive States
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnSuccess, setBtnSuccess] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [stepperVal, setStepperVal] = useState(40);
  const [switchVal, setSwitchVal] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const triggerLoadingCycle = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      setBtnSuccess(true);
      setTimeout(() => setBtnSuccess(false), 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-neutral-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>FoodLink Design System & Component Styleguide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-800 tracking-tight">
            Design Tokens & UI Kit
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Exact design extraction from reference screens (Desktop & Mobile 360px optimized)
          </p>
        </div>

        {/* Language & Action Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-full border border-neutral-200 shadow-2xs">
            <button
              onClick={() => setLocale("en")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                locale === "en"
                  ? "bg-brand-800 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("hi")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                locale === "hi"
                  ? "bg-brand-800 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              हिन्दी
            </button>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => celebrate("Styleguide Celebration!", "Tokens and components are functioning smoothly.")}
          >
            🎉 Trigger Celebration
          </Button>
        </div>
      </div>

      {/* SECTION 1: COLOR TOKENS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            1. Color Tokens & Semantic Palettes
          </h2>
          <p className="text-xs text-neutral-500">
            High-contrast tokens extracted from Reference Images 1, 2, and 4
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-brand-800 shadow-sm flex items-end p-2 text-white font-mono text-xs">
              #113A2B
            </div>
            <div className="text-xs font-bold text-neutral-800">Primary Brand</div>
            <div className="text-[11px] text-neutral-500">CTA & Hero Text</div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-brand-700 shadow-sm flex items-end p-2 text-white font-mono text-xs">
              #1B4332
            </div>
            <div className="text-xs font-bold text-neutral-800">Sidebar Active</div>
            <div className="text-[11px] text-neutral-500">Hover / Selected</div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-accent-500 shadow-sm flex items-end p-2 text-white font-mono text-xs">
              #F9683A
            </div>
            <div className="text-xs font-bold text-neutral-800">Coral Accent</div>
            <div className="text-[11px] text-neutral-500">"Real Impact" Highlight</div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-brand-100 border border-brand-200 shadow-sm flex items-end p-2 text-brand-900 font-mono text-xs">
              #E8F5E9
            </div>
            <div className="text-xs font-bold text-neutral-800">Mint / Sage Tint</div>
            <div className="text-[11px] text-neutral-500">Active Pill / Chip</div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-amber-500 shadow-sm flex items-end p-2 text-white font-mono text-xs">
              #F59E0B
            </div>
            <div className="text-xs font-bold text-neutral-800">Community Hero</div>
            <div className="text-[11px] text-neutral-500">Gold Medal Badge</div>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-2xl bg-surface-base border border-neutral-200 shadow-sm flex items-end p-2 text-neutral-700 font-mono text-xs">
              #FAF9F5
            </div>
            <div className="text-xs font-bold text-neutral-800">Surface Mist</div>
            <div className="text-[11px] text-neutral-500">Warm Canvas BG</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: BUTTON SYSTEM */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              2. Button System (All Variants & States)
            </h2>
            <p className="text-xs text-neutral-500">
              Subtle 0.97 pressed feedback, WCAG AA focus rings, and locked-width spinner
            </p>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-neutral-200 text-xs font-semibold">
            <button
              onClick={triggerLoadingCycle}
              className="text-brand-800 hover:underline"
            >
              Test Loading/Success Cycle
            </button>
            <span className="text-neutral-300">|</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={btnDisabled}
                onChange={(e) => setBtnDisabled(e.target.checked)}
                className="rounded"
              />
              <span>Disable All</span>
            </label>
          </div>
        </div>

        {/* Variants Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
              Variants (Size MD)
            </h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="primary"
                disabled={btnDisabled}
                isLoading={btnLoading}
                isSuccess={btnSuccess}
                leftIcon={<Heart className="w-4 h-4 fill-white" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Donate Food
              </Button>
              <Button
                variant="secondary"
                disabled={btnDisabled}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Explore Map
              </Button>
              <Button variant="ghost" disabled={btnDisabled}>
                Cancel
              </Button>
              <Button variant="danger" disabled={btnDisabled}>
                Decline Offer
              </Button>
              <Button variant="success" disabled={btnDisabled}>
                Verify OTP
              </Button>
              <Button variant="pill-chip" disabled={btnDisabled}>
                🌱 Cooked Meals
              </Button>
              <Button
                variant="icon"
                disabled={btnDisabled}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-brand-800" />
              </Button>
            </div>
          </Card>

          <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
              Sizes Comparison
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="primary">
                  Size SM (32px)
                </Button>
                <Button size="md" variant="primary">
                  Size MD (40px)
                </Button>
                <Button size="lg" variant="primary">
                  Size LG (48px)
                </Button>
              </div>

              {/* Designated Mobile One-Thumb XL Button */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-neutral-600 mb-1">
                  Mobile One-Thumb Action: Size XL (56px tall, full-width)
                </div>
                <Button
                  size="xl"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => toast({ type: "info", title: "XL Button Tapped", message: "Haptic press feedback fired." })}
                >
                  Post Surplus Food (₹0 Cost)
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bilingual Comparison */}
        <Card padding="md" className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
            Bilingual Length Stress Test (Hindi Character Expansion)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-neutral-500">English (Short)</div>
              <Button variant="primary" size="lg" className="w-full">
                Publish Surplus Food Now
              </Button>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-neutral-500">Hindi (Extended Ligatures)</div>
              <Button variant="primary" size="lg" className="w-full">
                अधिशेष भोजन अभी तुरंत प्रकाशित करें
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 3: BADGES & COMPLIANCE */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            3. Badges, Tiers & Compliance Indicators
          </h2>
          <p className="text-xs text-neutral-500">
            3-Tier cascade badges, Indian FSSAI veg indicators, and state machine statuses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tiers */}
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              3-Tier Cascade Badges
            </h3>
            <div className="flex flex-col gap-2.5">
              <TierBadge tier={1} showSubtext />
              <TierBadge tier={2} showSubtext />
              <TierBadge tier={3} showSubtext />
            </div>
          </Card>

          {/* Veg / Non-Veg */}
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Dietary Compliance (FSSAI)
            </h3>
            <div className="flex items-center gap-6 pt-2">
              <VegBadge isVeg={true} />
              <VegBadge isVeg={false} />
            </div>
          </Card>

          {/* Status Machine Badges */}
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Status Machine Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="CREATED" />
              <StatusBadge status="MATCHED" />
              <StatusBadge status="DRIVER_ASSIGNED" />
              <StatusBadge status="IN_TRANSIT" />
              <StatusBadge status="DELIVERED" />
              <StatusBadge status="EXPIRED" />
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 4: FORM CONTROLS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            4. Inputs, Steppers & Toggles
          </h2>
          <p className="text-xs text-neutral-500">
            Form controls engineered for sub-60-second completion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Input Variations
            </h3>
            <Input
              label="Standard Food Item"
              placeholder="e.g. 50 Plates Rajasthani Dal Baati"
              helperText="Prepared in hygienic kitchen"
            />
            <Input
              pill
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search donations, shelters, or places..."
            />
            <Input
              label="Validation Error State"
              defaultValue="Invalid time"
              error="Prepared time cannot be in the future"
            />
          </Card>

          <Card padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Quantity Stepper (Instant Response)
            </h3>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-600">
                Shelter Nightly Capacity:
              </span>
              <Stepper
                value={stepperVal}
                onChange={setStepperVal}
                min={5}
                max={200}
                step={5}
                unit="meals"
                size="lg"
              />
            </div>
          </Card>

          <Card padding="md" className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Accessible Switches
            </h3>
            <Switch
              checked={switchVal}
              onChange={setSwitchVal}
              label="Pure Vegetarian Attestation"
              sublabel="Food contains zero meat, eggs, or seafood"
            />
            <Switch
              checked={false}
              onChange={() => {}}
              disabled
              label="Offline Storage Mode (Disabled)"
            />
          </Card>
        </div>
      </section>

      {/* SECTION 5: MODALS, SHEETS & TOASTS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            5. Feedback, Modals & Mobile Sheets
          </h2>
          <p className="text-xs text-neutral-500">
            Accessible dialogs, mobile-friendly bottom drawers, and live toasts
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Open Modal Dialog
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsSheetOpen(true)}
          >
            Open Mobile Bottom Sheet
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast({ type: "success", title: "Donation Matched!", message: "Hope Community Shelter accepted your food." })}
          >
            Trigger Success Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast({ type: "error", title: "Wrong OTP", message: "The entered OTP does not match driver records." })}
          >
            Trigger Error Toast
          </Button>
        </div>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Shelter Assignment"
          description="Asha Shelter is 2.1 km away with 40 available seats."
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-brand-800" />
              <div>
                <div className="text-sm font-bold text-brand-900">Asha Shelter, Jaipur</div>
                <div className="text-xs text-brand-700">Estimated pickup arrival in 22 minutes</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => { setIsModalOpen(false); toast({ type: "success", title: "Confirmed!" }); }}>
                Confirm Match
              </Button>
            </div>
          </div>
        </Modal>

        {/* Sheet Instance */}
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="Claim Rescue Deal Voucher"
        >
          <div className="space-y-4 pt-2 pb-6">
            <p className="text-sm text-neutral-600">
              Claim up to 5 discounted meals for instant pickup at Chokhi Dhani.
            </p>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-sm font-bold">Quantity:</span>
              <Stepper value={2} onChange={() => {}} min={1} max={5} unit="boxes" />
            </div>
            <Button
              size="xl"
              variant="primary"
              onClick={() => { setIsSheetOpen(false); toast({ type: "success", title: "Deal Claimed!", message: "Your pickup OTP is 7241" }); }}
            >
              Confirm Claim (Pay ₹80 at Pickup)
            </Button>
          </div>
        </Sheet>
      </section>

      {/* SECTION 6: SKELETONS & EMPTY STATES */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            6. Skeletons & Empty States
          </h2>
          <p className="text-xs text-neutral-500">
            Instant perceptual loading states and friendly fallbacks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Loading Shimmer Skeleton
            </h3>
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 w-28 rounded-2xl" />
                <Skeleton className="h-10 w-28 rounded-2xl" />
              </div>
            </div>
          </Card>

          <EmptyState
            icon={<Leaf className="w-8 h-8" />}
            title="No Active Donations Found"
            description="You do not have any pending food rescue operations right now. Ready to post tonight's surplus?"
            actionLabel="+ Post Surplus Food"
            onAction={() => toast({ type: "info", title: "New donation action" })}
          />
        </div>
      </section>
    </div>
  );
}
