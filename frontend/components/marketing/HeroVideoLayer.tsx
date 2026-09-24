"use client";

import React from "react";

export const HeroVideoLayer: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="hero-video-layer absolute top-0 left-0 right-0 w-full h-[760px] sm:h-[840px] lg:h-[920px] pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 
        Authoritative atmospheric sky background provided by the user:
        - Cool misty bluish-slate overcast glow on top-left
        - Warm golden-peach apricot dawn glow on top-right
        - Beautiful photographic clouds anchoring the top navbar & hero
      */}
      <img
        src="/hero-bg.png"
        alt=""
        className="w-full h-full object-cover object-top"
      />

      {/* Seamless bottom fade into #FAF9F5 page background behind KPI cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(250, 249, 245, 0) 55%, rgba(250, 249, 245, 0.6) 80%, #FAF9F5 100%)",
        }}
      />

      {/* Future video frame sequence canvas hook (zero placeholder text, clean DOM mount) */}
      <div id="hero-video-slot" className="absolute inset-0 pointer-events-none" />
    </div>
  );
};