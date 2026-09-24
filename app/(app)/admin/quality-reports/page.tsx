"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface Report {
  id: string;
  donationId: string;
  donorName: string;
  shelterName: string;
  issueDescription: string;
  reportedAt: string;
  status: "OPEN" | "UPHELD" | "DISMISSED";
  penaltyPoints: number;
}

export default function QualityReportsAdminPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: "REP-102",
      donationId: "DN1019",
      donorName: "Grand Haveli Banquets",
      shelterName: "Balika Ashram, Jaipur",
      issueDescription: "Food arrived at room temperature beyond 4-hour window; slight sour smell detected.",
      reportedAt: "2026-09-24T14:30:00Z",
      status: "OPEN",
      penaltyPoints: 200,
    },
    {
      id: "REP-101",
      donationId: "DN1015",
      donorName: "Amber Road Palace",
      shelterName: "Hope Shelter",
      issueDescription: "Non-vegetarian gravy was mistakenly mixed in vegetarian container label.",
      reportedAt: "2026-09-22T21:15:00Z",
      status: "UPHELD",
      penaltyPoints: 300,
    },
  ]);

  const handleAction = (id: string, action: "UPHELD" | "DISMISSED") => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    toast({
      type: action === "UPHELD" ? "error" : "info",
      title: `Report ${action}`,
      message:
        action === "UPHELD"
          ? "Report upheld. Donor penalized and trust rating adjusted."
          : "Report dismissed as non-compliance false alarm.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>FSSAI Compliance & Dispute Resolution</span>
        </div>
        <h1 className="text-3xl font-black text-brand-800 tracking-tight">
          Food Safety Quality Reports
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl">
          Shelter feedback queue. Review reported food temperature, contamination, or labelling errors.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            padding="lg"
            className="border-neutral-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-neutral-900">
                  {report.id}
                </span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs font-bold text-brand-800">
                  Batch #{report.donationId}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  report.status === "OPEN"
                    ? "bg-amber-100 text-amber-900"
                    : report.status === "UPHELD"
                    ? "bg-red-100 text-red-900"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {report.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-neutral-600">
                Reported by: <span className="font-bold text-neutral-900">{report.shelterName}</span> against{" "}
                <span className="font-bold text-neutral-900">{report.donorName}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-subtle text-neutral-800 italic leading-relaxed border border-neutral-100">
                "{report.issueDescription}"
              </div>
            </div>

            {report.status === "OPEN" && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-red-600">
                  Impact if Upheld: -{report.penaltyPoints} Points & Warning
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(report.id, "DISMISSED")}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAction(report.id, "UPHELD")}
                  >
                    Uphold Violation
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}