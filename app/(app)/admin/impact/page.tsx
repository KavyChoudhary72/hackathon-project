"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  Award,
  Sparkles,
  Info,
  TrendingUp,
  Leaf,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiClient } from "@/lib/api/client";
import { ImpactData } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import jsPDF from "jspdf";

export default function ImpactCsrDashboardPage() {
  const { toast } = useToast();
  const { t } = useI18n();

  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [selectedDonor, setSelectedDonor] = useState("Vikas Mehta (ITC Rajputana)");

  useEffect(() => {
    apiClient.getImpact().then(setImpact);
  }, []);

  // Client-side PDF Certificate Generator
  const generatePdfCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Outer border & styling
    doc.setDrawColor(17, 58, 43); // #113A2B
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(249, 104, 58); // #F9683A
    doc.setLineWidth(1);
    doc.rect(13, 13, 271, 184);

    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(17, 58, 43);
    doc.text("CERTIFICATE OF SUSTAINABLE IMPACT", 148.5, 45, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("PRESENTED IN RECOGNITION OF CORPORATE SOCIAL RESPONSIBILITY", 148.5, 55, {
      align: "center",
    });

    // Recipient Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(249, 104, 58);
    doc.text(selectedDonor, 148.5, 80, { align: "center" });

    // Impact description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(51, 65, 85);
    doc.text(
      "In official partnership with FoodLink Jaipur Redistribution Network,",
      148.5,
      98,
      { align: "center" }
    );
    doc.text(
      "this donor has successfully prevented surplus edible banquet food from landfill dumping,",
      148.5,
      106,
      { align: "center" }
    );
    doc.text(
      "achieving zero-waste compliance across Tier 1, Tier 2, and Tier 3 environmental cascades.",
      148.5,
      114,
      { align: "center" }
    );

    // KPI Box
    doc.setFillColor(232, 245, 233);
    doc.roundedRect(40, 126, 217, 30, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(17, 58, 43);
    doc.text("1,240 Verified Meals Rescued  ·  12.4 Tons CO2e Prevented", 148.5, 145, {
      align: "center",
    });

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 58, 43);
    doc.text("FoodLink Impact Registry", 65, 175);
    doc.text("Jaipur Municipal Food Safety", 205, 175);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Authorized Audit Signature", 65, 180);
    doc.text("Verification ID: FL-CSR-2026-9921", 205, 180);

    doc.save(`FoodLink_CSR_Certificate_${selectedDonor.replace(/\s+/g, "_")}.pdf`);

    toast({
      type: "success",
      title: "Certificate Generated",
      message: "Client-side PDF downloaded successfully.",
    });
  };

  // CSV Audit Export
  const exportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Donation_ID,Date,Donor_Name,Food_Dish,Quantity_Meals,Unit,Weight_KG,CO2e_Prevented_KG,Tier,Shelter_Name,Status\n" +
      "DN1024,2026-09-24,ITC Rajputana,Cooked Meals,30,meals,12.6,31.5,Tier 1,Hope Shelter,In Transit\n" +
      "DN1023,2026-09-18,ITC Rajputana,Bread & Buns,20,meals,8.4,21.0,Tier 1,Care Center,Delivered\n" +
      "DN1022,2026-09-15,ITC Rajputana,Rice & Lentils,24,meals,10.0,25.0,Tier 1,Hope Shelter,Delivered\n" +
      "DN1021,2026-09-12,ITC Rajputana,Seasonal Fruits,35,meals,15.0,37.5,Tier 1,Udaan Shelter,Delivered\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FoodLink_CSR_Raw_Audit_Log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: "info",
      title: "CSV Exported",
      message: "Raw ESG audit CSV downloaded.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
            <span>Audited ESG & CSR Reporting</span>
          </div>
          <h1 className="text-3xl font-black text-brand-800 tracking-tight">
            {t("impact.title", "Impact & CSR ESG Dashboard")}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t(
              "impact.subtitle",
              "Auditable, transparent metrics with standardized environmental factors"
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="md"
            variant="secondary"
            onClick={exportCsv}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
          >
            {t("impact.downloadCsv", "Export Raw CSV")}
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={generatePdfCertificate}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t("impact.downloadPdf", "Download CSR Certificate")}
          </Button>
        </div>
      </div>

      {/* FACTOR NOTE ALERT */}
      <div className="p-4 rounded-3xl bg-surface-subtle border border-neutral-200/80 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-brand-800 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-neutral-900 block mb-0.5">
            {t("impact.factorNoteTitle", "Environmental Factor Conversion Standards")}
          </span>
          <span className="text-neutral-600">
            {t(
              "impact.factorNoteBody",
              "1 Meal = 0.42 kg · 1 kg Food Waste Diverted = 2.5 kg CO₂e Prevented · Verified under World Food Programme & IPCC guidelines"
            )}
          </span>
        </div>
      </div>

      {/* 5-METRIC HONEST SPLIT GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <Card padding="md" className="space-y-2">
          <div className="text-xs font-semibold text-neutral-500">
            {t("impact.humanMeals", "Meals to Humans")}
          </div>
          <div className="text-2xl font-black text-brand-800">
            {impact?.humanMeals?.toLocaleString() || "25,420"}
          </div>
          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Tier 1: 100% Free
          </div>
        </Card>

        {/* Metric 2 */}
        <Card padding="md" className="space-y-2">
          <div className="text-xs font-semibold text-neutral-500">
            {t("impact.rescueMeals", "Rescue Deal Meals")}
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {impact?.rescueDealMeals?.toLocaleString() || "4,180"}
          </div>
          <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            Tier 2: ₹30-₹50 Deals
          </div>
        </Card>

        {/* Metric 3 */}
        <Card padding="md" className="space-y-2">
          <div className="text-xs font-semibold text-neutral-500">
            {t("impact.nonHumanKg", "Non-Human Diversion")}
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {impact?.nonHumanKg?.toLocaleString() || "7,850"}{" "}
            <span className="text-xs text-neutral-500">kg</span>
          </div>
          <div className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full inline-block">
            Tier 3: Gaushala/Biogas
          </div>
        </Card>

        {/* Metric 4 */}
        <Card padding="md" className="space-y-2">
          <div className="text-xs font-semibold text-neutral-500">
            {t("impact.totalDiverted", "Total Food Diverted")}
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {impact?.totalKgDiverted?.toLocaleString() || "18,520"}{" "}
            <span className="text-xs text-neutral-500">kg</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Zero Waste Rate: 99.4%
          </div>
        </Card>

        {/* Metric 5 */}
        <Card padding="md" className="space-y-2 col-span-2 sm:col-span-1 bg-brand-900 text-white border-brand-700">
          <div className="text-xs font-semibold text-brand-200">
            {t("impact.co2Prevented", "CO₂e Prevented")}
          </div>
          <div className="text-2xl font-black text-accent-400">
            {impact?.co2eKgPrevented?.toLocaleString() || "46,300"}{" "}
            <span className="text-xs text-brand-200">kg</span>
          </div>
          <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full inline-block">
            = 92,600 car km
          </div>
        </Card>
      </div>

      {/* LINE CHART & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Trend Chart */}
        <Card padding="lg" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Rescued Meals & Emission Avoidance (2026)
              </h3>
              <p className="text-xs text-neutral-500">
                Monthly trajectory across Jaipur banquet and hotel hubs
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>+24% Month-on-Month</span>
            </div>
          </div>

          {/* Stylized SVG Trend Graph */}
          <div className="h-60 w-full relative pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 160 Q 100 130 180 110 T 320 60 T 500 20 L 500 200 L 0 200 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0 160 Q 100 130 180 110 T 320 60 T 500 20"
                fill="none"
                stroke="#113A2B"
                strokeWidth="4"
              />
              {/* Highlight points */}
              <circle cx="180" cy="110" r="5" fill="#F9683A" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="320" cy="60" r="5" fill="#F9683A" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="20" r="6" fill="#113A2B" stroke="#FFFFFF" strokeWidth="3" />
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[11px] font-bold text-neutral-400 pt-2 border-t border-neutral-100">
              <span>May 2026</span>
              <span>Jun 2026</span>
              <span>Jul 2026</span>
              <span>Aug 2026</span>
              <span>Sep 2026 (Live)</span>
            </div>
          </div>
        </Card>

        {/* Right: Top Donors Leaderboard Preview */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">
              Top Impact Champions
            </h3>
            <span className="text-xs font-bold text-brand-800">Jaipur</span>
          </div>

          <div className="space-y-3">
            {[
              {
                rank: "1",
                name: "ITC Rajputana",
                meals: "4,520 meals",
                badge: "🥇",
              },
              {
                rank: "2",
                name: "Rambagh Palace",
                meals: "3,890 meals",
                badge: "🥈",
              },
              {
                rank: "3",
                name: "Chokhi Dhani Resort",
                meals: "3,110 meals",
                badge: "🥉",
              },
              {
                rank: "4",
                name: "Hotel Clarks Amer",
                meals: "2,400 meals",
                badge: "⭐",
              },
            ].map((donor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-surface-subtle border border-neutral-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{donor.badge}</span>
                  <div>
                    <div className="font-bold text-neutral-900">{donor.name}</div>
                    <div className="text-[11px] text-neutral-500">{donor.meals}</div>
                  </div>
                </div>
                <span className="font-black text-brand-800">#{donor.rank}</span>
              </div>
            ))}
          </div>

          {/* Donor Certificate Selector */}
          <div className="pt-3 border-t border-neutral-100 space-y-2">
            <label className="text-xs font-bold text-neutral-700">
              Select Donor for CSR Certificate:
            </label>
            <select
              value={selectedDonor}
              onChange={(e) => setSelectedDonor(e.target.value)}
              className="w-full text-xs p-2.5 rounded-2xl bg-white border border-neutral-200 text-neutral-800 font-medium focus:outline-none focus:border-brand-800"
            >
              <option value="Vikas Mehta (ITC Rajputana)">
                Vikas Mehta (ITC Rajputana)
              </option>
              <option value="Rambagh Palace Jaipur">Rambagh Palace Jaipur</option>
              <option value="Chokhi Dhani Resort">Chokhi Dhani Resort</option>
              <option value="Hotel Clarks Amer">Hotel Clarks Amer</option>
            </select>
          </div>
        </Card>
      </div>
    </div>
  );
}