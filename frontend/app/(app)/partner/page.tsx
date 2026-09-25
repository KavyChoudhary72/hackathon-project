"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Recycle,
  Building2,
  CheckCircle2,
  ArrowRight,
  Truck,
  Leaf,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { DiversionOffer } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";

export default function PartnerDiversionPage() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<DiversionOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<DiversionOffer | null>(null);
  const [actualKg, setActualKg] = useState(250);

  const loadData = async () => {
    const list = await apiClient.getDiversions();
    setOffers(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async () => {
    if (!selectedOffer) return;
    await apiClient.completeDiversion(selectedOffer.id, actualKg);
    toast({
      type: "success",
      title: "Diversion Completed",
      message: `Verified receipt of ${actualKg} kg for bio-energy conversion.`,
    });
    setSelectedOffer(null);
    loadData();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER: Breadcrumb + Title + Live Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/impact"
            className="text-[14px] font-semibold text-[#5B6661] hover:text-[#0E3B2E]"
          >
            City Ops / Tier 3 Diversion
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
              Tier 3: Biogas &amp; Animal Feed
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F7EE] border border-[#BDECD2] text-[12px] font-extrabold text-[#166534]">
              <Recycle className="w-3.5 h-3.5 text-[#1E9E5A]" />
              <span>Zero-Landfill Protocol</span>
            </span>
          </div>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            Non-human consumption surplus routed to certified gaushalas (गौशाला) and municipal anaerobic bio-digesters.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-[#ECE9E1] text-[13px] font-bold text-[#13231C] shadow-2xs">
            <Scale className="w-4 h-4 text-[#1E9E5A]" />
            <span>Honest Separated KG Ledger</span>
          </span>
        </div>
      </div>

      {/* 3 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#8B5E34] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Gaushala Fodder Diverted</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            640 kg
          </span>
          <span className="text-[11px] text-[#8B5E34] font-bold">Hingonia & Pinjrapol Gaushala</span>
        </div>

        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#1E9E5A] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Biogas Methane Generation</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            982 kg
          </span>
          <span className="text-[11px] text-[#1E9E5A] font-bold">Jaipur Municipal Bio-Digester</span>
        </div>

        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#0E3B2E] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Total Landfill Avoided</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            1,622 kg
          </span>
          <span className="text-[11px] text-[#5B6661]">4,055 kg CO₂e offset</span>
        </div>
      </div>

      {/* OFFERS LIST */}
      <div className="flex flex-col gap-4">
        {offers.map((offer) => {
          const isCompleted = offer.status === "COMPLETED";

          return (
            <div
              key={offer.id}
              className="ui-card p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#ECE9E1]"
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-[#8B5E34] text-white">
                    TIER 3 DIVERSION
                  </span>
                  <span className="text-[12px] font-bold text-[#8B5E34] bg-[#F9F5F0] border border-[#E8DEC9] px-2.5 py-0.5 rounded-full">
                    {offer.partnerType === "GAUSHALA" ? "🐄 Gaushala Cattle Fodder" : "⚡ Bio-Digester Methane"}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-[#E3F5EA] text-[#166534]"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <h3 className="font-outfit text-[20px] font-bold text-[#13231C]">
                  {offer.foodType}
                </h3>
                <p className="text-[13px] text-[#5B6661]">
                  Origin: <strong className="text-[#13231C]">{offer.donorName}</strong> · Pickup Point: {offer.pickupAddress}
                </p>

                <div className="text-[13px] font-mono font-bold text-[#0E3B2E] bg-[#F6F5F1] px-3 py-1.5 rounded-xl self-start border border-[#ECE9E1]">
                  Estimated Weight: {offer.estimatedKg} KG{" "}
                  {offer.actualKg && (
                    <span className="text-[#1E9E5A] ml-2">
                      (Scale Verified: {offer.actualKg} KG)
                    </span>
                  )}
                </div>
              </div>

              {!isCompleted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setActualKg(offer.estimatedKg);
                  }}
                  className="btn-primary h-11 px-5 text-[14px] font-bold self-start sm:self-center"
                >
                  <Scale className="w-4 h-4" />
                  <span>Verify Weighbridge KG</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#166534] bg-[#EEF8F1] px-4 py-2 rounded-xl border border-[#BDECD2] self-start sm:self-center">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E5A]" />
                  <span>Weighed &amp; Diverted</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#ECE9E1] flex flex-col gap-4">
            <h3 className="font-outfit text-2xl font-bold text-[#0E3B2E]">
              Verify Actual Diversion Weight
            </h3>
            <p className="text-[13px] text-[#5B6661]">
              Enter the gross net weight received from weighbridge or digital scale for batch <strong>{selectedOffer.foodType}</strong>.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#13231C]">
                Net Weight Received (KG):
              </label>
              <input
                type="number"
                value={actualKg}
                onChange={(e) => setActualKg(Number(e.target.value))}
                className="h-12 border border-[#DCD9D0] rounded-xl px-4 text-[16px] font-bold text-[#13231C] outline-none focus:border-[#0E3B2E]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="btn-secondary flex-1 h-11 text-[13px] font-bold justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="btn-primary flex-1 h-11 text-[13px] font-bold justify-center"
              >
                Confirm Weigh Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}