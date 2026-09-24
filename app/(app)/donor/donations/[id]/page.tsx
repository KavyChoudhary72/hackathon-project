"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Check,
  Truck,
  Building2,
  Clock,
  Phone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge, VegBadge, TierBadge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api/client";
import { Donation } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { useLiveEvents } from "@/lib/ws/eventBus";
import { formatTimeRemaining } from "@/lib/utils";

export default function DonationTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast, celebrate } = useToast();
  const { t } = useI18n();

  const id = (params?.id as string) || "DN1024";
  const [donation, setDonation] = useState<Donation | null>(null);
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false);
  const [cascadeSeconds, setCascadeSeconds] = useState(24);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const loadDonation = async () => {
    const d = await apiClient.getDonation(id);
    if (d) setDonation(d);
  };

  useEffect(() => {
    loadDonation();
  }, [id]);

  useLiveEvents("driver:assigned", loadDonation);
  useLiveEvents("donation:in_transit", loadDonation);
  useLiveEvents("donation:delivered", (d: Donation) => {
    loadDonation();
    if (!hasCelebrated) {
      celebrate("Delivery Completed!", "+150 Impact Points Earned!");
      setHasCelebrated(true);
    }
  });
  useLiveEvents("cascade:timeout", loadDonation);

  useEffect(() => {
    if (donation?.status === "MATCHED" && cascadeSeconds > 0) {
      const timer = setInterval(() => {
        setCascadeSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            apiClient.declineOffer(id, donation.shelterId || "shelter_hope");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [donation?.status, cascadeSeconds, id]);

  if (!donation) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-sm text-neutral-500">
        Loading donation tracker #{id}...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/donor"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-brand-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <TierBadge tier={donation.tier} />
          <StatusBadge status={donation.status} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-800 tracking-tight flex items-center gap-2">
            <span>Tracking #{donation.id}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {donation.foodName} · {donation.quantity} {donation.unit}
          </p>
        </div>

        {donation.status === "DELIVERED" && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-300 animate-bounce">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>+150 Points Earned!</span>
          </div>
        )}
      </div>

      {donation.status === "MATCHED" && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-200/70 flex items-center justify-center text-amber-800">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold">
                Offered to {donation.shelterName || "Hope Shelter"} · Waiting{" "}
                {formatTimeRemaining(cascadeSeconds)}
              </div>
              <div className="text-[11px] text-amber-700">
                If not accepted before timer, auto-cascades to next nearest shelter
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              apiClient.declineOffer(id, donation.shelterId || "shelter_hope");
              toast({ type: "info", title: "Cascade Simulated", message: "Cascading to Seva Ghar..." });
            }}
            className="text-xs font-bold text-amber-800 underline ml-2"
          >
            Force Timeout
          </button>
        </div>
      )}

      <Card padding="lg" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Redistribution Timeline
          </h3>
          <button
            onClick={() => setShowDetailedTimeline(!showDetailedTimeline)}
            className="text-xs font-bold text-brand-800 hover:underline flex items-center gap-1"
          >
            <span>{showDetailedTimeline ? "Simple View" : "Detailed Audit Log"}</span>
            {showDetailedTimeline ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="relative pt-2 pb-2">
          <div className="absolute top-6 left-8 right-8 h-0.5 bg-neutral-200 -z-0" />
          <div className="relative flex justify-between z-10 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-800 text-white flex items-center justify-center shadow-sm">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800 max-w-[80px]">
                {t("tracker.timelineCreated", "Donation Created")}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  donation.status !== "CREATED"
                    ? "bg-brand-800 text-white"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800 max-w-[80px]">
                {t("tracker.timelineMatched", "Shelter Matched")}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  donation.status === "DRIVER_ASSIGNED" ||
                  donation.status === "IN_TRANSIT"
                    ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                    : donation.status === "DELIVERED"
                    ? "bg-brand-800 text-white"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800 max-w-[80px]">
                {t("tracker.timelineAssigned", "Driver Assigned")}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  donation.status === "DELIVERED"
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800 max-w-[80px]">
                {t("tracker.timelineDelivered", "Delivered")}
              </span>
            </div>
          </div>
        </div>

        {showDetailedTimeline && (
          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-800 mt-1.5" />
              <div>
                <div className="font-bold text-neutral-900">
                  Surplus Batch Broadcasted
                </div>
                <div className="text-neutral-500">
                  20:15:00 · 30 meals vegetarian compliance verified
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-800 mt-1.5" />
              <div>
                <div className="font-bold text-neutral-900">
                  AI Match Algorithm Executed
                </div>
                <div className="text-neutral-500">
                  20:15:02 · Score 96.5% assigned to Hope Community Shelter
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="md" className="space-y-3 bg-brand-900 text-white border-brand-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-200 uppercase tracking-wider">
              {t("tracker.pickupOtp", "Donor Pickup OTP")}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-center py-2">
            <div className="font-mono text-4xl font-black tracking-widest text-accent-400">
              {donation.pickupOtp}
            </div>
            <p className="text-[11px] text-brand-200 mt-1">
              Give this code to the driver only after food is loaded.
            </p>
          </div>
        </Card>

        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {t("tracker.driverAssigned", "Assigned Driver")}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ETA 25 min
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                {donation.driverName || "Ramesh Kumar (Bike)"}
              </h4>
              <p className="text-xs text-neutral-500">
                Vehicle: Hero Splendor (RJ-14-EA-4412)
              </p>
            </div>
          </div>
          <a
            href={`tel:${donation.driverPhone || "+919829044521"}`}
            className="block"
          >
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Phone className="w-3.5 h-3.5 text-brand-800" />}
              className="w-full"
            >
              {t("tracker.callDriver", "Call Driver")}
            </Button>
          </a>
        </Card>
      </div>

      <Card padding="lg" className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
              <span>Explainable Dispatch Intelligence</span>
            </div>
            <h3 className="text-xl font-black text-brand-800 tracking-tight">
              {t("tracker.whyThisShelter", "Why this shelter?")}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Transparent algorithmic scoring for{" "}
              <span className="font-bold text-neutral-800">
                {donation.shelterName || "Hope Community Shelter"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-emerald-600">96.5%</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Match Quality
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {donation.scoreBreakdown?.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800">
                  {factor.factor}
                </span>
                <span className="font-mono font-bold text-brand-800">
                  {factor.score}% (weight {factor.weight})
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-800 rounded-full"
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">{factor.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>{t("tracker.filteredOut", "Other Shelters Evaluated & Filter Reasons")}</span>
          </h4>

          <div className="space-y-2">
            {donation.filteredOutShelters?.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-surface-subtle border border-neutral-200/60 flex items-start justify-between text-xs gap-3"
              >
                <div>
                  <div className="font-bold text-neutral-900">{f.name}</div>
                  <div className="text-neutral-500 mt-0.5">{f.reason}</div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-neutral-400 whitespace-nowrap">
                  {f.distanceKm} km away
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}