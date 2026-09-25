"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  ShieldCheck,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  Filter,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiClient } from "@/lib/api/client";
import { OrganizationVerification } from "@/lib/api/types";
import { useToast } from "@/components/ui/Toast";
import { eventBus } from "@/lib/ws/eventBus";

export default function AdminVerificationsPage() {
  const { locale } = useI18n();
  const { toast } = useToast();
  const isHi = locale === "hi";

  const [orgs, setOrgs] = useState<OrganizationVerification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "DONOR" | "SHELTER">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING_REVIEW" | "SUSPENDED">("ALL");
  const [selectedOrg, setSelectedOrg] = useState<OrganizationVerification | null>(null);

  const loadData = async () => {
    try {
      const list = await apiClient.getVerifications();
      setOrgs(list);
      if (list.length > 0 && !selectedOrg) {
        setSelectedOrg(list[0]);
      }
    } catch (err) {
      console.error("Failed to load verifications:", err);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = eventBus.on("verification:updated", () => loadData());
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "VERIFIED" | "PENDING_REVIEW" | "SUSPENDED"
  ) => {
    const success = await apiClient.updateVerification(id, newStatus);
    if (success) {
      const org = orgs.find((o) => o.id === id);
      toast({
        type: newStatus === "VERIFIED" ? "success" : newStatus === "SUSPENDED" ? "error" : "info",
        title: `Organization ${newStatus}`,
        message: `${org?.name || id} is now marked as ${newStatus.replace("_", " ")}.`,
      });
      await loadData();
      const updated = (await apiClient.getVerifications()).find((o) => o.id === id);
      if (updated) setSelectedOrg(updated);
    }
  };

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.fssaiNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || org.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || org.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: OrganizationVerification["status"]) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isHi ? "सत्यापित" : "VERIFIED"}
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="ui-chip bg-[#FEF3C7] text-[#B45309] text-[12px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isHi ? "समीक्षा लंबित" : "PENDING REVIEW"}
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="ui-chip bg-[#FEE2E2] text-[#DC2626] text-[12px] font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {isHi ? "निलंबित" : "SUSPENDED"}
          </span>
        );
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
            {isHi ? "दाता एवं आश्रय सत्यापन हब" : "Donor & Shelter Verifications"}
          </h1>
          <span className="text-[15px] text-[#5B6661]">
            {isHi
              ? "FSSAI लाइसेंस, खाद्य सुरक्षा अनुपालन स्कोर, और व्यावसायिक संस्थागत पंजीकरण का प्रबंधन करें।"
              : "Govern FSSAI food hygiene compliance, verify NGO shelters, and manage commercial partners."}
          </span>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5B6661] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHi ? "संस्था या FSSAI खोजें..." : "Search name or FSSAI..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ui-input pl-9.5 py-2 text-[13px] w-full"
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F6F5F1] p-2 rounded-2xl border border-[#ECE9E1]">
        {/* Type Filter */}
        <div className="flex items-center gap-1">
          {(["ALL", "DONOR", "SHELTER"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-[#0E3B2E] text-white shadow-2xs"
                  : "text-[#5B6661] hover:text-[#13231C]"
              }`}
            >
              {t === "ALL" ? (isHi ? "सभी प्रकार" : "All Types") : t === "DONOR" ? (isHi ? "होटल दाता" : "Donors") : (isHi ? "आश्रय / NGO" : "Shelters")}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {(["ALL", "VERIFIED", "PENDING_REVIEW", "SUSPENDED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-white text-[#0E3B2E] border border-[#ECE9E1] shadow-2xs"
                  : "text-[#5B6661] hover:text-[#13231C]"
              }`}
            >
              {s === "ALL"
                ? (isHi ? "सभी स्थिति" : "All Status")
                : s === "VERIFIED"
                ? (isHi ? "सत्यापित" : "Verified")
                : s === "PENDING_REVIEW"
                ? (isHi ? "लंबित" : "Pending")
                : (isHi ? "निलंबित" : "Suspended")}
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: ORG LIST & ORG DETAIL AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ORG LIST (5 of 12) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[14px] font-bold text-[#13231C] px-1 flex items-center justify-between">
            <span>{isHi ? "पंजीकृत संगठन" : "Registered Organizations"} ({filteredOrgs.length})</span>
          </span>

          <div className="flex flex-col gap-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredOrgs.map((org) => {
              const isSelected = selectedOrg?.id === org.id;
              return (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`ui-card p-4 flex flex-col gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "border-[#1E9E5A] bg-[#F7FCF9] ring-2 ring-[#1E9E5A]/20 shadow-xs"
                      : "hover:border-[#CDE8D7]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="ui-chip bg-gray-100 text-gray-700 text-[11px] font-bold uppercase">
                          {org.type}
                        </span>
                        {getStatusBadge(org.status)}
                      </div>
                      <span className="font-outfit text-[16px] font-bold text-[#13231C] mt-1">
                        {org.name}
                      </span>
                    </div>

                    <span className="text-[13px] font-extrabold text-[#1E9E5A] bg-[#E3F5EA] px-2 py-0.5 rounded-lg flex-shrink-0">
                      {org.safetyScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#5B6661] border-t border-[#ECE9E1] pt-2">
                    <span className="font-mono">{org.fssaiNumber}</span>
                    <span>{org.capacityOrSurplus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORG DETAIL AUDIT PANEL (7 of 12) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {selectedOrg ? (
            <div className="ui-card p-6 flex flex-col gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              {/* TOP ROW */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ECE9E1] pb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="ui-chip bg-gray-100 text-gray-800 text-[12px] font-extrabold uppercase">
                      {selectedOrg.type}
                    </span>
                    {getStatusBadge(selectedOrg.status)}
                  </div>
                  <h2 className="font-outfit text-[22px] font-extrabold text-[#0E3B2E]">
                    {selectedOrg.name}
                  </h2>
                </div>

                {/* GOVERNANCE ACTIONS */}
                <div className="flex items-center gap-2">
                  {selectedOrg.status !== "VERIFIED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrg.id, "VERIFIED")}
                      className="px-3.5 py-2 bg-[#E3F5EA] border border-[#C2DEC8] hover:border-[#1E9E5A] text-[#166534] rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1E9E5A]" />
                      <span>{isHi ? "सत्यापित करें" : "Approve & Verify"}</span>
                    </button>
                  )}

                  {selectedOrg.status !== "SUSPENDED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrg.id, "SUSPENDED")}
                      className="px-3.5 py-2 bg-[#FEE2E2] border border-[#FECACA] hover:border-[#DC2626] text-[#DC2626] rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                      <span>{isHi ? "निलंबित करें" : "Suspend Partner"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* STATS TILES */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F6F5F1] p-4 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "FSSAI / FCRA संख्या" : "License Reg #"}</span>
                  <span className="font-mono font-bold text-[#13231C] text-[14px]">
                    {selectedOrg.fssaiNumber}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "सुरक्षा अनुपालन स्कोर" : "Safety Compliance"}</span>
                  <span className="font-bold text-[#1E9E5A] text-[16px]">
                    {selectedOrg.safetyScore} / 100
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] text-[#5B6661]">{isHi ? "पंजीकरण तिथि" : "Registered On"}</span>
                  <span className="font-bold text-[#13231C] text-[14px]">
                    {selectedOrg.registeredAt}
                  </span>
                </div>
              </div>

              {/* CONTACT & LOCATION */}
              <div className="flex flex-col gap-3">
                <span className="font-outfit text-[17px] font-bold text-[#13231C]">
                  {isHi ? "संपर्क एवं स्थान विवरण" : "Contact & Facility Details"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div className="p-3.5 border border-[#ECE9E1] rounded-xl flex flex-col gap-1">
                    <span className="text-[#5B6661]">{isHi ? "अधिकृत संपर्क अधिकारी" : "Authorized Person"}</span>
                    <span className="font-bold text-[#13231C]">{selectedOrg.contactPerson}</span>
                    <span className="text-[#1E9E5A] font-semibold">{selectedOrg.phone}</span>
                  </div>

                  <div className="p-3.5 border border-[#ECE9E1] rounded-xl flex flex-col gap-1">
                    <span className="text-[#5B6661]">{isHi ? "सुविधा पता" : "Facility Address"}</span>
                    <span className="font-bold text-[#13231C] leading-snug">{selectedOrg.address}</span>
                  </div>
                </div>
              </div>

              {/* AUDIT NOTES */}
              {selectedOrg.notes && (
                <div className="p-4 bg-[#FFF9EC] border border-[#F3E6C6] rounded-2xl flex flex-col gap-1 text-[13px]">
                  <span className="font-bold text-[#B45309] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#E89B1C]" />
                    {isHi ? "ऑडिट एवं निरीक्षण टिप्पणियां" : "Inspector Audit & Verification Notes"}
                  </span>
                  <span className="text-[#7A3A1C]">{selectedOrg.notes}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="ui-card p-12 text-center text-[#5B6661]">
              Select an organization to view detailed verification records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
