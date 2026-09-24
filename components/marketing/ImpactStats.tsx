"use client";

import React from "react";

export const ImpactStats: React.FC = () => {
  return (
    <section id="impact" className="relative z-10 w-full pb-16 sm:pb-20">
      <div className="max-w-[1340px] px-6 sm:px-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 1: Meals Rescued */}
          <div className="bg-white/95 backdrop-blur-md rounded-[22px] px-6 py-5 shadow-[0_6px_28px_rgba(0,0,0,0.05)] border border-neutral-100/90 flex items-center justify-between transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              {/* Coral Icon Badge */}
              <div className="w-13 h-13 rounded-full bg-[#FFEFEA] flex items-center justify-center text-[#F9683A] flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </div>
              <div>
                <div className="text-[25px] font-black text-[#142921] tracking-tight leading-tight">
                  25,000+
                </div>
                <div className="text-[12px] font-semibold text-[#64748B] mt-0.5">
                  Meals Rescued
                </div>
              </div>
            </div>

            {/* Coral Upward Trend Wave */}
            <svg
              className="w-11 h-6 text-[#F9683A] flex-shrink-0"
              viewBox="0 0 44 24"
              fill="none"
            >
              <path
                d="M 3 20 C 13 20 17 14 25 14 C 31 14 35 6 42 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 35 4 H 42 V 11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* CARD 2: Food Donors */}
          <div className="bg-white/95 backdrop-blur-md rounded-[22px] px-6 py-5 shadow-[0_6px_28px_rgba(0,0,0,0.05)] border border-neutral-100/90 flex items-center justify-between transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              {/* Mint Icon Badge */}
              <div className="w-13 h-13 rounded-full bg-[#E5F7EB] flex items-center justify-center text-[#10B981] flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div>
                <div className="text-[25px] font-black text-[#142921] tracking-tight leading-tight">
                  4,500+
                </div>
                <div className="text-[12px] font-semibold text-[#64748B] mt-0.5">
                  Food Donors
                </div>
              </div>
            </div>

            {/* Mint Upward Trend Wave */}
            <svg
              className="w-11 h-6 text-[#10B981] flex-shrink-0"
              viewBox="0 0 44 24"
              fill="none"
            >
              <path
                d="M 3 20 C 13 20 17 14 25 14 C 31 14 35 6 42 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 35 4 H 42 V 11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* CARD 3: Shelters Connected */}
          <div className="bg-white/95 backdrop-blur-md rounded-[22px] px-6 py-5 shadow-[0_6px_28px_rgba(0,0,0,0.05)] border border-neutral-100/90 flex items-center justify-between transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              {/* Amber Icon Badge */}
              <div className="w-13 h-13 rounded-full bg-[#FEF4E2] flex items-center justify-center text-[#F59E0B] flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 9.5V11H4V21H9V15H15V21H20V11H22V9.5L12 2ZM11 13H13V15H11V13Z" />
                </svg>
              </div>
              <div>
                <div className="text-[25px] font-black text-[#142921] tracking-tight leading-tight">
                  180+
                </div>
                <div className="text-[12px] font-semibold text-[#64748B] mt-0.5">
                  Shelters Connected
                </div>
              </div>
            </div>

            {/* Amber Upward Trend Wave */}
            <svg
              className="w-11 h-6 text-[#F59E0B] flex-shrink-0"
              viewBox="0 0 44 24"
              fill="none"
            >
              <path
                d="M 3 20 C 13 20 17 14 25 14 C 31 14 35 6 42 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 35 4 H 42 V 11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* CARD 4: Food Waste Prevented */}
          <div className="bg-white/95 backdrop-blur-md rounded-[22px] px-6 py-5 shadow-[0_6px_28px_rgba(0,0,0,0.05)] border border-neutral-100/90 flex items-center justify-between transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              {/* Green Icon Badge */}
              <div className="w-13 h-13 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#16A34A] flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3 4.54 0 8.52-2.18 10.9-5.59C20.67 11.83 21 8.57 21 8c-1.33 0-2.67 0-4 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[25px] font-black text-[#142921] tracking-tight leading-tight">
                  12 Tons+
                </div>
                <div className="text-[12px] font-semibold text-[#64748B] mt-0.5">
                  Food Waste Prevented
                </div>
              </div>
            </div>

            {/* Green Upward Trend Wave */}
            <svg
              className="w-11 h-6 text-[#10B981] flex-shrink-0"
              viewBox="0 0 44 24"
              fill="none"
            >
              <path
                d="M 3 20 C 13 20 17 14 25 14 C 31 14 35 6 42 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 35 4 H 42 V 11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};