"use client";

import React, { useState, useEffect } from "react";
import {
  Recycle,
  Building2,
  CheckCircle2,
  ArrowRight,
  Truck,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-900 text-xs font-bold mb-2">
          <Recycle className="w-3.5 h-3.5 text-stone-700" />
          <span>Tier 3: Industrial & Agricultural Diversion</span>
        </div>
        <h1 className="text-3xl font-black text-brand-800 tracking-tight">
          Gaushala & Bio-Digester Portal
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl">
          Non-human consumption surplus routed to certified cattle shelters (गौशाला) and municipal anaerobic bio-gas digesters.
        </p>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            padding="lg"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-neutral-200 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TierBadge tier={3} />
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {offer.partnerType === "GAUSHALA" ? "🐄 Gaushala Fodder" : "⚡ Biogas Methane"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    offer.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {offer.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900">
                {offer.foodType}
              </h3>
              <p className="text-xs text-neutral-500">
                Source: <span className="font-semibold text-neutral-800">{offer.donorName}</span> · Pickup: {offer.pickupAddress}
              </p>

              <div className="text-xs font-mono font-bold text-brand-800">
                Estimated Weight: {offer.estimatedKg} KG{" "}
                {offer.actualKg && (
                  <span className="text-emerald-700 font-semibold ml-2">
                    (Verified: {offer.actualKg} KG)
                  </span>
                )}
              </div>
            </div>

            {offer.status !== "COMPLETED" ? (
              <Button
                size="md"
                variant="primary"
                onClick={() => {
                  setSelectedOffer(offer);
                  setActualKg(offer.estimatedKg);
                }}
              >
                Mark Received & Verify KG
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Weighed & Diverted</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Verification Modal */}
      <Modal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        title="Verify Actual Diversion Weight"
        description="Enter the net weight received after weighbridge or scale verification."
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800">
              Net Weight Received (KG):
            </label>
            <input
              type="number"
              value={actualKg}
              onChange={(e) => setActualKg(Number(e.target.value))}
              className="w-full text-base font-bold p-3 rounded-2xl border border-neutral-300 bg-surface-subtle focus:bg-white focus:border-brand-800 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setSelectedOffer(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleComplete}>
              Confirm Weigh Receipt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}