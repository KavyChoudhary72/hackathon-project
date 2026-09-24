"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

interface NavbarProps {
  activeChapter?: string;
  onNavigateChapter?: (chapterId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeChapter = "home",
  onNavigateChapter,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, chapterId: string) => {
    if (onNavigateChapter) {
      e.preventDefault();
      onNavigateChapter(chapterId);
    }
  };

  const navLinks = [
    { id: "home", label: "Home", href: "#home" },
    { id: "how-it-works", label: "How it Works", href: "#how-it-works" },
    { id: "impact", label: "Impact", href: "#impact" },
    { id: "about", label: "About", href: "#about" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 transition-all duration-300 ${
        isScrolled ? "pt-3" : "pt-6"
      }`}
    >
      <header className="max-w-[1340px] w-full bg-white/95 backdrop-blur-md rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-black/[0.04] transition-all">
        {/* LEFT: FoodLink Logo */}
        <Link
          href="/"
          onClick={(e) => handleLinkClick(e, "home")}
          className="flex items-center gap-2.5 select-none"
        >
          <svg
            className="w-8 h-8 flex-shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Leaf Petal (Coral Orange) */}
            <path
              d="M16 6C13.2 2.8 8.8 2.8 6 5.6C3.2 8.4 3.2 12.8 6.5 15.5L16 23.5V6Z"
              fill="#F9683A"
            />
            {/* Right Leaf Petal (Green) */}
            <path
              d="M16 6C18.8 2.8 23.2 2.8 26 5.6C28.8 8.4 28.8 12.8 25.5 15.5L16 23.5V6Z"
              fill="#16A34A"
            />
            {/* Bottom Accent Circle (Amber) */}
            <circle cx="16" cy="20.5" r="4" fill="#F5A623" />
          </svg>
          <span className="text-[22px] font-black tracking-tight text-[#142921]">
            FoodLink
          </span>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeChapter === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`transition-all duration-200 px-4 py-1.5 rounded-full font-bold text-[14px] flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#E8F5E9] text-[#142921] shadow-sm"
                    : "text-[#4A5568] hover:text-[#142921] hover:bg-neutral-100/60"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4A5568] hover:text-[#142921] hover:bg-neutral-100/60 transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Login Button */}
          <Link
            href="/donor"
            className="hidden sm:inline-flex px-5 py-2 rounded-full border border-neutral-200/90 text-[14px] font-bold text-[#142921] hover:bg-neutral-50 transition-all active:scale-[0.98]"
          >
            Login
          </Link>

          {/* Primary CTA: Donate Now */}
          <Link
            href="/donor/new"
            className="bg-[#113A2B] hover:bg-[#1B4332] text-white px-5 sm:px-6 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-1.5 shadow-[0_2px_10px_rgba(17,58,43,0.15)] transition-all active:scale-[0.98]"
          >
            <span>Donate Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </header>
    </div>
  );
};