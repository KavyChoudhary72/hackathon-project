"use client";

import React, { useState, useEffect } from "react";
import {
  Navigation,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  Delete,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api/client";
import { Donation } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { useLiveEvents } from "@/lib/ws/eventBus";

export default function DriverViewPage() {
  const { toast } = useToast();
  const { t } = useI18n();

  const [activeDonation, setActiveDonation] = useState<Donation | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const loadData = async () => {
    const list = await apiClient.getDonations();
    const task = list.find(
      (d) => d.status === "DRIVER_ASSIGNED" || d.status === "IN_TRANSIT"
    );
    setActiveDonation(task || list[0]);
  };

  useEffect(() => {
    loadData();
  }, []);

  useLiveEvents("driver:assigned", loadData);
  useLiveEvents("donation:in_transit", loadData);
  useLiveEvents("donation:delivered", loadData);

  const handleKeypadPress = (digit: string) => {
    setOtpError("");
    if (enteredOtp.length < 4) {
      setEnteredOtp((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setOtpError("");
    setEnteredOtp((prev) => prev.slice(0, -1));
  };

  const handleVerifyOtp = async () => {
    if (!activeDonation) return;
    if (enteredOtp.length !== 4) {
      setOtpError("Please enter full 4-digit OTP");
      return;
    }

    if (activeDonation.status === "DRIVER_ASSIGNED") {
      // Pickup verification
      const ok = await apiClient.verifyPickupOtp(activeDonation.id, enteredOtp);
      if (ok) {
        toast({
          type: "success",
          title: "Pickup Confirmed!",
          message: "Food verified. Proceed to shelter destination.",
        });
        setEnteredOtp("");
        loadData();
      } else {
        setOtpError("Incorrect Pickup OTP. Please ask donor for code.");
      }
    } else if (activeDonation.status === "IN_TRANSIT") {
      // Delivery verification
      const ok = await apiClient.verifyDeliveryOtp(activeDonation.id, enteredOtp);
      if (ok) {
        toast({
          type: "success",
          title: "Delivery Completed!",
          message: "Handover successful. 150 impact points credited.",
        });
        setEnteredOtp("");
        loadData();
      } else {
        setOtpError("Incorrect Delivery OTP. Please ask shelter coordinator.");
      }
    }
  };

  if (!activeDonation) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center text-sm text-neutral-500">
        Loading active missions...
      </div>
    );
  }

  const isDelivered = activeDonation.status === "DELIVERED";
  const isPickupStage = activeDonation.status === "DRIVER_ASSIGNED";
  const isTransitStage = activeDonation.status === "IN_TRANSIT";

  // Google Maps Deep Link
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    activeDonation.pickupAddress
  )}&destination=${encodeURIComponent(
    activeDonation.shelterAddress || "Hope Community Shelter, Bani Park, Jaipur"
  )}&travelmode=two-wheeler`;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Mission Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {t("driver.activeTask", "Active Rescue Mission")}
            </span>
          </div>
          <h1 className="text-2xl font-black text-brand-800 tracking-tight">
            Mission #{activeDonation.id}
          </h1>
        </div>
        <StatusBadge status={activeDonation.status} />
      </div>

      {/* Task Summary Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-800 flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              {activeDonation.foodName}
            </h3>
            <p className="text-xs text-neutral-500">
              Quantity: {activeDonation.quantity} {activeDonation.unit} (Pure Veg)
            </p>
          </div>
        </div>

        {/* Pickup and Delivery Addresses */}
        <div className="space-y-3 text-xs">
          {/* Pickup Step */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-800 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {t("driver.pickupFrom", "Pickup Donor")}
              </span>
              <div className="font-bold text-neutral-900 mt-0.5">
                {activeDonation.donorName}
              </div>
              <div className="text-neutral-500">{activeDonation.pickupAddress}</div>
            </div>
            <a
              href="tel:+919829012345"
              className="p-2 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Drop Step */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {t("driver.dropTo", "Deliver to Shelter")}
              </span>
              <div className="font-bold text-neutral-900 mt-0.5">
                {activeDonation.shelterName || "Hope Community Shelter"}
              </div>
              <div className="text-neutral-500">
                {activeDonation.shelterAddress || "Bani Park, Jaipur"}
              </div>
            </div>
            <a
              href="tel:+919829111223"
              className="p-2 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Deep Link to Google Maps Navigation */}
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block pt-1"
        >
          <Button
            size="lg"
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>{t("driver.openGoogleMaps", "Open in Google Maps")}</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Button>
        </a>
      </Card>

      {/* INTERACTIVE STYLIZED MAP CONTAINER */}
      <Card padding="none" className="overflow-hidden relative h-52 bg-emerald-950">
        {/* Stylized Jaipur City Route Map */}
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#2D6A4F_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Route Line SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 60 140 Q 180 60 320 80 T 460 70"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Origin Pin */}
        <div className="absolute top-30 left-12 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-brand-800 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
            P
          </div>
          <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1 backdrop-blur-xs">
            ITC Rajputana
          </span>
        </div>

        {/* Destination Pin */}
        <div className="absolute top-12 right-14 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-accent-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
            D
          </div>
          <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1 backdrop-blur-xs">
            Hope Shelter
          </span>
        </div>

        {/* Live Motorcycle Marker */}
        <div className="absolute top-18 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-float border border-neutral-200">
          <Truck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
          <span className="text-[10px] font-extrabold text-neutral-900">
            2.1 km (18 min)
          </span>
        </div>
      </Card>

      {/* LARGE-DIGIT OTP PAD FOR PICKUP & DELIVERY */}
      {!isDelivered ? (
        <Card padding="lg" className="space-y-4">
          <div className="text-center">
            <h3 className="text-base font-bold text-neutral-900">
              {isPickupStage
                ? t("driver.enterPickupOtp", "Enter Donor Pickup OTP")
                : t("driver.enterDeliveryOtp", "Enter Shelter Delivery OTP")}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isPickupStage
                ? "Ask the banquet donor for their 4-digit pickup code"
                : "Ask the shelter coordinator for their 4-digit delivery code"}
            </p>
          </div>

          {/* 4-Box PIN Display */}
          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const char = enteredOtp[index] || "";
              return (
                <div
                  key={index}
                  className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black font-mono transition-all ${
                    char
                      ? "border-brand-800 bg-brand-50/50 text-brand-900"
                      : "border-neutral-200 bg-surface-subtle text-neutral-300"
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          {otpError && (
            <p className="text-center text-xs font-bold text-red-600 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{otpError}</span>
            </p>
          )}

          {/* Big-Digit Touch Keypad (0-9) */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-xs mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="h-14 rounded-2xl bg-white border border-neutral-200 shadow-2xs text-xl font-bold text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="h-14 rounded-2xl bg-white border border-neutral-200 shadow-2xs text-xl font-bold text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200 active:scale-95 transition-all"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* 1-Thumb XL Action Button */}
          <div className="pt-2">
            <Button
              size="xl"
              variant="primary"
              onClick={handleVerifyOtp}
              disabled={enteredOtp.length !== 4}
              leftIcon={<ShieldCheck className="w-5 h-5 stroke-[2.5]" />}
            >
              {t("driver.verifyHandover", "Verify Handover")}
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center py-8 space-y-3 bg-emerald-50 border-emerald-200">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-neutral-900">
            Mission Successfully Completed!
          </h3>
          <p className="text-xs text-neutral-600 max-w-xs mx-auto">
            Food was securely delivered to Hope Community Shelter. Thank you for your volunteer service.
          </p>
        </Card>
      )}
    </div>
  );
}