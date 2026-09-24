"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200/60 bg-white/60 py-10 px-6 sm:px-8">
      <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#64748B]">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#142921]">FoodLink</span>
          <span>·</span>
          <span>Hyperlocal Food Rescue Platform</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 font-semibold">
          <Link href="/donor" className="hover:text-[#142921] transition-colors">
            Donor App
          </Link>
          <Link href="/shelter" className="hover:text-[#142921] transition-colors">
            Shelter Dashboard
          </Link>
          <Link href="/driver" className="hover:text-[#142921] transition-colors">
            Driver Mission
          </Link>
          <Link href="/rewards" className="hover:text-[#142921] transition-colors">
            Rewards
          </Link>
          <Link href="/admin/impact" className="hover:text-[#142921] transition-colors">
            CSR Impact
          </Link>
        </div>
      </div>
    </footer>
  );
};