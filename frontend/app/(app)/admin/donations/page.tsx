"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  PackageOpen,
  ArrowLeft,
  Truck,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Filter,
  Eye,
  Edit3,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiClient } from "@/lib/api/client";
import { Donation, DonationStatus, Shelter } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { eventBus } from "@/lib/ws/eventBus";

export default function AdminDonationsAuditPage() {
  const { locale } = useI18n();
  const { toast } = useToast();
  const isHi = locale === "hi";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [overrideShelterId, setOverrideShelterId] = useState<string>("");
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [donList, shelterList] = await Promise.all([
        apiClient.getDonations(),
        apiClient.getShelters(),
      ]);
      setDonations(donList);
      setShelters(shelterList);
      if (donList.length > 0 && !selectedDonation) {
        setSelectedDonation(donList[0]);
      }
    } catch (err) {
      console.error("Failed to load donations audit data:", err);
    }
  };

  useEffect(() => {
    loadData();

    const unsubUpdated = eventBus.on("donation:updated", () => loadData());
    const unsubOverridden = eventBus.on("donation:overridden", () => loadData());
    const unsubDelivered = eventBus.on("donation:delivered", () => loadData());

    return () => {
      unsubUpdated();
      unsubOverridden();
      unsubDelivered();
    };
  }, []);

  const handleOverrideShelter = async () => {
    if (!selectedDonation || !overrideShelterId) return;

    const success = await apiClient.overrideDonationShelter(
      selectedDonation.id,
      overrideShelterId
    );

    if (success) {
      const targetShelter = shelters.find((s) => s.id === overrideShelterId);
      toast({
        type: "success",
        title: "Shelter Assignment Overridden",
        message: `Donation ${selectedDonation.id} has been manually re-routed to ${targetShelter?.name || overrideShelterId}.`,
      });
      setIsOverrideModalOpen(false);
      await loadData();
      const updated = (await apiClient.getDonations()).find((d) => d.id === selectedDonation.id);
      if (updated) setSelectedDonation(updated);
    } else {
      toast({
        type: "error",
        title: "Override Failed",
        message: "Could not override shelter assignment.",
      });
    }
  };

  const handleForceStatus = async (newStatus: DonationStatus) => {
    if (!selectedDonation) return;

    const success = await apiClient.forceDonationStatus(selectedDonation.id, newStatus);
    if (success) {
      toast({
        type: "info",
        title: "Status Forced by Super Admin",
        message: `Donation ${selectedDonation.id} status updated to ${newStatus}.`,
      });
      await loadData();
      const updated = (await apiClient.getDonations()).find((d) => d.id === selectedDonation.id);
      if (updated) setSelectedDonation(updated);
    }
  };

  const handleCancelDonation = async () => {
    if (!selectedDonation) return;
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel rescue mission ${selectedDonation.id}? This will notify the donor and shelter.`
    );
    if (!confirmCancel) return;

    const success = await apiClient.cancelDonation(
      selectedDonation.id,
      "Cancelled by Super Admin Audit Console"
    );
    if (success) {
      toast({
        type: "error",
        title: "Donation Cancelled",
        message: `Donation ${selectedDonation.id} has been voided.`,
      });
      await loadData();
      const updated = (await apiClient.getDonations()).find((d) => d.id === selectedDonation.id);
      if (updated) setSelectedDonation(updated);
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "ACTIVE")
      return d.status === "MATCHED" || d.status === "DRIVER_ASSIGNED" || d.status === "IN_TRANSIT";
    if (statusFilter === "DELIVERED") return d.status === "DELIVERED";
    if (statusFilter === "CANCELLED") return d.status === "CANCELLED";
    return true;
  });

  const getStatusBadge = (status: DonationStatus) => {
    switch (status) {
      case "DELIVERED":
        return <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold">DELIVERED</span>;
      case "IN_TRANSIT":
        return <span className="ui-chip bg-[#E0F2FE] text-[#0369A1] text-[12px] font-bold">IN TRANSIT</span>;
      case "DRIVER_ASSIGNED":
        return <span className="ui-chip bg-[#FEF3C7] text-[#B45309] text-[12px] font-bold">DRIVER ASSIGNED</span>;
      case "MATCHED":
        return <span className="ui-chip bg-[#F3E8FF] text-[#7E22CE] text-[12px] font-bold">MATCHED</span>;
      case "CANCELLED":
        return <span className="ui-chip bg-[#FEE2E2] text-[#DC2626] text-[12px] font-bold">CANCELLED</span>;
      default:
        return <span className="ui-chip bg-gray-100 text-gray-700 text-[12px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
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
            {isHi ? "इंजन निर्णय एवं बचाव ऑडिट" : "Rescue & Matching Engine Audit"}
          </h1>
          <span className="text-[15px] text-[#5B6661]">
            {isHi
              ? "प्रत्येक अधिशेष भोजन बैच के एआई मिलान कारकों की जांच करें और आवश्यकता पड़ने पर ओवरराइड करें।"
              : "Audit AI matching decisions, inspect score breakdowns, and exercise administrative override."}
          </span>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 bg-[#F6F5F1] p-1 rounded-xl border border-[#ECE9E1]">
          {["ALL", "ACTIVE", "DELIVERED", "CANCELLED"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                statusFilter === f
                  ? "bg-[#0E3B2E] text-white shadow-2xs"
                  : "text-[#5B6661] hover:text-[#13231C]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: DONATION LIST (LEFT) & DEEP AUDIT PANEL (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: DONATION BATCH LIST (5 of 12) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[14px] font-bold text-[#13231C] px-1 flex items-center justify-between">
            <span>{isHi ? "दान रिकॉर्ड सूची" : "Donation Records"} ({filteredDonations.length})</span>
            <span className="text-[12px] text-[#5B6661] font-normal">{isHi ? "लाइव सिंक" : "Live synced"}</span>
          </span>

          <div className="flex flex-col gap-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredDonations.map((d) => {
              const isSelected = selectedDonation?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDonation(d)}
                  className={`ui-card p-4.5 flex flex-col gap-2.5 transition-all cursor-pointer border ${
                    isSelected
                      ? "border-[#1E9E5A] bg-[#F7FCF9] ring-2 ring-[#1E9E5A]/20 shadow-xs"
                      : "hover:border-[#CDE8D7]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-extrabold text-[#0E3B2E]">
                          {d.id}
                        </span>
                        {getStatusBadge(d.status)}
                      </div>
                      <span className="font-outfit text-[16px] font-bold text-[#13231C] mt-1">
                        {d.foodName}
                      </span>
                    </div>
                    <span className="ui-chip bg-[#E3F5EA] text-[#166534] font-bold text-[12px]">
                      {d.quantity} {d.unit}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-[13px] text-[#5B6661]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#1E9E5A] flex-shrink-0" />
                      <span className="truncate">{d.donorName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E89B1C] flex-shrink-0" />
                      <span className="truncate">{d.shelterName || "Pending Shelter Match"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: DEEP ENGINE DECISION AUDIT PANEL (7 of 12) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {selectedDonation ? (
            <div className="ui-card p-6 flex flex-col gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              {/* TOP ROW: ID + Status + Admin Governance Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ECE9E1] pb-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[16px] font-extrabold text-[#0E3B2E]">
                      {selectedDonation.id}
                    </span>
                    {getStatusBadge(selectedDonation.status)}
                  </div>
                  <span className="text-[13px] text-[#5B6661]">
                    Created: {new Date(selectedDonation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Tier {selectedDonation.tier}
                  </span>
                </div>

                {/* GOVERNANCE ACTIONS */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setOverrideShelterId(selectedDonation.shelterId || shelters[0]?.id || "");
                      setIsOverrideModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#FFF9EC] border border-[#F3E6C6] hover:border-[#E89B1C] text-[#B45309] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E89B1C]" />
                    <span>{isHi ? "आश्रय ओवरराइड करें" : "Override Match"}</span>
                  </button>

                  {selectedDonation.status !== "DELIVERED" && selectedDonation.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={() => handleForceStatus("DELIVERED")}
                      className="px-3 py-1.5 bg-[#E3F5EA] border border-[#C2DEC8] hover:border-[#1E9E5A] text-[#166534] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E5A]" />
                      <span>{isHi ? "डिलीवरी पूर्ण चिह्नित करें" : "Force Delivered"}</span>
                    </button>
                  )}

                  {selectedDonation.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={handleCancelDonation}
                      className="px-3 py-1.5 bg-[#FEE2E2] border border-[#FECACA] hover:border-[#DC2626] text-[#DC2626] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{isHi ? "रद्द करें" : "Cancel Batch"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DETAILS SUMMARY */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F6F5F1] p-4 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "मात्रा" : "Quantity"}</span>
                  <span className="font-bold text-[#13231C] text-[15px]">
                    {selectedDonation.quantity} {selectedDonation.unit}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "सुरक्षित समय" : "Safe Window"}</span>
                  <span className="font-bold text-[#13231C] text-[15px]">
                    {new Date(selectedDonation.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "पिकअप ओटीपी" : "Pickup OTP"}</span>
                  <span className="font-mono font-extrabold text-[#0E3B2E] text-[15px]">
                    {selectedDonation.pickupOtp}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "डिलीवरी ओटीपी" : "Delivery OTP"}</span>
                  <span className="font-mono font-extrabold text-[#1E9E5A] text-[15px]">
                    {selectedDonation.deliveryOtp}
                  </span>
                </div>
              </div>

              {/* AI MATCHING FACTORS AUDIT SCORECARD */}
              <div className="flex flex-col gap-3">
                <span className="font-outfit text-[17px] font-bold text-[#13231C] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E89B1C]" />
                  <span>{isHi ? "एआई मिलान कारक एवं भारित स्कोर" : "AI Multi-Factor Match Audit"}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedDonation.scoreBreakdown || [
                    { factor: "Proximity (Distance)", score: 95, weight: 0.35, description: "2.1 km to nearest available shelter." },
                    { factor: "Capacity Match", score: 98, weight: 0.35, description: "Capacity exactly matches surplus lot." },
                    { factor: "Acceptance Record", score: 96, weight: 0.15, description: "High priority verified shelter partner." },
                    { factor: "Safety Window", score: 90, weight: 0.15, description: "3.5 hr consumption window remaining." },
                  ]).map((factor, idx) => (
                    <div
                      key={idx}
                      className="border border-[#ECE9E1] bg-white p-3.5 rounded-xl flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#13231C]">
                          {factor.factor}
                        </span>
                        <span className="text-[13px] font-extrabold text-[#1E9E5A]">
                          {factor.score}/100 <span className="text-[11px] text-[#5B6661]">({Math.round(factor.weight * 100)}% wt)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#F6F5F1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E9E5A] rounded-full"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-[#5B6661]">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HARD FILTERS & ELIMINATED CANDIDATES */}
              <div className="flex flex-col gap-2.5 border-t border-[#ECE9E1] pt-4">
                <span className="font-outfit text-[16px] font-bold text-[#13231C] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                  <span>{isHi ? "हार्ड फ़िल्टर द्वारा खारिज आश्रय" : "Filtered Out Candidates & Hard Rejections"}</span>
                </span>

                <div className="flex flex-col gap-2">
                  {(selectedDonation.filteredOutShelters || [
                    { shelterId: "shelter_bal_seva", name: "Bal Seva Sansthan Outskirts", reason: "Distance 24.5 km exceeds maximum radius limit (20 km)", distanceKm: 24.5 },
                    { shelterId: "shelter_mini", name: "Pink City Mini Care", reason: "Remaining capacity tonight is 0", distanceKm: 4.2 },
                  ]).map((rej, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl flex items-start justify-between gap-3 text-[13px]"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[#991B1B]">{rej.name}</span>
                        <span className="text-[#7F1D1D]">{rej.reason}</span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#B91C1C] flex-shrink-0">
                        {rej.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="ui-card p-12 text-center text-[#5B6661]">
              Select a donation from the list to audit engine decisions.
            </div>
          )}
        </div>
      </div>

      {/* OVERRIDE SHELTER MODAL */}
      {isOverrideModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ui-card max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[20px] font-extrabold text-[#0E3B2E]">
                {isHi ? "मैन्युअल आश्रय ओवरराइड" : "Manual Shelter Override"}
              </span>
              <span className="text-[13px] text-[#5B6661]">
                Override AI matching algorithm and force reassign rescue batch {selectedDonation.id}.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#13231C]">
                Select Target Shelter
              </label>
              <select
                value={overrideShelterId}
                onChange={(e) => setOverrideShelterId(e.target.value)}
                className="ui-input py-2.5 text-[14px]"
              >
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Cap: {s.availableCapacity} meals left)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOverrideModalOpen(false)}
                className="btn-secondary h-10 px-4 text-[13px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOverrideShelter}
                className="btn-primary h-10 px-5 text-[13px]"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
