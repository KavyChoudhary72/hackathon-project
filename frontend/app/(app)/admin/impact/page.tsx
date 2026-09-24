"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ImpactAndReportsPage() {
  const [selectedDonor, setSelectedDonor] = useState("Shree Ram Marriage Garden");
  const [selectedPeriod, setSelectedPeriod] = useState("1 Sep – 20 Sep 2026");

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Donor,Period,Meals Rescued,Kg Diverted,CO2e Avoided\nShree Ram Marriage Garden,1 Sep - 20 Sep 2026,1240,612,1530";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `impact-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER: Title + Subtitle + Live Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0E3B2E] tracking-tight leading-tight">
            Impact &amp; reports
          </h1>
          <span className="text-[15px] sm:text-[16px] text-[#5B6661]">
            Live numbers from every verified delivery.
          </span>
        </div>

        <span className="ui-chip bg-[#DCF5E4] text-[#166534] h-9 text-[14px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#1E9E5A] animate-pulse" />
          <span>Live</span>
        </span>
      </div>

      {/* 5 METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Meals to people */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#1E9E5A] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            Meals to people
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            3,480
          </span>
        </div>

        {/* Rescue deal meals */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#E89B1C] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            Rescue deal meals
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            212
          </span>
        </div>

        {/* Animals & biogas */}
        <div className="ui-card p-5 flex flex-col gap-1 border-t-[5px] border-t-[#8B5E34] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            Animals &amp; biogas
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            146 kg
          </span>
        </div>

        {/* Total food diverted (Dark green card) */}
        <div className="ui-card p-5 flex flex-col gap-1 bg-[#0E3B2E] border-[#0E3B2E] text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#C9DDD3]">
            Total food diverted
          </span>
          <span className="font-outfit text-[32px] font-bold text-white leading-tight">
            1,622 kg
          </span>
        </div>

        {/* CO2e avoided */}
        <div className="ui-card p-5 flex flex-col gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="text-[13px] font-semibold text-[#5B6661]">
            CO₂e avoided
          </span>
          <span className="font-outfit text-[32px] font-bold text-[#13231C] leading-tight">
            4,055 kg
          </span>
        </div>
      </div>

      {/* Math Note */}
      <span className="text-[13px] text-[#5B6661] -mt-2 leading-relaxed">
        Assumes 1 meal ≈ 0.4 kg and 2.5 kg CO₂e per kg of food diverted. Food for animals and biogas is never counted as meals.{" "}
        <a href="#how" className="text-[#0E3B2E] font-semibold underline hover:text-[#C2410C]">
          How we calculate
        </a>
      </span>

      {/* 2-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Chart + Top Donors (7 of 12 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Chart Card */}
          <div className="ui-card p-6 flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
                Meals delivered this week
              </h2>
              <span className="text-[13px] text-[#5B6661]">14–20 Sep 2026</span>
            </div>

            {/* SVG Area Chart */}
            <div className="w-full h-[200px]">
              <svg
                width="100%"
                height="200"
                viewBox="0 0 640 200"
                preserveAspectRatio="none"
                role="img"
                aria-label="Meals delivered per day, rising from 310 on Monday to 720 on Sunday"
              >
                <g stroke="#F0EEE8" strokeWidth="1">
                  <path d="M0 40h640M0 90h640M0 140h640M0 190h640" />
                </g>
                <path
                  d="M20 150 L115 138 L210 120 L305 128 L400 95 L495 70 L620 42 L620 190 L20 190 Z"
                  fill="#E3F5EA"
                />
                <path
                  d="M20 150 L115 138 L210 120 L305 128 L400 95 L495 70 L620 42"
                  fill="none"
                  stroke="#0E3B2E"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle cx="620" cy="42" r="6" fill="#F2622E" />
              </svg>
            </div>

            <div className="flex justify-between text-[12px] text-[#5B6661] px-2 font-medium">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Top Donors This Month */}
          <div className="ui-card p-6 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C] mb-1">
              Top donors this month
            </h2>

            <div className="divide-y divide-[#F0EEE8]">
              <div className="py-3 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">1</b>
                <span className="flex-1 font-semibold text-[#13231C]">
                  Shree Ram Marriage Garden
                </span>
                <span className="w-28 text-[#5B6661]">1,240 meals</span>
                <span className="ui-chip bg-[#FDE8DD] text-[#9A3412]">
                  Seva Sathi
                </span>
              </div>

              <div className="py-3 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">2</b>
                <span className="flex-1 font-semibold text-[#13231C]">
                  MNIT Campus Mess
                </span>
                <span className="w-28 text-[#5B6661]">980 meals</span>
                <span className="ui-chip bg-[#FDE8DD] text-[#9A3412]">
                  Seva Sathi
                </span>
              </div>

              <div className="py-3 flex items-center gap-3 text-[14px]">
                <b className="w-6 text-[#13231C]">3</b>
                <span className="flex-1 font-semibold text-[#13231C]">
                  Hotel Saffron Kitchen
                </span>
                <span className="w-28 text-[#5B6661]">640 meals</span>
                <span className="ui-chip bg-[#E3F5EA] text-[#166534]">
                  Annadaan Mitra
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Certificate & Live Activity (5 of 12 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Download a Certificate Card */}
          <div className="ui-card p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C]">
              Download a certificate
            </h2>

            <label className="flex flex-col gap-2 text-[14px] font-bold text-[#13231C]">
              Donor
              <select
                value={selectedDonor}
                onChange={(e) => setSelectedDonor(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] rounded-[14px] px-4 bg-white text-[15px] font-medium text-[#13231C] outline-none"
              >
                <option>Shree Ram Marriage Garden</option>
                <option>MNIT Campus Mess</option>
                <option>Hotel Saffron Kitchen</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[14px] font-bold text-[#13231C]">
              Period
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-[50px] border border-[#DCD9D0] rounded-[14px] px-4 bg-white text-[15px] font-medium text-[#13231C] outline-none"
              >
                <option>1 Sep – 20 Sep 2026</option>
                <option>This month</option>
                <option>August 2026</option>
              </select>
            </label>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="btn-primary flex-1 h-[48px] text-[14px] justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary flex-1 h-[48px] text-[14px] justify-center"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="ui-card p-6 flex flex-col gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h2 className="font-outfit text-[20px] font-bold text-[#13231C] mb-2">
              Live activity
            </h2>

            <div className="flex flex-col divide-y divide-[#F0EEE8]">
              <div className="py-3 flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E5A] mt-1.5 flex-shrink-0" />
                <span className="flex-1 text-[14px] text-[#13231C] leading-snug">
                  Asha Shelter accepted 50 meals from Shree Ram Marriage Garden
                </span>
                <span className="text-[12px] text-[#5B6661] whitespace-nowrap">
                  18 sec ago
                </span>
              </div>

              <div className="py-3 flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] mt-1.5 flex-shrink-0" />
                <span className="flex-1 text-[14px] text-[#13231C] leading-snug">
                  Ravi picked up 30 meals from MNIT Campus Mess
                </span>
                <span className="text-[12px] text-[#5B6661] whitespace-nowrap">
                  4 min ago
                </span>
              </div>

              <div className="py-3 flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E89B1C] mt-1.5 flex-shrink-0" />
                <span className="flex-1 text-[14px] text-[#13231C] leading-snug">
                  2 rescue deal meals collected at Hotel Saffron Kitchen
                </span>
                <span className="text-[12px] text-[#5B6661] whitespace-nowrap">
                  12 min ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}