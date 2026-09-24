"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0A1612] py-12 px-6 sm:px-8 relative z-20">
      <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-[13px] text-neutral-400">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-[15px]">FoodLink</span>
          <span>·</span>
          <span>Hyperlocal Food Rescue & Storytelling Platform</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 font-semibold">
          <Link href="/donor" className="hover:text-white transition-colors">
            Donor App
          </Link>
          <Link href="/shelter" className="hover:text-white transition-colors">
            Shelter Dashboard
          </Link>
          <Link href="/driver" className="hover:text-white transition-colors">
            Driver Mission
          </Link>
          <Link href="/rewards" className="hover:text-white transition-colors">
            Rewards
          </Link>
          <Link href="/admin/impact" className="hover:text-white transition-colors">
            CSR Impact
          </Link>
        </div>
      </div>
    </footer>
  );
};