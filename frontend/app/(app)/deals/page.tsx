"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  Tag,
  Search,
  Clock,
  MapPin,
  Utensils,
  Check,
  Percent,
  Sparkles,
  ShoppingBag,
  Store,
  ShieldCheck,
  Leaf,
  Filter,
} from "lucide-react";
import { APP_IMAGES } from "@/lib/images";

interface DealItem {
  id: string;
  title: string;
  restaurant: string;
  distance: string;
  isVeg: boolean;
  collectBy: string;
  originalPrice: number;
  rescuePrice: number;
  leftCount: number;
  category: string;
  image: string;
  photoBg: string;
  photoColor: string;
}

const DEALS_DATA: DealItem[] = [
  {
    id: "deal-1",
    title: "Veg Royal Thali",
    restaurant: "Hotel Saffron Kitchen",
    distance: "1.2 km",
    isVeg: true,
    collectBy: "9:30 PM",
    originalPrice: 160,
    rescuePrice: 20,
    leftCount: 18,
    category: "meals",
    image: APP_IMAGES.thaliCombo,
    photoBg: "#F4E4CC",
    photoColor: "#7A4A06",
  },
  {
    id: "deal-2",
    title: "Fresh Artisanal Bread & Buns",
    restaurant: "Baker's Corner Malviya Nagar",
    distance: "2.4 km",
    isVeg: true,
    collectBy: "10:15 PM",
    originalPrice: 90,
    rescuePrice: 10,
    leftCount: 12,
    category: "bakery",
    image: APP_IMAGES.breadBuns,
    photoBg: "#EFE3D0",
    photoColor: "#6B4423",
  },
  {
    id: "deal-3",
    title: "Paneer Kathi Roll Box (2 Pcs)",
    restaurant: "Rawat Sweets & Restaurant",
    distance: "2.8 km",
    isVeg: true,
    collectBy: "9:45 PM",
    originalPrice: 180,
    rescuePrice: 35,
    leftCount: 8,
    category: "meals",
    image: APP_IMAGES.paneerRoll,
    photoBg: "#FDE8DD",
    photoColor: "#C2410C",
  },
  {
    id: "deal-4",
    title: "Assorted Pastry & Muffin Pack",
    restaurant: "Brown Sugar Bakery",
    distance: "3.1 km",
    isVeg: true,
    collectBy: "10:30 PM",
    originalPrice: 220,
    rescuePrice: 40,
    leftCount: 6,
    category: "bakery",
    image: APP_IMAGES.pastries,
    photoBg: "#F3E9DF",
    photoColor: "#7A3A1C",
  },
  {
    id: "deal-5",
    title: "North Indian Dal Makhani Combo",
    restaurant: "Grand Haveli Dining",
    distance: "1.8 km",
    isVeg: true,
    collectBy: "9:50 PM",
    originalPrice: 200,
    rescuePrice: 30,
    leftCount: 14,
    category: "meals",
    image: APP_IMAGES.dalChawal,
    photoBg: "#E3F5EA",
    photoColor: "#166534",
  },
  {
    id: "deal-6",
    title: "Samosa & Mirchi Vada Snack Box",
    restaurant: "Jaipur Express Snacks",
    distance: "0.9 km",
    isVeg: true,
    collectBy: "9:15 PM",
    originalPrice: 100,
    rescuePrice: 15,
    leftCount: 22,
    category: "snacks",
    image: APP_IMAGES.samosaSnack,
    photoBg: "#FFF1D1",
    photoColor: "#8A5A0B",
  },
];

export default function RescueDealsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [claimedDeal, setClaimedDeal] = useState<DealItem | null>(DEALS_DATA[0]);

  const filteredDeals = DEALS_DATA.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        d.title.toLowerCase().includes(q) || d.restaurant.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (filter === "distance") return parseFloat(d.distance) <= 2.0;
    if (filter === "veg") return d.isVeg;
    if (filter === "bakery") return d.category === "bakery";
    if (filter === "under30") return d.rescuePrice <= 25;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* TOP HEADER: Title + Subtitle + Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white border border-[#ECE9E1] rounded-[24px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1D1] flex items-center justify-center text-[#E89B1C] flex-shrink-0 shadow-xs">
            <Tag className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#0E3B2E] tracking-tight">
                Rescue Deals Near You
              </h1>
              <span className="ui-chip bg-[#FFF1D1] text-[#7A4A06] text-[12px] font-bold">
                Tier 2 Flash Surplus
              </span>
              <span className="ui-chip bg-[#DCF5E4] text-[#166534] text-[12px] font-bold">
                70-85% Off
              </span>
            </div>
            <span className="text-[14px] text-[#5B6661]">
              Fresh, high-quality food from Jaipur restaurants at a nominal price. Self-pickup only.
            </span>
          </div>
        </div>

        {/* Search Input Bar */}
        <label className="w-full lg:w-80 h-[48px] bg-[#F6F5F1] border border-[#ECE9E1] rounded-full flex items-center gap-3 px-4 shadow-2xs">
          <Search className="w-4 h-4 text-[#5B6661] flex-shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food or restaurant..."
            className="border-0 outline-none text-[14px] flex-1 bg-transparent text-[#13231C] placeholder:text-[#5B6661]"
          />
        </label>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E3F5EA] flex items-center justify-center text-[#1E9E5A] flex-shrink-0">
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Live Active Deals
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              {filteredDeals.length} <span className="text-base font-medium text-[#5B6661]">items</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              Malviya Nagar, Jaipur
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FDE8DD] flex items-center justify-center text-[#E0531F] flex-shrink-0">
            <Percent className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Average Discount
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              78%
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              Nominal recovery fee
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFF1D1] flex items-center justify-center text-[#E89B1C] flex-shrink-0">
            <Leaf className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Rescued from Waste
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              410 <span className="text-base font-medium text-[#5B6661]">kg</span>
            </span>
            <span className="text-[12px] font-semibold text-[#166534]">
              This month
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="ui-card p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-[#E0EAFF] flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
            <Store className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5B6661]">
              Partner Kitchens
            </span>
            <span className="font-outfit text-[28px] font-bold text-[#13231C] leading-tight">
              18
            </span>
            <span className="text-[12px] font-semibold text-[#1D4ED8]">
              FSSAI Verified
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CHIPS ROW */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`h-[38px] px-5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
            filter === "all"
              ? "bg-[#0E3B2E] text-white shadow-xs"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:bg-[#F6F5F1]"
          }`}
        >
          All Deals ({DEALS_DATA.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("distance")}
          className={`h-[38px] px-5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
            filter === "distance"
              ? "bg-[#0E3B2E] text-white shadow-xs"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:bg-[#F6F5F1]"
          }`}
        >
          Within 2 km
        </button>

        <button
          type="button"
          onClick={() => setFilter("veg")}
          className={`h-[38px] px-5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
            filter === "veg"
              ? "bg-[#0E3B2E] text-white shadow-xs"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:bg-[#F6F5F1]"
          }`}
        >
          100% Pure Veg
        </button>

        <button
          type="button"
          onClick={() => setFilter("bakery")}
          className={`h-[38px] px-5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
            filter === "bakery"
              ? "bg-[#0E3B2E] text-white shadow-xs"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:bg-[#F6F5F1]"
          }`}
        >
          Bakery &amp; Pastries
        </button>

        <button
          type="button"
          onClick={() => setFilter("under30")}
          className={`h-[38px] px-5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
            filter === "under30"
              ? "bg-[#0E3B2E] text-white shadow-xs"
              : "bg-white border border-[#DCD9D0] text-[#2A3A33] hover:bg-[#F6F5F1]"
          }`}
        >
          Under ₹25 / meal
        </button>
      </div>

      {/* MAIN DESKTOP GRID: 2 Columns Left (Deals Marketplace Cards) + 1 Column Right (Voucher & Pickup Ticket) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT 2 COLUMNS: Available Deals Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredDeals.map((deal) => {
            const isSelected = claimedDeal?.id === deal.id;
            return (
              <div
                key={deal.id}
                className={`ui-card p-5 flex flex-col justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all ${
                  isSelected ? "border-2 border-[#0E3B2E] ring-4 ring-[#0E3B2E]/5" : ""
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-20 h-20 rounded-[18px] object-cover flex-shrink-0 shadow-2xs border border-[#ECE9E1]"
                    loading="lazy"
                  />

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="font-outfit text-[18px] font-bold text-[#13231C] leading-snug truncate">
                      {deal.title}
                    </span>
                    <span className="text-[13px] text-[#5B6661] truncate">
                      {deal.restaurant} · <b>{deal.distance}</b>
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="ui-chip bg-[#E3F5EA] text-[#166534] text-[11px] h-6 px-2.5">
                        Veg
                      </span>
                      <span className="ui-chip bg-[#FFF1D1] text-[#7A4A06] text-[11px] h-6 px-2.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>By {deal.collectBy}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#F0EEE8]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-outfit text-[28px] font-extrabold text-[#13231C]">
                      ₹{deal.rescuePrice}
                    </span>
                    <span className="text-[14px] text-[#8A938F] line-through">
                      ₹{deal.originalPrice}
                    </span>
                    <span className="text-[12px] text-[#5B6661]">· {deal.leftCount} left</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setClaimedDeal(deal)}
                    className={`h-11 px-5 rounded-[14px] font-bold text-[14px] shadow-2xs transition-all active:scale-95 ${
                      isSelected
                        ? "bg-[#1E9E5A] text-white"
                        : "bg-[#0E3B2E] hover:bg-[#17553F] text-white"
                    }`}
                  >
                    {isSelected ? "Claimed ✓" : "Claim"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN (1 COL): Active Voucher / Pickup Ticket & Safety Card */}
        <div className="flex flex-col gap-6">
          {claimedDeal ? (
            /* CLAIMED VOUCHER TICKET */
            <div className="ui-card p-6 flex flex-col gap-5 bg-white border-2 border-[#CDE8D6] shadow-[0_8px_30px_rgba(14,59,46,0.12)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E1]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E5A]" />
                  <span className="font-outfit text-[18px] font-bold text-[#13231C]">
                    Active Voucher Ticket
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setClaimedDeal(null)}
                  className="text-[12px] font-semibold text-[#5B6661] hover:text-[#C2410C]"
                >
                  Dismiss
                </button>
              </div>

              {/* OTP Code Badge */}
              <div className="bg-[#0E3B2E] text-white rounded-[22px] p-5 flex flex-col items-center justify-center gap-1 shadow-md">
                <span className="text-[12px] text-[#C9DDD3] tracking-wide uppercase font-semibold">
                  Show this OTP at restaurant counter
                </span>
                <span className="font-outfit text-[46px] font-black tracking-[0.25em] leading-none text-[#F6F5F1]">
                  5531
                </span>
              </div>

              {/* Deal Specifics */}
              <div className="flex flex-col gap-2.5 text-[14px] bg-[#F6F5F1] p-4 rounded-[16px]">
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Item:</span>
                  <b className="font-bold text-[#13231C]">{claimedDeal.title}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Merchant:</span>
                  <b className="font-bold text-[#13231C]">{claimedDeal.restaurant}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Payable Amount:</span>
                  <b className="font-bold text-[#166534] text-[16px]">₹{claimedDeal.rescuePrice} (Cash/UPI)</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6661]">Collection Cutoff:</span>
                  <b className="font-bold text-[#C2410C]">{claimedDeal.collectBy}</b>
                </div>
              </div>

              <span className="text-[12px] leading-relaxed text-[#5B6661]">
                Surplus meal packaged fresh tonight by <b>{claimedDeal.restaurant}</b>. Consume before midnight.
              </span>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary h-13 rounded-[16px] text-[15px] font-bold justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4 fill-white" />
                <span>Get Pickup Directions</span>
              </a>
            </div>
          ) : (
            /* HOW IT WORKS / NO DEAL CLAIMED */
            <div className="ui-card p-6 flex flex-col gap-4 bg-[#F6F5F1] border border-[#ECE9E1] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <span className="font-outfit text-[18px] font-bold text-[#13231C]">
                How Rescue Deals Work
              </span>
              <p className="text-[13px] text-[#5B6661] leading-relaxed">
                Tier-2 deals help local kitchens sell unconsumed premium surplus at nominal cost instead of wasting it.
              </p>
              <ul className="text-[13px] text-[#5B6661] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                  <span>Click <b>Claim</b> to reserve your portion instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                  <span>Present your 4-digit OTP at the counter before closing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E3B2E] mt-1.5 flex-shrink-0" />
                  <span>Pay nominal recovery price via UPI or cash.</span>
                </li>
              </ul>
            </div>
          )}

          {/* FSSAI & QUALITY GUARANTEE CARD */}
          <div className="ui-card p-6 flex flex-col gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0E3B2E]" />
              <span className="font-outfit text-[17px] font-bold text-[#13231C]">
                Hygiene &amp; Safety Verified
              </span>
            </div>
            <p className="text-[13px] text-[#5B6661] leading-relaxed">
              All deals listed on FoodLink comply with FSSAI Surplus Guidelines. Prepared the same evening and packed in food-grade containers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}