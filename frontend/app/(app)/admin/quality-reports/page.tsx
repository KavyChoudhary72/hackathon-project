"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  Scale,
  Sparkles,
  ThermometerSnowflake,
  PackageX,
  FileText,
  AlertOctagon,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface QualityReportItem {
  id: string;
  donationId: string;
  donorName: string;
  donorLocation: string;
  shelterName: string;
  violationType: "TEMPERATURE_BREACH" | "PACKAGING_COMPROMISE" | "MISLABELING" | "SPOILAGE";
  issueDescription: string;
  reportedAt: string;
  status: "OPEN" | "UPHELD" | "DISMISSED";
  penaltyPoints: number;
  foodType: string;
}

export default function QualityReportsAdminPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<QualityReportItem[]>([
    {
      id: "FSSAI-REP-102",
      donationId: "DN1019",
      donorName: "Grand Haveli Banquets",
      donorLocation: "Tonk Road, Jaipur",
      shelterName: "Balika Ashram, Jaipur",
      violationType: "TEMPERATURE_BREACH",
      foodType: "Paneer Butter Masala & Naan (80 Meals)",
      issueDescription: "Food arrived at room temperature beyond 4-hour safety window; sour smell detected during shelter intake testing.",
      reportedAt: "Today, 10:45 PM",
      status: "OPEN",
      penaltyPoints: 200,
    },
    {
      id: "FSSAI-REP-101",
      donationId: "DN1015",
      donorName: "Amber Road Palace Banquet",
      donorLocation: "Amer Road, Jaipur",
      shelterName: "Mother Teresa Home Jaipur",
      violationType: "MISLABELING",
      foodType: "Buffet Gravies & Breads",
      issueDescription: "Non-vegetarian chicken gravy was mistakenly labeled under vegetarian container barcode.",
      reportedAt: "Yesterday, 09:15 PM",
      status: "UPHELD",
      penaltyPoints: 300,
    },
    {
      id: "FSSAI-REP-099",
      donationId: "DN1008",
      donorName: "Jaipur Highway Food Plaza",
      donorLocation: "NH-48, Jaipur",
      shelterName: "Akshaya Patra Foundation",
      violationType: "PACKAGING_COMPROMISE",
      foodType: "Assorted Parathas (40 Meals)",
      issueDescription: "Casserole seal was torn during transit; driver vehicle lacked standard insulated food crate.",
      reportedAt: "2 days ago",
      status: "DISMISSED",
      penaltyPoints: 100,
    },
  ]);

  const handleAction = (id: string, action: "UPHELD" | "DISMISSED") => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    toast({
      type: action === "UPHELD" ? "error" : "info",
      title: `Dispute Resolution: ${action}`,
      message:
        action === "UPHELD"
          ? "Report upheld. Donor penalized -200 Trust Points and flagged for FSSAI inspection."
          : "Report dismissed as false alarm after coordinator review.",
    });
  };

  const openCount = reports.filter((r) => r.status === "OPEN").length;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER: Breadcrumb + Title + Active Reports Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/impact"
            className="text-[14px] font-semibold text-[#5B6661] hover:text-[#0E3B2E]"
          >
            City Ops Command / Food Safety
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
              FSSAI Quality &amp; Disputes
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-[12px] font-extrabold text-rose-900">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>{openCount} Pending Disputes</span>
            </span>
          </div>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            Official shelter dispute arbitration queue. Review reported food temperature breaches and label non-compliance.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-[#ECE9E1] text-[13px] font-bold text-[#13231C] shadow-2xs">
            <Scale className="w-4 h-4 text-[#0E3B2E]" />
            <span>FSSAI Guideline 2026</span>
          </span>
        </div>
      </div>

      {/* 3 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-rose-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Open Disputes</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            {openCount}
          </span>
          <span className="text-[11px] text-rose-700 font-bold">Requires Admin Decision</span>
        </div>

        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#0E3B2E] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Verified Safe Rescues</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            98.8%
          </span>
          <span className="text-[11px] text-[#1E9E5A] font-bold">Safe Consumption Compliance</span>
        </div>

        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-amber-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">Trust Score Deductions</span>
          <span className="font-outfit text-[32px] font-extrabold text-[#13231C]">
            -500 pts
          </span>
          <span className="text-[11px] text-[#5B6661]">Assigned to non-compliant donors</span>
        </div>
      </div>

      {/* DISPUTE REPORTS LIST */}
      <div className="flex flex-col gap-4">
        {reports.map((report) => {
          const isOpen = report.status === "OPEN";
          const isUpheld = report.status === "UPHELD";

          return (
            <div
              key={report.id}
              className={`ui-card p-6 sm:p-7 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border transition-all ${
                isOpen
                  ? "border-rose-200 bg-white"
                  : "border-[#ECE9E1] bg-[#FDFCFB]"
              }`}
            >
              {/* Card Header: IDs & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EEE8]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[13px] font-extrabold text-[#0E3B2E] bg-[#EEF8F1] px-2.5 py-1 rounded-md border border-[#BDECD2]">
                    {report.id}
                  </span>
                  <span className="text-[13px] text-[#5B6661]">·</span>
                  <span className="text-[14px] font-bold text-[#13231C]">
                    Batch #{report.donationId}
                  </span>
                  <span className="text-[13px] text-[#5B6661]">·</span>
                  <span className="text-[13px] font-semibold text-[#5B6661]">
                    {report.foodType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[12px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isOpen
                        ? "bg-rose-100 text-rose-900 border border-rose-300"
                        : isUpheld
                        ? "bg-red-100 text-red-900"
                        : "bg-[#F1F0EB] text-[#5B6661]"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Reported Parties & Violation Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5B6661] text-[11px] uppercase font-extrabold tracking-wider">
                    Donor Accused
                  </span>
                  <span className="font-bold text-[#13231C]">
                    {report.donorName}
                  </span>
                  <span className="text-[11px] text-[#5B6661]">
                    {report.donorLocation}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5B6661] text-[11px] uppercase font-extrabold tracking-wider">
                    Shelter Reporting
                  </span>
                  <span className="font-bold text-[#13231C]">
                    {report.shelterName}
                  </span>
                  <span className="text-[11px] text-[#5B6661]">
                    {report.reportedAt}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5B6661] text-[11px] uppercase font-extrabold tracking-wider">
                    Violation Type
                  </span>
                  <span className="font-bold text-rose-900 flex items-center gap-1">
                    {report.violationType === "TEMPERATURE_BREACH" && (
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {report.violationType === "MISLABELING" && (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {report.violationType === "PACKAGING_COMPROMISE" && (
                      <PackageX className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{report.violationType.replace("_", " ")}</span>
                  </span>
                  <span className="text-[11px] text-rose-700 font-bold">
                    -{report.penaltyPoints} Trust Points
                  </span>
                </div>
              </div>

              {/* Coordinator Statement Box */}
              <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#FDE3B8] text-[#7A4A06] text-[13px] leading-relaxed flex flex-col gap-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#7A4A06]">
                  Shelter Coordinator On-Site Observation:
                </span>
                <p className="italic font-medium">
                  "{report.issueDescription}"
                </p>
              </div>

              {/* Action Buttons for Super Admin */}
              {isOpen && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#F0EEE8]">
                  <span className="text-[12px] font-bold text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Upholding will dock donor points and enforce mandatory cold-chain compliance.</span>
                  </span>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleAction(report.id, "DISMISSED")}
                      className="btn-secondary h-10 px-4 text-[13px] font-bold flex-1 sm:flex-initial justify-center"
                    >
                      <XCircle className="w-4 h-4 text-[#5B6661]" />
                      <span>Dismiss Dispute</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(report.id, "UPHELD")}
                      className="h-10 px-5 rounded-[14px] bg-rose-700 hover:bg-rose-800 text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-initial transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Uphold &amp; Penalize Donor</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}