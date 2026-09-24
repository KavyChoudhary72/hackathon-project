"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Truck,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { VegBadge, TierBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { apiClient } from "@/lib/api/client";
import { Donation, Shelter } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { useLiveEvents } from "@/lib/ws/eventBus";
import { formatTimeRemaining } from "@/lib/utils";

export default function ShelterDashboardPage() {
  const { toast } = useToast();
  const { t } = useI18n();

  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [capacity, setCapacity] = useState(40);
  const [incomingOffers, setIncomingOffers] = useState<Donation[]>([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState<Donation[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const loadData = async () => {
    const shelters = await apiClient.getShelters();
    if (shelters.length > 0) {
      setShelter(shelters[0]);
      setCapacity(shelters[0].capacityTonight);
    }
    const all = await apiClient.getDonations();
    setIncomingOffers(all.filter((d) => d.status === "MATCHED" || d.status === "CREATED"));
    setAcceptedDeliveries(
      all.filter((d) => d.status === "DRIVER_ASSIGNED" || d.status === "IN_TRANSIT")
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  useLiveEvents("donation:created", loadData);
  useLiveEvents("shelter:matched", loadData);
  useLiveEvents("driver:assigned", loadData);
  useLiveEvents("donation:delivered", loadData);

  const handleCapacityChange = async (val: number) => {
    setCapacity(val);
    if (shelter) {
      await apiClient.updateShelterCapacity(shelter.id, val);
      toast({
        type: "success",
        title: "Capacity Updated",
        message: `Tonight's capacity set to ${val} meals.`,
      });
    }
  };

  const handleAccept = async (donationId: string) => {
    if (!shelter) return;
    await apiClient.acceptOffer(donationId, shelter.id);
    toast({
      type: "success",
      title: "Offer Accepted!",
      message: "Delivery partner assigned. Arriving soon.",
    });
    loadData();
  };

  const handleDecline = async (donationId: string) => {
    if (!shelter) return;
    await apiClient.declineOffer(donationId, shelter.id);
    toast({
      type: "info",
      title: "Offer Declined",
      message: "Cascaded to next nearest community shelter.",
    });
    loadData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Verified Shelter Partner
            </span>
          </div>
          <h1 className="text-3xl font-black text-brand-800 tracking-tight">
            {shelter?.name || "Hope Community Shelter"}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {shelter?.address || "Bani Park, Jaipur"} · Phone: {shelter?.phone}
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsReportOpen(true)}
          className="text-xs"
        >
          {t("shelter.reportIssue", "Report Quality Issue")}
        </Button>
      </div>

      {/* CAPACITY STEPPER CARD - SAVED INSTANTLY */}
      <Card padding="lg" className="bg-brand-50/70 border-brand-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              {t("shelter.capacityTitle", "Tonight's Shelter Capacity")}
            </span>
            <h3 className="text-xl font-black text-neutral-900 mt-1">
              How many meals can you serve tonight?
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Live matching stops automatically once this capacity is fulfilled.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Stepper
              value={capacity}
              onChange={handleCapacityChange}
              min={5}
              max={250}
              step={5}
              unit="meals"
              size="lg"
            />
          </div>
        </div>
      </Card>

      {/* INCOMING URGENT FOOD OFFERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-brand-800 tracking-tight flex items-center gap-2">
            <span>{t("shelter.incomingOffers", "Urgent Incoming Food Offers")}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-50 text-accent-600 text-xs font-bold border border-accent-200">
              {incomingOffers.length} available
            </span>
          </h2>
        </div>

        {incomingOffers.length === 0 ? (
          <Card padding="lg" className="text-center py-10 text-neutral-500 text-xs">
            No incoming donations currently matching. You will be alerted instantly when surplus is posted nearby!
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incomingOffers.map((item) => (
              <Card
                key={item.id}
                padding="md"
                className="border-neutral-200 shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <VegBadge isVeg={item.isVeg} />
                        <TierBadge tier={item.tier} />
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        From: <span className="font-semibold text-neutral-800">{item.donorName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Safety Countdown badge */}
                  <div className="flex sm:flex-col items-end gap-1">
                    <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                      <span>Safe for 3h 45m</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      Cooked 1h ago
                    </span>
                  </div>
                </div>

                {/* Match Reason Chips */}
                <div className="p-3 rounded-2xl bg-surface-subtle flex flex-wrap gap-2 text-xs font-semibold text-brand-900">
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                    📍 2.1 km away
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                    🍽️ {item.quantity} {item.unit}
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                    🌱 100% Veg Compliance
                  </span>
                </div>

                {/* XL Accept / Decline Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Button
                    size="xl"
                    variant="primary"
                    onClick={() => handleAccept(item.id)}
                    leftIcon={<CheckCircle2 className="w-5 h-5 stroke-[2.5]" />}
                  >
                    {t("shelter.acceptOffer", "Accept Food Offer")}
                  </Button>
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={() => handleDecline(item.id)}
                    leftIcon={<XCircle className="w-5 h-5 stroke-[2.5]" />}
                  >
                    {t("shelter.declineOffer", "Decline (Cascade)")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ACCEPTED DELIVERIES WITH DELIVERY OTP */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <h2 className="text-lg font-black text-brand-800 tracking-tight">
          {t("shelter.incomingDelivery", "Active Incoming Deliveries")}
        </h2>

        {acceptedDeliveries.length === 0 ? (
          <Card padding="md" className="text-center py-8 text-neutral-400 text-xs">
            No drivers currently en route to your shelter.
          </Card>
        ) : (
          <div className="space-y-3">
            {acceptedDeliveries.map((d) => (
              <Card
                key={d.id}
                padding="md"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/50 border-emerald-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                    <Truck className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {d.foodName} ({d.quantity} {d.unit})
                    </h4>
                    <p className="text-xs text-neutral-600">
                      Driver: {d.driverName || "Ramesh Kumar"} (ETA ~20m)
                    </p>
                  </div>
                </div>

                {/* Delivery OTP Display */}
                <div className="text-left sm:text-right bg-white p-3 rounded-2xl border border-emerald-300 shadow-2xs">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Give this Delivery OTP to Driver
                  </div>
                  <div className="font-mono text-3xl font-black tracking-widest text-brand-800">
                    {d.deliveryOtp}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quality Report Dialog */}
      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Report Food Quality Issue"
        description="Submit safety or hygiene concerns within 12 hours of delivery."
      >
        <div className="space-y-4 pt-2">
          <textarea
            rows={3}
            placeholder="Describe the issue (e.g. food odor, temperature, packaging damage)..."
            className="w-full text-xs p-3 rounded-2xl border border-neutral-200 bg-surface-subtle focus:bg-white focus:outline-none focus:border-brand-700"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsReportOpen(false);
                toast({
                  type: "info",
                  title: "Report Submitted",
                  message: "Our safety team has logged this report for audit.",
                });
              }}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}