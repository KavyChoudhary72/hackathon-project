"use client";

import React, { useState, useRef } from "react";
import {
  Printer,
  FileSpreadsheet,
  Building2,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Receipt,
  Leaf,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export interface CSRDonorProfile {
  name: string;
  type: string;
  meals: number;
  weightKg: number;
  gstin: string;
  fssai: string;
  address: string;
  invoiceId: string;
  ratePerMeal: number;
}

export const CSR_DONORS: CSRDonorProfile[] = [
  {
    name: "Hotel Clarks Amer Jaipur",
    type: "Corporate Hospitality & Banquet",
    meals: 1850,
    weightKg: 777.0,
    gstin: "08AAACH1234F1Z5",
    fssai: "FSSAI-12219020000123",
    address: "JLN Marg, Malviya Nagar, Jaipur, Rajasthan 302018",
    invoiceId: "CSR-INV-2026-0841",
    ratePerMeal: 40,
  },
  {
    name: "Shree Ram Marriage Garden",
    type: "Wedding & Catering Establishment",
    meals: 1240,
    weightKg: 520.8,
    gstin: "08AABCS5678K1Z2",
    fssai: "FSSAI-12219020000456",
    address: "Mansarovar Sector 4, Jaipur, Rajasthan 302020",
    invoiceId: "CSR-INV-2026-0612",
    ratePerMeal: 40,
  },
  {
    name: "MNIT Campus Central Mess",
    type: "University Dining & Institutional Mess",
    meals: 980,
    weightKg: 411.6,
    gstin: "08AAATM9012P1Z8",
    fssai: "FSSAI-12219020000789",
    address: "JLN Marg, Malviya Nagar, Jaipur, Rajasthan 302017",
    invoiceId: "CSR-INV-2026-0490",
    ratePerMeal: 40,
  },
  {
    name: "ITC Rajputana Jaipur",
    type: "Luxury Heritage Hotel & Fine Dining",
    meals: 2100,
    weightKg: 882.0,
    gstin: "08AAACI3456D1Z9",
    fssai: "FSSAI-12219020000999",
    address: "Palace Road, Gopalbari, Jaipur, Rajasthan 302006",
    invoiceId: "CSR-INV-2026-1025",
    ratePerMeal: 40,
  },
  {
    name: "Hotel Saffron Kitchen",
    type: "Commercial Dining & Food Business",
    meals: 640,
    weightKg: 268.8,
    gstin: "08AAACS7788M1Z4",
    fssai: "FSSAI-12219020000318",
    address: "Subhash Marg, C-Scheme, Jaipur, Rajasthan 302001",
    invoiceId: "CSR-INV-2026-0318",
    ratePerMeal: 40,
  },
];

interface CSRInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDonorName?: string;
  defaultPeriod?: string;
}

export function CSRInvoiceModal({
  isOpen,
  onClose,
  defaultDonorName = "Hotel Clarks Amer Jaipur",
  defaultPeriod = "1 Sep 2026 – 25 Sep 2026",
}: CSRInvoiceModalProps) {
  const initialDonor =
    CSR_DONORS.find((d) => d.name === defaultDonorName) || CSR_DONORS[0];

  const [donorName, setDonorName] = useState(initialDonor.name);
  const [donorType, setDonorType] = useState(initialDonor.type);
  const [gstin, setGstin] = useState(initialDonor.gstin);
  const [fssai, setFssai] = useState(initialDonor.fssai);
  const [address, setAddress] = useState(initialDonor.address);
  const [mealsRescued, setMealsRescued] = useState(initialDonor.meals);
  const [weightKg, setWeightKg] = useState(initialDonor.weightKg);
  const [invoiceId, setInvoiceId] = useState(initialDonor.invoiceId);
  const [invoiceDate, setInvoiceDate] = useState("25 September 2026");
  const [period, setPeriod] = useState(defaultPeriod);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleSelectDonor = (donor: CSRDonorProfile) => {
    setDonorName(donor.name);
    setDonorType(donor.type);
    setGstin(donor.gstin);
    setFssai(donor.fssai);
    setAddress(donor.address);
    setMealsRescued(donor.meals);
    setWeightKg(donor.weightKg);
    setInvoiceId(donor.invoiceId);
  };

  const handlePrint = () => {
    window.print();
  };

  const ratePerMeal = 40;
  const grossValuation = mealsRescued * ratePerMeal;
  const co2AvoidedKg = Math.round(weightKg * 2.5);

  const handleExportCSV = () => {
    const csvHeader =
      "Invoice Number,Date,Donor Name,GSTIN,FSSAI License,Meals Rescued,Kg Diverted,Fair In-Kind Value (INR),80G Tax Exemption (INR),CO2e Offset (kg),Verification Status\n";
    const csvRow = `"${invoiceId}","${invoiceDate}","${donorName}","${gstin}","${fssai}",${mealsRescued},${weightKg.toFixed(
      1
    )},${grossValuation.toFixed(2)},${grossValuation.toFixed(
      2
    )},${co2AvoidedKg},"VERIFIED_100%_SECTION_80G"\n`;

    const encodedUri = encodeURI(
      "data:text/csv;charset=utf-8," + csvHeader + csvRow
    );
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `csr-tax-invoice-${invoiceId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qrPayload = JSON.stringify({
    inv: invoiceId,
    donor: donorName,
    gstin,
    meals: mealsRescued,
    val_inr: grossValuation,
    sec80g_reg: "AAATJ1234EF20261",
    darpan: "RJ/2026/0319482",
    verified: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Outer Dialog Box */}
      <div className="relative w-full max-w-5xl bg-white rounded-[24px] overflow-hidden shadow-2xl border border-[#ECE9E1] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* HEADER CONTROLS (Hidden in print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-[#0E3B2E] text-white border-b border-[#1E5542] print:hidden flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-[#F5B82E]" />
            <div className="flex flex-col">
              <span className="font-outfit text-[16px] font-extrabold tracking-wide">
                Official CSR Tax Exemption & In-Kind Donation Invoice
              </span>
              <span className="text-[11px] text-[#A3D9BE]">
                Section 80G(5)(vi) Income Tax Act & Companies Act (CSR Schedule VII) Audit Receipt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-bold flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#A3D9BE]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#1E9E5A] hover:bg-[#17854B] text-white text-[13px] font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DONOR SELECTOR & CUSTOMIZER BAR (Hidden in print) */}
        <div className="px-6 py-3 bg-[#F6F5F1] border-b border-[#ECE9E1] flex flex-col gap-2.5 print:hidden flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#0E3B2E] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#F2622E]" />
              <span>Select Corporate Donor or Customize Invoice:</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#5B6661]">
              Invoice No: {invoiceId}
            </span>
          </div>

          {/* Quick Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {CSR_DONORS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => handleSelectDonor(d)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  donorName === d.name
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-white border border-[#DCD9D0] text-[#13231C] hover:border-[#0E3B2E]"
                }`}
              >
                <span>{d.name}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  (₹{(d.meals * d.ratePerMeal).toLocaleString("en-IN")})
                </span>
              </button>
            ))}
          </div>

          {/* Editable Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="flex items-center gap-2 bg-white border border-[#DCD9D0] rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[11px] font-bold text-[#5B6661] whitespace-nowrap">Donor Name:</span>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full text-[13px] font-bold text-[#0E3B2E] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#DCD9D0] rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[11px] font-bold text-[#5B6661] whitespace-nowrap">GSTIN / PAN:</span>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full text-[13px] font-mono font-semibold text-[#13231C] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#DCD9D0] rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[11px] font-bold text-[#5B6661] whitespace-nowrap">Period:</span>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full text-[13px] font-semibold text-[#13231C] outline-none"
              />
            </div>
          </div>
        </div>

        {/* INVOICE CANVAS BODY */}
        <div className="p-4 sm:p-8 bg-[#EFECE6] overflow-y-auto flex items-center justify-center">
          <div
            ref={invoiceRef}
            id="printable-csr-invoice"
            className="w-full max-w-[860px] bg-white border-2 border-[#DCD9D0] rounded-xl p-6 sm:p-9 shadow-xl flex flex-col gap-6 text-[#13231C] print:border-none print:shadow-none print:p-4 print:max-w-none"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
          >
            {/* 1. TOP STATUTORY HEADER */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b-2 border-[#0E3B2E] pb-5">
              <div className="flex items-center gap-3.5">
                {/* Official Logo */}
                <div className="w-14 h-14 rounded-xl bg-[#0E3B2E] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M17 30s-11-6.6-11-14.2A6 6 0 0 1 17 12a6 6 0 0 1 11 3.8C28 23.4 17 30 17 30z" fill="#F2622E" />
                    <path d="M16 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#1E9E5A" />
                    <path d="M16 12c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5z" fill="#F5B82E" />
                  </svg>
                </div>

                <div className="flex flex-col leading-tight">
                  <h1 className="font-outfit text-[20px] sm:text-[23px] font-extrabold text-[#0E3B2E] tracking-tight">
                    JAIPUR FOOD RESCUE AND SECURITY FOUNDATION
                  </h1>
                  <span className="text-[11px] font-semibold text-[#5B6661] mt-0.5">
                    Section 8 Non-Profit Registered Entity · CIN: U85300RJ2026NPL089123
                  </span>
                  <span className="text-[10px] text-[#5B6661]">
                    NITI Aayog NGO Darpan ID: <b>RJ/2026/0319482</b> · PAN: <b>AAATJ1234E</b>
                  </span>
                </div>
              </div>

              {/* Tax Exemption Badge Right */}
              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#DCF5E4] text-[#166534] text-[11px] font-extrabold border border-[#B9E9C7]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>80G TAX EXEMPTION APPROVED</span>
                </div>
                <span className="text-[10.5px] font-mono text-[#5B6661] mt-1">
                  80G Reg No: <b>AAATJ1234EF20261</b>
                </span>
                <span className="text-[10px] text-[#5B6661]">
                  FSSAI Partner: FSSAI-SURPLUS-JMC-4482
                </span>
              </div>
            </div>

            {/* 2. INVOICE TITLE & METADATA BAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF8F2] border border-[#ECE9E1] rounded-xl p-4">
              <div className="flex flex-col">
                <span className="font-outfit text-[17px] font-black tracking-wide text-[#0E3B2E] uppercase">
                  TAX INVOICE & CSR IN-KIND DONATION RECEIPT
                </span>
                <span className="text-[11px] text-[#5B6661]">
                  Eligible for CSR compliance under Schedule VII, Companies Act 2013 & Section 80G(5)(vi)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px]">
                <div>
                  <span className="text-[#5B6661]">Invoice No:</span>{" "}
                  <b className="font-mono text-[#0E3B2E]">{invoiceId}</b>
                </div>
                <div>
                  <span className="text-[#5B6661]">Date of Issue:</span>{" "}
                  <b>{invoiceDate}</b>
                </div>
                <div>
                  <span className="text-[#5B6661]">Financial Year:</span>{" "}
                  <b>2026-2027</b>
                </div>
                <div>
                  <span className="text-[#5B6661]">Assessment Year:</span>{" "}
                  <b>2027-2028</b>
                </div>
              </div>
            </div>

            {/* 3. BILLED FROM & BILLED TO 2-COLUMN BOX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left: Issued By (Section 8 NGO) */}
              <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex flex-col gap-1 text-[12.5px]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E3B2E]">
                  Issued By (Registered Non-Profit Partner):
                </span>
                <span className="font-bold text-[#13231C]">
                  Jaipur Food Rescue and Security Foundation
                </span>
                <span className="text-[#5B6661]">
                  Bapu Nagar, JLN Marg, Jaipur, Rajasthan 302015
                </span>
                <span className="text-[#5B6661]">
                  Email: csr-audit@jaipurfoodrescue.org | Ph: +91-141-2700800
                </span>
                <span className="text-[11px] font-mono text-[#166534] font-semibold mt-1">
                  ✓ Verified Municipal Surplus Food Recovery Partner
                </span>
              </div>

              {/* Right: Billed To (Corporate Donor) */}
              <div className="bg-[#FAF8F2] border border-[#E5E2D9] rounded-xl p-4 flex flex-col gap-1 text-[12.5px]">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2410C]">
                  Billed To / Corporate Donor:
                </span>
                <span className="font-bold text-[14px] text-[#13231C]">
                  {donorName}
                </span>
                <span className="text-[#5B6661]">
                  Category: <b>{donorType}</b>
                </span>
                <span className="text-[#5B6661]">
                  Address: {address}
                </span>
                <div className="flex flex-wrap gap-x-3 text-[11.5px] font-mono mt-1 text-[#13231C]">
                  <span>GSTIN: <b>{gstin}</b></span>
                  <span>FSSAI: <b>{fssai}</b></span>
                </div>
              </div>
            </div>

            {/* 4. ITEMIZED RESCUE AUDIT TABLE */}
            <div className="border border-[#E5E2D9] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="bg-[#0E3B2E] text-white text-[11.5px] font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Description of Rescued Food Batch</th>
                    <th className="py-2.5 px-3 text-right">Meals</th>
                    <th className="py-2.5 px-3 text-right">Diverted (kg)</th>
                    <th className="py-2.5 px-3 text-right">Fair Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">In-Kind Valuation (₹)</th>
                    <th className="py-2.5 px-3 text-right">CO₂e Avoided</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  <tr>
                    <td className="py-3 px-3 text-center font-bold text-[#5B6661]">1</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#13231C]">
                          Cooked Prepared Meals (Hot Vegetarian Cuisine & Breads)
                        </span>
                        <span className="text-[11px] text-[#5B6661]">
                          Verified Safe Temperature Handover (Akshaya Patra & Mother Teresa Shelters)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {Math.round(mealsRescued * 0.65).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6661]">
                      {(weightKg * 0.65).toFixed(1)} kg
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6661]">₹40.00</td>
                    <td className="py-3 px-3 text-right font-bold text-[#13231C]">
                      ₹{(Math.round(mealsRescued * 0.65) * 40).toLocaleString("en-IN")}.00
                    </td>
                    <td className="py-3 px-3 text-right text-[#166534] font-medium">
                      {(weightKg * 0.65 * 2.5).toFixed(1)} kg
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 text-center font-bold text-[#5B6661]">2</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#13231C]">
                          Staples, Rice, Dal & Nutrition Assortments
                        </span>
                        <span className="text-[11px] text-[#5B6661]">
                          Intact hygienic packaging distributed to Seva Ghar & Bal Sansthan
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {(mealsRescued - Math.round(mealsRescued * 0.65)).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6661]">
                      {(weightKg * 0.35).toFixed(1)} kg
                    </td>
                    <td className="py-3 px-3 text-right text-[#5B6661]">₹40.00</td>
                    <td className="py-3 px-3 text-right font-bold text-[#13231C]">
                      ₹{(
                        (mealsRescued - Math.round(mealsRescued * 0.65)) *
                        40
                      ).toLocaleString("en-IN")}.00
                    </td>
                    <td className="py-3 px-3 text-right text-[#166534] font-medium">
                      {(weightKg * 0.35 * 2.5).toFixed(1)} kg
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. SUMMARY & TOTALS BREAKDOWN */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Left Column: Statutory Declaration (7 cols) */}
              <div className="sm:col-span-7 bg-[#F6F5F1] rounded-xl p-4 border border-[#ECE9E1] flex flex-col gap-2 text-[11.5px] leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide text-[#0E3B2E]">
                  Statutory & Compliance Declaration:
                </span>
                <p className="text-[#4B5563]">
                  1. Certified that the above quantity of wholesome surplus food was received in safe, edible condition and distributed free of cost to registered beneficiary shelters in accordance with FSSAI Surplus Food Regulations (2019).
                </p>
                <p className="text-[#4B5563]">
                  2. This receipt entitles the donor enterprise to claim CSR credit under <b>Schedule VII, Item (i) of Companies Act 2013</b> and income tax benefits under <b>Section 80G</b> of the Income Tax Act, 1961.
                </p>
                <p className="text-[#166534] font-semibold">
                  3. GHG Avoidance: Certified reduction of <b>{co2AvoidedKg.toLocaleString("en-IN")} kg CO₂e</b> greenhouse gas emissions.
                </p>
              </div>

              {/* Right Column: Financial Calculation Totals (5 cols) */}
              <div className="sm:col-span-5 bg-[#FAF8F2] border border-[#ECE9E1] rounded-xl p-4 flex flex-col gap-2.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Total Rescued Meals:</span>
                  <b className="text-[#13231C]">{mealsRescued.toLocaleString("en-IN")} Meals</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Total Weight Diverted:</span>
                  <b className="text-[#13231C]">{weightKg.toFixed(1)} kg</b>
                </div>
                <div className="flex justify-between border-t border-[#E5E2D9] pt-2">
                  <span className="text-[#5B6661]">In-Kind Fair Valuation:</span>
                  <b className="text-[#13231C]">₹{grossValuation.toLocaleString("en-IN")}.00</b>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#166534]">80G Tax Exemption Amount:</span>
                  <b className="font-bold text-[#166534]">₹{grossValuation.toLocaleString("en-IN")}.00</b>
                </div>
                <div className="flex justify-between border-t-2 border-[#0E3B2E] pt-2 text-[14px]">
                  <span className="font-black text-[#0E3B2E]">Total Payable by Donor:</span>
                  <b className="font-black text-[#0E3B2E]">₹0.00 (In-Kind)</b>
                </div>
              </div>
            </div>

            {/* 6. SIGNATURES & QR AUDIT VERIFICATION SEAL */}
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-3 border-t border-[#E5E2D9]">
              {/* QR Code Audit Hash */}
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white border border-[#DCD9D0] rounded-lg shadow-2xs">
                  <QRCodeSVG value={qrPayload} size={64} level="M" />
                </div>
                <div className="flex flex-col text-[10.5px]">
                  <span className="font-bold text-[#0E3B2E] uppercase">
                    Dual-OTP Ledger Verified
                  </span>
                  <span className="font-mono text-[#5B6661]">
                    Hash: SHA256-JFR-{invoiceId.replace("CSR-INV-", "")}-OK
                  </span>
                  <span className="text-[#166534] font-semibold">
                    Jaipur Municipal Corp. Audit Pass
                  </span>
                </div>
              </div>

              {/* Official Stamp Center */}
              <div className="hidden sm:flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1E9E5A] p-1 flex items-center justify-center rotate-[-8deg] bg-[#FAF8F2]">
                  <div className="w-full h-full rounded-full border border-[#0E3B2E] flex flex-col items-center justify-center text-[7px] font-extrabold text-[#0E3B2E] text-center leading-none">
                    <span>CSR AUDIT</span>
                    <span className="text-[#166534] font-black my-0.5">★ 80G ★</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Signatory */}
              <div className="flex flex-col items-center text-center">
                <div className="w-44 border-b border-[#0E3B2E] pb-0.5">
                  <span
                    className="font-serif italic text-[15px] text-[#0E3B2E]"
                    style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
                  >
                    Kavya Choudhary
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#13231C] mt-1">
                  Authorized Signatory & Trustee
                </span>
                <span className="text-[10px] text-[#5B6661]">
                  Jaipur Food Rescue and Security Foundation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
