"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageOpen,
  Trophy,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ArrowRight,
  Flame,
  Truck,
  Building2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = [
    {
      href: "/donor",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/donor",
    },
    {
      href: "/donor/donations/DN1024",
      label: t("nav.myDonations"),
      icon: PackageOpen,
      active: pathname.startsWith("/donor/donations"),
    },
    {
      href: "/rewards",
      label: t("nav.rewards"),
      icon: Trophy,
      active: pathname === "/rewards",
    },
    {
      href: "/admin/impact",
      label: t("nav.impact"),
      icon: BarChart3,
      active: pathname.startsWith("/admin/impact"),
    },
    {
      href: "/deals",
      label: t("nav.deals"),
      icon: Tag,
      active: pathname === "/deals",
    },
    {
      href: "/shelter",
      label: "Shelter View",
      icon: Building2,
      active: pathname === "/shelter",
    },
    {
      href: "/driver",
      label: "Driver Mission",
      icon: Truck,
      active: pathname === "/driver",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 min-h-screen bg-white border-r border-neutral-200/80 p-6 flex-shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-white font-black text-sm shadow-sm">
              <span className="text-accent-500 font-extrabold text-base">F</span>L
            </div>
            <span className="text-xl font-extrabold text-brand-800 tracking-tight">
              Food<span className="text-accent-500">Link</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150",
                    item.active
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 active:scale-97"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      item.active ? "text-white" : "text-neutral-500"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Promo Card & Footer Links from Reference Image 2 & 4 */}
        <div className="space-y-6 pt-6">
          {/* "Good Food Better Futures" Banner Card */}
          <div className="p-4 rounded-3xl bg-brand-50/80 border border-brand-100 flex flex-col justify-between gap-3 text-left relative overflow-hidden group">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-800">
              <Flame className="w-5 h-5 text-accent-500 fill-accent-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-900 leading-tight">
                Good Food
              </h4>
              <h4 className="text-xs font-bold text-accent-600 leading-tight">
                Better Futures
              </h4>
            </div>
            <Link
              href="/admin/impact"
              className="w-7 h-7 rounded-full bg-brand-800 text-white flex items-center justify-center self-end hover:bg-brand-700 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs font-semibold text-neutral-500">
            <Link
              href="/styleguide"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Dev Styleguide</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Landing Page</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (360px optimized) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-2 flex items-center justify-around shadow-float">
        <Link
          href="/donor"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold",
            pathname === "/donor"
              ? "text-brand-800 font-extrabold"
              : "text-neutral-500"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/donor/donations/DN1024"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold",
            pathname.startsWith("/donor/donations")
              ? "text-brand-800 font-extrabold"
              : "text-neutral-500"
          )}
        >
          <PackageOpen className="w-5 h-5" />
          <span>Track</span>
        </Link>
        <Link
          href="/shelter"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold",
            pathname === "/shelter"
              ? "text-brand-800 font-extrabold"
              : "text-neutral-500"
          )}
        >
          <Building2 className="w-5 h-5" />
          <span>Shelter</span>
        </Link>
        <Link
          href="/driver"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold",
            pathname === "/driver"
              ? "text-brand-800 font-extrabold"
              : "text-neutral-500"
          )}
        >
          <Truck className="w-5 h-5" />
          <span>Driver</span>
        </Link>
        <Link
          href="/rewards"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold",
            pathname === "/rewards"
              ? "text-brand-800 font-extrabold"
              : "text-neutral-500"
          )}
        >
          <Trophy className="w-5 h-5" />
          <span>Rewards</span>
        </Link>
      </nav>
    </>
  );
};
