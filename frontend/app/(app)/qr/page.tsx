"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Smartphone, ExternalLink, QrCode } from "lucide-react";

export default function PresentationQrPage() {
  const [liveUrl, setLiveUrl] = useState("https://foodlink-jaipur.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLiveUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 text-center space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
          <span>Final Pitch Slide Presentation Mode</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-800 tracking-tight">
          Scan to Test on Your Phone
        </h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
          Test the entire sub-60-second surplus food dispatch, live cascade, and instant OTP verification in real time.
        </p>
      </div>

      {/* Large QR Display Card */}
      <Card padding="xl" className="max-w-md mx-auto p-8 bg-white border-2 border-brand-800 shadow-float flex flex-col items-center">
        <div className="p-4 bg-white rounded-3xl border border-neutral-100 shadow-sm mb-4">
          <QRCodeSVG
            value={liveUrl}
            size={260}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="space-y-1 text-center">
          <div className="font-mono font-bold text-xs text-brand-900 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200 inline-block">
            {liveUrl}
          </div>
          <p className="text-[11px] text-neutral-400 mt-2">
            Optimized for low-end mobile devices & Slow 3G
          </p>
        </div>
      </Card>

      {/* Quick Judge Points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto text-xs">
        <div className="p-4 rounded-2xl bg-surface-subtle border border-neutral-200">
          <div className="font-bold text-neutral-900 mb-1">⚡ &lt;60s Post Form</div>
          <div className="text-neutral-500">
            One-thumb emergency donation for wedding halls and banquets.
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-subtle border border-neutral-200">
          <div className="font-bold text-neutral-900 mb-1">🔍 Explainable AI</div>
          <div className="text-neutral-500">
            Transparent scoring and filtered-out reasons shown live.
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-subtle border border-neutral-200">
          <div className="font-bold text-neutral-900 mb-1">🔒 Double OTP</div>
          <div className="text-neutral-500">
            Pickup and delivery cryptography preventing lost batches.
          </div>
        </div>
      </div>
    </div>
  );
}