"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, Receipt, CheckCircle2, TrendingUp, Calendar, MapPin, Award, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CSRInvoiceModal, CSR_DONORS } from "@/components/donor/CSRInvoiceModal";
import Link from "next/link";

export default function ImpactAndReportsPage() {
  const { locale } = useI18n();
  const [selectedDonor, setSelectedDonor] = useState("Hotel Clarks Amer Jaipur");
  const [selectedPeriod, setSelectedPeriod] = useState("1 Sep – 25 Sep 2026");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const isHi = locale === "hi";

  const handleDownloadInvoicePDF = () => {
    setIsInvoiceOpen(true);
  };

  const handleExportCSV = () => {
    const donor = CSR_DONORS.find((d) => d.name === selectedDonor) || CSR_DONORS[0];
    const grossVal = donor.meals * donor.ratePerMeal;
    const co2Kg = (donor.weightKg * 2.5).toFixed(1);

    const csvContent = `data:text/csv;charset=utf-8,Invoice No,Date,Donor Name,Category,GSTIN,FSSAI License,Meals Rescued,Kg Diverted,Fair In-Kind Value (INR),80G Tax Exemption (INR),CO2e Offset (kg),Verification Status\n"${donor.invoiceId}","25-Sep-2026","${donor.name}","${donor.type}","${donor.gstin}","${donor.fssai}",${donor.meals},${donor.weightKg.toFixed(1)},${grossVal.toFixed(2)},${grossVal.toFixed(2)},${co2Kg},"100%_VERIFIED_80G_AUDIT"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `csr-tax-invoice-${donor.invoiceId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* CSR TAX INVOICE MODAL */}
      <CSRInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        defaultDonorName={selectedDonor}
        defaultPeriod={selectedPeriod}
      />

      {/* HEADER: Title + Subtitle + Live Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            {isHi ? "सीएसआर टैक्स इनवॉइस एवं प्रभाव रिपोर्ट" : "CSR Tax Invoices & Impact"}
          </h1>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            {isHi
              ? "धारा 80G एवं कंपनी अधिनियम अनुसूची VII के तहत ऑडिट-सत्यापित सीएसआर इनवॉइस और लाइव आंकड़े।"
              : "Audit-verified Section 80G CSR Tax Invoices & live meal ledger for Jaipur."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedDonor("Hotel Clarks Amer Jaipur");
              setIsInvoiceOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#0E3B2E] hover:bg-[#165c48] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-[#F5B82E]" />
            <span>{isHi ? "सीएसआर इनवॉइस जनरेटर" : "Generate CSR Invoice"}</span>
          </button>

          <Link
            href="/certificate"
            className="px-4 py-2 rounded-xl bg-[#E3F5EA] hover:bg-[#D1F0DC] text-[#0E3B2E] text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Award className="w-4 h-4 text-[#1E9E5A]" />
            <span>{isHi ? "प्रमाण पत्र" : "Certificates"}</span>
          </Link>

          <span className="ui-chip bg-[#DCF5E4] text-[#166534] h-9 text-[14px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1E9E5A] animate-pulse" />
            <span>{isHi ? "लाइव" : "Live"}</span>
          </span>
        </div>
      </div>

      {/* 5 METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Meals to people */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#1E9E5A] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            {isHi ? "लोगों तक भोजन" : "Meals to people"}
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            3,480
          </span>
        </div>

        {/* Rescue deal meals */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#E89B1C] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            {isHi ? "रेस्क्यू डील भोजन" : "Rescue deal meals"}
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            212
          </span>
        </div>

        {/* Animals & biogas */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#8B5E34] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            {isHi ? "गौशाला एवं बायोगैस" : "Animals & biogas"}
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            146 kg
          </span>
        </div>

        {/* Total food diverted (Dark green card) */}
        <div className="ui-card p-5 flex flex-col gap-1 bg-[#0E3B2E] border-[#0E3B2E] text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#C9DDD3]">
            {isHi ? "कुल बचाया गया भोजन" : "Total food diverted"}
          </span>
          <span className="font-outfit text-[32px] font-bold text-white leading-tight">
            1,622 kg
          </span>
        </div>

        {/* CO2e avoided */}
        <div className="ui-card p-5 flex flex-col gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            {isHi ? "रोका गया कार्बन उत्सर्जन" : "CO₂e avoided"}
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            4,055 kg
          </span>
        </div>
      </div>

      {/* Math Note */}
      <span className="text-[13px] text-[#5B6661] -mt-2 leading-relaxed">
        {isHi
          ? "मान्यता: 1 भोजन ≈ 0.42 किग्रा एवं 2.5 किग्रा CO₂e प्रति किग्रा अपशिष्ट। धारा 80G के तहत इन-काइंड भोजन मूल्यांकन ₹40/भोजन है।"
          : "Standard valuation: ₹40.00/meal in-kind fair market value eligible for 80G tax exemption and CSR Schedule VII reporting."}
      </span>

      {/* 2-COLUMN MAIN CONTENT (7 of 12 Left, 5 of 12 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Chart + Top Donors (7 of 12 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Meals by Day Chart Mock */}
          <div className="ui-card p-6 flex flex-col gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
                {isHi ? "दैनिक भोजन बचाव रुझान" : "Meals rescued by day"}
              </h2>
              <span className="text-[13px] text-[#5B6661]">
                {isHi ? "गत 7 दिन" : "Past 7 days"}
              </span>
            </div>

            {/* 7 Vertical Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#F0EEE8]">
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "45%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "60%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "40%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "85%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "70%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#F2622E] rounded-t-md transition-all hover:opacity-80" style={{ height: "100%" }} />
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-[#1E9E5A] rounded-t-md transition-all hover:opacity-80" style={{ height: "75%" }} />
              </div>
            </div>

            <div className="flex justify-between text-[12px] font-semibold text-[#5B6661] -mt-2">
              <span>{isHi ? "सोम" : "Mon"}</span>
              <span>{isHi ? "मंगल" : "Tue"}</span>
              <span>{isHi ? "बुध" : "Wed"}</span>
              <span>{isHi ? "गुरु" : "Thu"}</span>
              <span>{isHi ? "शुक्र" : "Fri"}</span>
              <span className="text-[#F2622E] font-bold">{isHi ? "शनि (उच्चतम)" : "Sat (Peak)"}</span>
              <span>{isHi ? "रवि" : "Sun"}</span>
            </div>
          </div>

          {/* Top Donors This Month (With Invoice Triggers) */}
          <div className="ui-card p-6 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
                {isHi ? "इस महीने के कॉर्पोरेट सीएसआर दानदाता" : "Corporate CSR donors this month"}
              </h2>
              <span className="text-[12px] font-semibold text-[#166534] bg-[#DCF5E4] px-2.5 py-0.5 rounded-full">
                80G Eligible
              </span>
            </div>

            <div className="divide-y divide-[#F0EEE8]">
              <div className="py-3.5 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">1</b>
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-[#13231C]">Hotel Clarks Amer Jaipur</span>
                  <span className="text-[11px] text-[#5B6661]">GSTIN: 08AAACH1234F1Z5 · 1,850 meals (777 kg)</span>
                </div>
                <div className="text-right mr-2">
                  <span className="font-bold text-[#0E3B2E] block">₹74,000</span>
                  <span className="text-[10px] text-[#5B6661]">In-Kind 80G Value</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDonor("Hotel Clarks Amer Jaipur");
                    setIsInvoiceOpen(true);
                  }}
                  className="ui-chip bg-[#0E3B2E] text-white hover:bg-[#165c48] cursor-pointer font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#F5B82E]" />
                  <span>{isHi ? "इनवॉइस" : "Invoice"}</span>
                </button>
              </div>

              <div className="py-3.5 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">2</b>
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-[#13231C]">Shree Ram Marriage Garden</span>
                  <span className="text-[11px] text-[#5B6661]">GSTIN: 08AABCS5678K1Z2 · 1,240 meals (520.8 kg)</span>
                </div>
                <div className="text-right mr-2">
                  <span className="font-bold text-[#0E3B2E] block">₹49,600</span>
                  <span className="text-[10px] text-[#5B6661]">In-Kind 80G Value</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDonor("Shree Ram Marriage Garden");
                    setIsInvoiceOpen(true);
                  }}
                  className="ui-chip bg-[#0E3B2E] text-white hover:bg-[#165c48] cursor-pointer font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#F5B82E]" />
                  <span>{isHi ? "इनवॉइस" : "Invoice"}</span>
                </button>
              </div>

              <div className="py-3.5 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">3</b>
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-[#13231C]">MNIT Campus Central Mess</span>
                  <span className="text-[11px] text-[#5B6661]">GSTIN: 08AAATM9012P1Z8 · 980 meals (411.6 kg)</span>
                </div>
                <div className="text-right mr-2">
                  <span className="font-bold text-[#0E3B2E] block">₹39,200</span>
                  <span className="text-[10px] text-[#5B6661]">In-Kind 80G Value</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedDonor("MNIT Campus Central Mess");
                    setIsInvoiceOpen(true);
                  }}
                  className="ui-chip bg-[#0E3B2E] text-white hover:bg-[#165c48] cursor-pointer font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#F5B82E]" />
                  <span>{isHi ? "इनवॉइस" : "Invoice"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CSR Invoice Generator Card (5 of 12 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Download a CSR Invoice Card */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#0E3B2E]" />
              <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
                {isHi ? "सीएसआर टैक्स इनवॉइस बनाएं" : "Generate CSR Tax Invoice"}
              </h2>
            </div>

            <label className="flex flex-col gap-2 text-[14px] font-bold text-[#13231C]">
              {isHi ? "दानदाता (Corporate Donor)" : "Corporate Donor"}
              <select
                value={selectedDonor}
                onChange={(e) => setSelectedDonor(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] rounded-[14px] px-4 bg-white text-[15px] font-medium text-[#13231C] outline-none"
              >
                <option>Hotel Clarks Amer Jaipur</option>
                <option>Shree Ram Marriage Garden</option>
                <option>MNIT Campus Central Mess</option>
                <option>ITC Rajputana Jaipur</option>
                <option>Hotel Saffron Kitchen</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[14px] font-bold text-[#13231C]">
              {isHi ? "समयावधि (Billing Period)" : "Billing Period"}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] rounded-[14px] px-4 bg-white text-[15px] font-medium text-[#13231C] outline-none"
              >
                <option>1 Sep – 25 Sep 2026</option>
                <option>This month (September 2026)</option>
                <option>August 2026</option>
                <option>FY 2026-27 Q2</option>
              </select>
            </label>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadInvoicePDF}
                className="btn-primary flex-1 h-[48px] text-[14px] justify-center cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{isHi ? "इनवॉइस देखें / PDF" : "View / Download Invoice"}</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary flex-1 h-[48px] text-[14px] justify-center cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isHi ? "CSV निर्यात" : "Export CSV"}</span>
              </button>
            </div>
          </div>

          {/* Quick Statutory Info Box */}
          <div className="ui-card p-6 bg-[#FAF8F2] border-[#ECE9E1] flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#166534]" />
              <span className="font-outfit text-[17px] font-bold text-[#0E3B2E]">
                {isHi ? "धारा 80G एवं ईएसजी मान्यता" : "Section 80G & ESG Statutory Compliance"}
              </span>
            </div>
            <p className="text-[13px] text-[#5B6661] leading-relaxed">
              {isHi
                ? "सभी इनवॉइस सीधे आयकर अधिनियम धारा 80G एवं कंपनी अधिनियम अनुसूची VII के तहत उत्पन्न होते हैं और कॉर्पोरेट टैक्स छूट व ईएसजी ऑडिट के लिए 100% मान्य हैं।"
                : "All invoices are issued under Section 80G(5)(vi) and Schedule VII of Companies Act 2013, fully certified for statutory CSR audit and corporate tax exemption filing."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}