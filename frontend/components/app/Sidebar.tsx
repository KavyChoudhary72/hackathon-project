"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  PackageOpen,
  Trophy,
  BarChart3,
  Building2,
  Truck,
  Tag,
  HelpCircle,
  LogOut,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/donor",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/donor",
    },
    {
      href: "/donor/new",
      label: "Post food",
      icon: PlusCircle,
      active: pathname === "/donor/new",
    },
    {
      href: "/donor/donations/1025",
      label: "My donations",
      icon: PackageOpen,
      active: pathname.startsWith("/donor/donations"),
    },
    {
      href: "/rewards",
      label: "Rewards",
      icon: Trophy,
      active: pathname === "/rewards",
    },
    {
      href: "/admin/impact",
      label: "Impact",
      icon: BarChart3,
      active: pathname.startsWith("/admin/impact"),
    },
    {
      href: "/shelter",
      label: "Shelter",
      icon: Building2,
      active: pathname === "/shelter",
    },
    {
      href: "/driver",
      label: "Driver",
      icon: Truck,
      active: pathname === "/driver",
    },
    {
      href: "/deals",
      label: "Rescue deals",
      icon: Tag,
      active: pathname === "/deals",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar matching Sidebar_component.html */}
      <aside className="hidden lg:flex flex-col justify-between w-64 min-h-[920px] bg-white border border-[#ECE9E1] rounded-[28px] p-[28px_18px_24px] flex-shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sticky top-6 self-start">
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2.5 select-none">
            <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="flex-shrink-0">
              <path d="M17 30s-11-6.6-11-14.2A6 6 0 0 1 17 12a6 6 0 0 1 11 3.8C28 23.4 17 30 17 30z" fill="#F2622E" />
              <path d="M16 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#1E9E5A" />
              <path d="M16 12c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5z" fill="#F5B82E" />
            </svg>
            <span className="font-outfit text-[24px] font-bold tracking-tight text-[#0E3B2E]">
              Food<span className="text-[#1E9E5A]">Link</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 h-[48px] px-4 rounded-[14px] text-[15px] font-semibold transition-all ${
                    item.active
                      ? "bg-[#0E3B2E] text-white shadow-sm"
                      : "text-[#2A3A33] hover:text-[#0E3B2E] hover:bg-[#F6F5F1]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 stroke-[2]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Footer Links */}
        <div className="flex flex-col gap-5 pt-6">
          {/* "Good food, better futures." Card */}
          <div className="bg-[#E8F3EC] rounded-[22px] p-5 flex flex-col gap-3.5 text-left">
            <svg width="56" height="48" viewBox="0 0 64 56" aria-hidden="true" className="flex-shrink-0">
              <path d="M14 22h36l-4 28H18z" fill="#F7A55B" />
              <path d="M32 44s-8-4.8-8-10a4 4 0 0 1 8-1.8A4 4 0 0 1 40 34c0 5.2-8 10-8 10z" fill="#F2622E" />
              <path d="M20 22c-2-9 2-15 9-17 1 8-2 14-9 17z" fill="#1E9E5A" />
              <path d="M44 22c3-8 0-14-6-17-2 7 0 13 6 17z" fill="#3FB871" />
            </svg>
            <div className="font-outfit text-[19px] font-bold leading-tight text-[#0E3B2E]">
              Good food, better futures.
            </div>
            <Link
              href="/admin/impact"
              className="text-[14px] font-semibold text-[#0E3B2E] hover:text-[#C2410C] transition-colors"
            >
              See your impact →
            </Link>
          </div>

          {/* Sub Links */}
          <div className="flex flex-col gap-1 px-3 text-[14px] font-medium text-[#2A3A33]">
            <Link
              href="/styleguide"
              className="h-9 flex items-center gap-2.5 hover:text-[#0E3B2E] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help &amp; support</span>
            </Link>
            <Link
              href="/"
              className="h-9 flex items-center gap-2.5 hover:text-[#0E3B2E] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE9E1] px-2 py-2 flex items-center justify-around">
        <Link
          href="/donor"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            pathname === "/donor" ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/donor/new"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            pathname === "/donor/new" ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
          }`}
        >
          <PlusCircle className="w-5 h-5 text-[#F2622E]" />
          <span>Post</span>
        </Link>
        <Link
          href="/shelter"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            pathname === "/shelter" ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Shelter</span>
        </Link>
        <Link
          href="/driver"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            pathname === "/driver" ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Driver</span>
        </Link>
        <Link
          href="/rewards"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            pathname === "/rewards" ? "text-[#0E3B2E] font-black" : "text-[#5B6661]"
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Rewards</span>
        </Link>
      </nav>
    </>
  );
};
