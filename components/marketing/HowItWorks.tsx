"use client";

import React from "react";

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full pb-24 sm:pb-28">
      <div className="max-w-[1340px] px-6 sm:px-8 mx-auto">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] text-[#166534] text-[12px] font-bold tracking-tight mb-4">
            <span>🌱</span>
            <span>Simple Process, Big Impact</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
            <h2 className="text-4xl sm:text-[44px] font-black text-[#142921] tracking-[-0.03em] leading-tight">
              How It Works
            </h2>
            <p className="text-[15px] text-[#5F6F67] leading-snug font-medium max-w-md">
              From your extra food to someone's next meal. <br />
              A simple process with a big impact.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 01: Donate */}
          <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
              {/* Badge */}
              <span className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#166534] font-extrabold text-[14px] flex items-center justify-center">
                01
              </span>

              {/* Box of Vegetables SVG Illustration */}
              <svg
                className="w-16 h-16 flex-shrink-0"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Carrot 1 */}
                <path
                  d="M26 14L32 28L24 26L26 14Z"
                  fill="#F97316"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M26 14L28 8M26 14L23 9"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Broccoli */}
                <circle cx="40" cy="18" r="8" fill="#22C55E" stroke="#142921" strokeWidth="2" />
                <circle cx="34" cy="20" r="5" fill="#16A34A" stroke="#142921" strokeWidth="2" />
                <circle cx="45" cy="20" r="5" fill="#15803D" stroke="#142921" strokeWidth="2" />
                {/* Tomato */}
                <circle cx="21" cy="24" r="6" fill="#EF4444" stroke="#142921" strokeWidth="2" />
                <path d="M21 18V16M19 17L23 17" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                {/* Cardboard Box */}
                <path
                  d="M12 28H52L48 54H16L12 28Z"
                  fill="#D97706"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Box Front Panel */}
                <path
                  d="M16 34H48L46 54H18L16 34Z"
                  fill="#F59E0B"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Left/Right Box Flaps */}
                <path
                  d="M8 24L16 28L12 34L4 30L8 24Z"
                  fill="#B45309"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M56 24L48 28L52 34L60 30L56 24Z"
                  fill="#B45309"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#142921] mb-2 tracking-tight">
                Donate
              </h3>
              <p className="text-[13px] text-[#64748B] leading-[1.6] font-medium">
                Share details about the surplus food you have available.
              </p>
            </div>
          </div>

          {/* CARD 02: Match */}
          <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
              {/* Badge */}
              <span className="w-9 h-9 rounded-full bg-[#FFEAE8] text-[#F9683A] font-extrabold text-[14px] flex items-center justify-center">
                02
              </span>

              {/* House with Heart SVG Illustration */}
              <svg
                className="w-16 h-16 flex-shrink-0"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Chimney */}
                <rect x="42" y="14" width="6" height="12" fill="#E2E8F0" stroke="#142921" strokeWidth="2" />
                {/* House Base */}
                <path
                  d="M16 28V52H48V28"
                  fill="#FEFDF9"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Roof */}
                <path
                  d="M10 30L32 12L54 30H10Z"
                  fill="#F9683A"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Eaves line */}
                <path d="M14 28L32 14L50 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                {/* Arched Doorway */}
                <path
                  d="M26 52V38C26 34.7 28.7 32 32 32C35.3 32 38 34.7 38 38V52H26Z"
                  fill="#FFEAE8"
                  stroke="#142921"
                  strokeWidth="2"
                />
                {/* Red Heart */}
                <path
                  d="M32 44C32 44 28 41 28 38.5C28 37.1 29.1 36 30.5 36C31.3 36 32 36.5 32 36.5C32 36.5 32.7 36 33.5 36C34.9 36 36 37.1 36 38.5C36 41 32 44 32 44Z"
                  fill="#EF4444"
                  stroke="#142921"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#142921] mb-2 tracking-tight">
                Match
              </h3>
              <p className="text-[13px] text-[#64748B] leading-[1.6] font-medium">
                We connect your donation to the nearest shelters in need.
              </p>
            </div>
          </div>

          {/* CARD 03: Deliver */}
          <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
              {/* Badge */}
              <span className="w-9 h-9 rounded-full bg-[#FEF4E2] text-[#F59E0B] font-extrabold text-[14px] flex items-center justify-center">
                03
              </span>

              {/* Delivery Truck SVG Illustration */}
              <svg
                className="w-16 h-16 flex-shrink-0"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Yellow Cargo Container */}
                <rect
                  x="10"
                  y="20"
                  width="30"
                  height="24"
                  rx="3"
                  fill="#FBBF24"
                  stroke="#142921"
                  strokeWidth="2"
                />
                {/* Horizontal Accent stripe */}
                <path d="M12 32H38" stroke="#F59E0B" strokeWidth="2.5" />
                {/* Red Cab */}
                <path
                  d="M40 28H48L54 36V44H40V28Z"
                  fill="#EF4444"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Windshield */}
                <path
                  d="M43 31H47L51 36H43V31Z"
                  fill="#60A5FA"
                  stroke="#142921"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Headlight */}
                <circle cx="53" cy="40" r="2" fill="#FEF08A" stroke="#142921" strokeWidth="1" />
                {/* Wheels */}
                <circle cx="20" cy="45" r="6" fill="#1F2937" stroke="#142921" strokeWidth="2" />
                <circle cx="20" cy="45" r="2.5" fill="#E5E7EB" />
                <circle cx="46" cy="45" r="6" fill="#1F2937" stroke="#142921" strokeWidth="2" />
                <circle cx="46" cy="45" r="2.5" fill="#E5E7EB" />
              </svg>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#142921] mb-2 tracking-tight">
                Deliver
              </h3>
              <p className="text-[13px] text-[#64748B] leading-[1.6] font-medium">
                Our verified drivers safely collect and deliver the food.
              </p>
            </div>
          </div>

          {/* CARD 04: Impact */}
          <div className="bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
              {/* Badge */}
              <span className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#166534] font-extrabold text-[14px] flex items-center justify-center">
                04
              </span>

              {/* Community People SVG Illustration */}
              <svg
                className="w-16 h-16 flex-shrink-0"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left person (Teal) */}
                <circle cx="20" cy="24" r="5" fill="#38BDF8" stroke="#142921" strokeWidth="2" />
                <path
                  d="M12 40C12 34 16 32 20 32C22 32 24 33 25 34"
                  fill="#38BDF8"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Right person (Teal) */}
                <circle cx="44" cy="24" r="5" fill="#38BDF8" stroke="#142921" strokeWidth="2" />
                <path
                  d="M39 34C40 33 42 32 44 32C48 32 52 34 52 40"
                  fill="#38BDF8"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Center person (Amber) */}
                <circle cx="32" cy="20" r="6" fill="#FBBF24" stroke="#142921" strokeWidth="2" />
                <path
                  d="M23 38C23 31 27 29 32 29C37 29 41 31 41 38H23Z"
                  fill="#FBBF24"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Red Heart centered below */}
                <path
                  d="M32 53C32 53 26 49 26 45C26 42.5 28 40.5 30 40.5C31.3 40.5 32 41.5 32 41.5C32 41.5 32.7 40.5 34 40.5C36 40.5 38 42.5 38 45C38 49 32 53 32 53Z"
                  fill="#EF4444"
                  stroke="#142921"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#142921] mb-2 tracking-tight">
                Impact
              </h3>
              <p className="text-[13px] text-[#64748B] leading-[1.6] font-medium">
                Your food reaches people in need and creates real change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};