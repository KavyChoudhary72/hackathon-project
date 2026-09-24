"use client";

import React, { forwardRef } from "react";

interface StoryCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const StoryCanvas = forwardRef<HTMLDivElement, StoryCanvasProps>(
  ({ canvasRef }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="story-canvas-container sticky top-0 left-0 w-full h-screen overflow-hidden select-none pointer-events-none z-0 bg-[#0A1612]"
      >
        {/* Hardware-accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover transform-gpu"
        />

        {/* Cinematic Scrims:
            1. Top subtle gradient for floating navbar clarity
            2. Darkening radial vignette so foreground text & cards pop with crisp readability
            3. Bottom warm floor blend
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A1612] via-[#0A1612]/70 to-transparent pointer-events-none" />
      </div>
    );
  }
);

StoryCanvas.displayName = "StoryCanvas";
