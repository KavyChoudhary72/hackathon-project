"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Clock,
  MapPin,
  Phone,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/Badge";
import { Sheet } from "@/components/ui/Sheet";
import { Stepper } from "@/components/ui/Stepper";
import { apiClient } from "@/lib/api/client";
import { Deal } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";

export default function RescueDealsPage() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [claimQty, setClaimQty] = useState(2);
  const [claimOtp, setClaimOtp] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getDeals().then(setDeals);
  }, []);

  const handleOpenClaim = (deal: Deal) => {
    setSelectedDeal(deal);
    setClaimQty(1);
    setClaimOtp(null);
  };

  const handleConfirmClaim = () => {
    if (!selectedDeal) return;
    const res = apiClient.claimDeal(selectedDeal.id, claimQty);
    if (res.then) {
      res.then(({ success, otp }) => {
        if (success) {
          setClaimOtp(otp);
          toast({
            type: "success",
            title: "Rescue Deal Claimed!",
            message: `Pickup code: ${otp}. Pay ₹${selectedDeal.dealPrice * claimQty} at pickup.`,
          });
        }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>Tier 2: Hyperlocal Surplus Marketplace</span>
        </div>
        <h1 className="text-3xl font-black text-brand-800 tracking-tight">
          Rescue Deals (₹30 - ₹50)
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl">
          Discounted fresh meal boxes from banquet hotels for students and budget-conscious residents. Self-pickup only.
        </p>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Card
            key={deal.id}
            padding="none"
            className="overflow-hidden flex flex-col justify-between border-neutral-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
          >
            <div>
              {/* Photo & Pricing */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.foodTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs font-black text-xs text-brand-800 shadow-sm">
                    ₹{deal.dealPrice}{" "}
                    <span className="line-through text-neutral-400 font-normal ml-1">
                      ₹{deal.originalPrice}
                    </span>
                  </span>
                  <TierBadge tier={2} />
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {deal.donorName}
                </div>
                <h3 className="text-base font-bold text-neutral-900 leading-snug">
                  {deal.foodTitle}
                </h3>

                <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{deal.pickupAddress} ({deal.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Collect by 11:30 PM (Tonight)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button
                size="lg"
                variant="primary"
                onClick={() => handleOpenClaim(deal)}
                className="w-full text-xs"
              >
                Claim Deal ({deal.quantityRemaining} remaining)
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Claim Bottom Sheet */}
      <Sheet
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title={claimOtp ? "Voucher Generated!" : "Claim Rescue Deal"}
      >
        {selectedDeal && !claimOtp && (
          <div className="space-y-5 pb-6">
            <div className="p-4 rounded-2xl bg-surface-subtle flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  {selectedDeal.foodTitle}
                </h4>
                <p className="text-xs text-neutral-500">{selectedDeal.donorName}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-brand-800">
                  ₹{selectedDeal.dealPrice * claimQty}
                </div>
                <div className="text-[10px] text-neutral-400">Pay at pickup</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700">
                Number of Portions (Max 5):
              </span>
              <Stepper
                value={claimQty}
                onChange={setClaimQty}
                min={1}
                max={5}
                unit="boxes"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Self-pickup only. Please bring your own container or tote bag to promote zero single-use plastic waste.
              </span>
            </div>

            <Button
              size="xl"
              variant="primary"
              onClick={handleConfirmClaim}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Confirm Voucher Claim
            </Button>
          </div>
        )}

        {claimOtp && selectedDeal && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">
                Voucher #{claimOtp}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Show this 4-digit OTP to the donor at {selectedDeal.pickupAddress}. Pay ₹{selectedDeal.dealPrice * claimQty} upon collection.
              </p>
            </div>
            <div className="p-4 rounded-3xl bg-brand-900 text-accent-400 font-mono text-4xl font-black tracking-widest max-w-xs mx-auto">
              {claimOtp}
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setSelectedDeal(null)}
              className="mt-4"
            >
              Done
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}