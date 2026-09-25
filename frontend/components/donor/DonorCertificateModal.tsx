"use client";

import React, { useState, useRef } from "react";
import {
  Download,
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  Share2,
  X,
  Building2,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface DonorCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDonorName?: string;
}

export const ACHIEVER_DONORS = [
  { name: "Hotel Clarks Amer Jaipur", type: "Luxury Hotel & Banquet", meals: 1850, id: "JFR-2026-0841" },
  { name: "Shree Ram Marriage Garden", type: "Wedding & Catering Venue", meals: 1240, id: "JFR-2026-0612" },
  { name: "MNIT Campus Central Mess", type: "University Dining Hall", meals: 980, id: "JFR-2026-0490" },
  { name: "ITC Rajputana Jaipur", type: "Heritage Hotel & Dining", meals: 2100, id: "JFR-2026-1025" },
  { name: "Hotel Saffron Kitchen", type: "Commercial Restaurant", meals: 640, id: "JFR-2026-0318" },
];

export function DonorCertificateModal({
  isOpen,
  onClose,
  defaultDonorName = "Hotel Clarks Amer Jaipur",
}: DonorCertificateModalProps) {
  const [donorName, setDonorName] = useState(defaultDonorName);
  const [donorType, setDonorType] = useState("Hotel / Mess / Restaurant / Food Business");
  const [certDate, setCertDate] = useState("25 September 2026");
  const [certId, setCertId] = useState("JFR-2026-1025");
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const selectDonor = (donor: typeof ACHIEVER_DONORS[0]) => {
    setDonorName(donor.name);
    setDonorType(donor.type);
    setCertId(donor.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[28px] overflow-hidden shadow-2xl border border-[#ECE9E1] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL CONTROLS HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-[#0E3B2E] text-white border-b border-[#1E5542] print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#F5B82E]" />
            <div className="flex flex-col">
              <span className="font-outfit text-[16px] font-extrabold tracking-wide">
                Official Jaipur Food Rescue Certificate Generator
              </span>
              <span className="text-[11px] text-[#A3D9BE]">
                Generate customized certificate of appreciation for achiever donors
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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

        {/* DONOR SELECTOR & CUSTOMIZER BAR */}
        <div className="px-6 py-3.5 bg-[#F6F5F1] border-b border-[#ECE9E1] flex flex-col gap-2.5 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#0E3B2E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F2622E]" />
              <span>Select Achiever Donor or Type Custom Name:</span>
            </span>
            <span className="text-[11px] font-mono text-[#5B6661]">
              Certificate ID: {certId}
            </span>
          </div>

          {/* Quick Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {ACHIEVER_DONORS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => selectDonor(d)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                  donorName === d.name
                    ? "bg-[#0E3B2E] text-white shadow-xs"
                    : "bg-white border border-[#DCD9D0] text-[#13231C] hover:border-[#0E3B2E]"
                }`}
              >
                <span>{d.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({d.meals} meals)</span>
              </button>
            ))}
          </div>

          {/* Editable Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 bg-white border border-[#DCD9D0] rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[12px] font-bold text-[#5B6661] whitespace-nowrap">Donor Name:</span>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Enter Organization / Donor Name"
                className="w-full text-[13px] font-bold text-[#0E3B2E] outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#DCD9D0] rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[12px] font-bold text-[#5B6661] whitespace-nowrap">Category:</span>
              <input
                type="text"
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                placeholder="e.g. Hotel / Mess / Restaurant"
                className="w-full text-[13px] font-semibold text-[#13231C] outline-none"
              />
            </div>
          </div>
        </div>

        {/* CERTIFICATE CANVAS (EXACT REPLICA OF JAIPUR FOOD RESCUE & SECURITY) */}
        <div className="p-4 sm:p-8 bg-[#EFECE6] overflow-x-auto flex items-center justify-center">
          <div
            ref={certRef}
            id="printable-certificate"
            className="relative w-full max-w-[900px] aspect-[1.414/1] min-h-[580px] bg-[#FAF8F2] border-[10px] border-[#0E3B2E] rounded-xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between select-none overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(#0E3B2E 0.75px, transparent 0.75px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0",
            }}
          >
            {/* Fine Inner Decorative Border */}
            <div className="absolute inset-2 border-[1.5px] border-[#D4AF37] rounded-lg pointer-events-none" />

            {/* Subtle Watermark of Jaipur Hawa Mahal / Fort Arch */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <svg viewBox="0 0 800 600" width="80%" height="80%" fill="#0E3B2E">
                <path d="M400 50 C250 50 150 150 150 300 L150 550 L650 550 L650 300 C650 150 550 50 400 50 Z M400 120 C480 120 540 180 540 280 L540 500 L260 500 L260 280 C260 180 320 120 400 120 Z" />
                <path d="M300 350 H500 V480 H300 Z" />
                <path d="M350 220 H450 V300 H350 Z" />
              </svg>
            </div>

            {/* TOP BAR: Header Logo Left + Script Slogan Right */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              {/* Logo & Org Name Left */}
              <div className="flex items-center gap-3">
                {/* Official Circular Bowl Icon */}
                <div className="w-14 h-14 rounded-full bg-[#FAF8F2] border-2 border-[#0E3B2E] p-1 flex items-center justify-center shadow-xs flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Bowl */}
                    <path d="M20 50 C20 78 80 78 80 50 Z" fill="#0E3B2E" />
                    {/* Food Bounty */}
                    <circle cx="42" cy="42" r="10" fill="#E65100" />
                    <circle cx="58" cy="42" r="9" fill="#F5B82E" />
                    <circle cx="50" cy="35" r="8" fill="#F2622E" />
                    {/* Green Leaves */}
                    <path d="M48 28 C45 15 55 10 65 18 C58 22 55 28 48 28 Z" fill="#1E9E5A" />
                    <path d="M52 28 C55 15 45 10 35 18 C42 22 45 28 52 28 Z" fill="#34D399" />
                  </svg>
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-serif text-[18px] sm:text-[22px] font-black text-[#0E3B2E] tracking-tight">
                    JAIPUR
                  </span>
                  <span className="font-serif text-[13px] sm:text-[15px] font-black text-[#E65100] tracking-wide">
                    FOOD RESCUE
                  </span>
                  <span className="font-serif text-[11px] sm:text-[13px] font-extrabold text-[#E65100] tracking-wider -mt-0.5">
                    AND SECURITY
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#0E3B2E] tracking-widest mt-0.5 uppercase">
                    RESCUE • REDISTRIBUTE • NOURISH
                  </span>
                </div>
              </div>

              {/* Tagline Top Right */}
              <div className="flex items-center gap-1.5 text-right">
                <div className="flex flex-col">
                  <span
                    className="text-[18px] sm:text-[22px] text-[#0E3B2E] font-medium italic"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, Georgia, serif" }}
                  >
                    Good Food
                  </span>
                  <span
                    className="text-[18px] sm:text-[22px] text-[#0E3B2E] font-medium italic -mt-2"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, Georgia, serif" }}
                  >
                    Brighter Tomorrows
                  </span>
                </div>
                {/* Twin Leaves */}
                <div className="flex gap-0.5 mb-2">
                  <span className="w-2.5 h-4 bg-[#1E9E5A] rounded-tr-full rounded-bl-full transform rotate-12" />
                  <span className="w-2 h-3 bg-[#34D399] rounded-tl-full rounded-br-full transform -rotate-12 mt-1" />
                </div>
              </div>
            </div>

            {/* MAIN CERTIFICATE CONTENT CENTER */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto py-2">
              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#0E3B2E] tracking-[0.18em] uppercase">
                CERTIFICATE
              </h1>
              <h2 className="font-serif text-sm sm:text-lg font-bold text-[#0E3B2E] tracking-[0.35em] uppercase mt-1">
                OF APPRECIATION
              </h2>

              {/* Green Leaf Vignette Emblem */}
              <div className="flex items-center justify-center gap-1 my-2">
                <span className="w-8 sm:w-12 h-[1px] bg-[#D4AF37]" />
                <span className="w-3 h-3 bg-[#1E9E5A] rounded-full flex items-center justify-center shadow-xs">
                  <span className="w-1.5 h-1.5 bg-[#F5B82E] rounded-full" />
                </span>
                <span className="w-8 sm:w-12 h-[1px] bg-[#D4AF37]" />
              </div>

              {/* Subtext */}
              <p className="font-serif text-[13px] sm:text-[15px] italic text-[#4A4A4A] mt-1">
                This is to certify that
              </p>

              {/* RECIPIENT NAME (HIGHLIGHTED) */}
              <div className="my-2 px-6 py-1 border-b-2 border-[#D4AF37] max-w-xl">
                <span className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0E3B2E] tracking-tight">
                  {donorName}
                </span>
              </div>

              {/* Organization Type Subtext */}
              <p className="text-[11px] sm:text-[13px] text-[#6B7280] font-medium">
                ({donorType})
              </p>

              {/* Commendation Paragraph */}
              <p className="font-serif text-[12px] sm:text-[14px] text-[#2C3E35] max-w-2xl leading-relaxed mt-2.5 px-4">
                has been an active partner with <strong className="font-bold text-[#0E3B2E]">Jaipur Food Rescue and Security</strong> in our mission to reduce food waste and support communities in need by donating surplus, safe and quality food.
              </p>

              <p className="font-serif text-[12px] sm:text-[14px] font-semibold text-[#0E3B2E] max-w-xl leading-relaxed mt-1">
                We truly appreciate your contribution towards a hunger-free and more sustainable Jaipur.
              </p>
            </div>

            {/* LEFT VERTICAL PILLARS (Rescue Food • Feed Communities • Reduce Waste) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-10">
              <div className="flex flex-col items-center gap-1 text-center w-16">
                <div className="w-10 h-10 rounded-full bg-[#E7F7EE] border border-[#1E9E5A] flex items-center justify-center shadow-xs">
                  🥗
                </div>
                <span className="text-[8px] font-extrabold text-[#0E3B2E] uppercase tracking-tighter leading-tight">
                  RESCUE<br />FOOD
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 text-center w-16">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] border border-[#E65100] flex items-center justify-center shadow-xs">
                  👥
                </div>
                <span className="text-[8px] font-extrabold text-[#E65100] uppercase tracking-tighter leading-tight">
                  FEED<br />COMMUNITIES
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 text-center w-16">
                <div className="w-10 h-10 rounded-full bg-[#F0FDF4] border border-[#16A34A] flex items-center justify-center shadow-xs">
                  🌱
                </div>
                <span className="text-[8px] font-extrabold text-[#16A34A] uppercase tracking-tighter leading-tight">
                  REDUCE<br />FOOD WASTE
                </span>
              </div>
            </div>

            {/* BOTTOM SECTION: Signatures Left & Right + Green Bottom Banner */}
            <div className="relative z-10 flex flex-col gap-3 mt-2">
              {/* Signatures & Seal Row */}
              <div className="flex items-end justify-between px-2 sm:px-6">
                {/* Left: Authorized Signatory */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-36 sm:w-44 border-b border-[#0E3B2E] pb-0.5">
                    <span
                      className="font-serif italic text-[14px] text-[#0E3B2E]"
                      style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
                    >
                      Kavya Choudhary
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#13231C] mt-1">
                    Authorized Signatory
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#5B6661]">
                    Jaipur Food Rescue and Security
                  </span>
                </div>

                {/* Center Verified Circular Stamp */}
                <div className="hidden sm:flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D4AF37] p-1 flex items-center justify-center rotate-[-12deg] bg-[#FAF8F2]/80">
                    <div className="w-full h-full rounded-full border border-[#0E3B2E] flex flex-col items-center justify-center text-[7px] font-extrabold text-[#0E3B2E] text-center leading-none">
                      <span>OFFICIAL</span>
                      <span className="text-[#E65100] font-black my-0.5">★ SEAL ★</span>
                      <span>2026</span>
                    </div>
                  </div>
                </div>

                {/* Right: Date */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 sm:w-40 border-b border-[#0E3B2E] pb-0.5 text-center">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#13231C]">
                      {certDate}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#13231C] mt-1">
                    Date of Certification
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#5B6661]">
                    ID: {certId}
                  </span>
                </div>
              </div>

              {/* Dark Green Ribbon Bottom Banner */}
              <div className="w-full bg-[#0E3B2E] text-[#FAF8F2] py-2 px-4 rounded-md text-center shadow-md">
                <span className="font-serif text-[9px] sm:text-[11px] font-extrabold tracking-[0.25em] uppercase">
                  LESS WASTE &nbsp;|&nbsp; STRONGER COMMUNITIES &nbsp;|&nbsp; A HEALTHIER TOMORROW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
