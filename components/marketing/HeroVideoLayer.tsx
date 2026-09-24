"use client";

import React from "react";

export const HeroVideoLayer: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="hero-video-layer absolute top-0 left-0 right-0 h-[880px] lg:h-[940px] w-full pointer-events-none select-none overflow-hidden -z-10"
    >
      {/* 
        Atmospheric sky backdrop matching Reference Image 2:
        - Cool misty bluish-slate overcast glow on top-left (#8CA0B3)
        - Warm golden-peach apricot dawn glow on top-right (#DEB597)
        - Diffuses seamlessly down into warm ivory #FAF9F5 behind the stat cards
      */}
      <div
        className="w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 6% 10%, rgba(135, 155, 175, 0.58) 0%, rgba(165, 185, 202, 0.35) 35%, rgba(200, 214, 224, 0.15) 60%, transparent 80%),
            radial-gradient(ellipse 55% 50% at 94% 18%, rgba(226, 178, 142, 0.55) 0%, rgba(238, 202, 174, 0.32) 38%, rgba(246, 222, 204, 0.12) 65%, transparent 82%),
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(220, 225, 228, 0.42) 0%, rgba(235, 237, 235, 0.2) 45%, transparent 70%),
            linear-gradient(180deg, #E2E6E5 0%, #E9EAE5 24%, #F3F1EC 54%, #FAF9F5 86%, #FAF9F5 100%)
          `,
        }}
      />

      {/* Future video frame sequence canvas hook (zero placeholder text, clean DOM mount) */}
      <div id="hero-video-slot" className="absolute inset-0 pointer-events-none" />
    </div>
  );
};