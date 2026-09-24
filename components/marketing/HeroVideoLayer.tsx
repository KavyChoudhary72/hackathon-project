"use client";

import React from "react";

export const HeroVideoLayer: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="hero-video-layer absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none"
    >
      {/* Soft atmospheric background gradient matching the reference screenshot lighting */}
      <div className="absolute top-0 right-0 w-[65%] h-[85%] bg-gradient-to-bl from-[#EAE2D8]/50 via-[#E4EAE6]/40 to-transparent blur-3xl opacity-80" />
      <div className="absolute top-10 left-10 w-[45%] h-[60%] bg-gradient-to-br from-[#DFE6E3]/40 via-[#F3EBE3]/30 to-transparent blur-3xl opacity-70" />
    </div>
  );
};