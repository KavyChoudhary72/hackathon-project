"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollStory(containerRef: React.RefObject<HTMLElement>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Only execute in browser
    if (typeof window === "undefined") return;

    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Create ScrollTrigger pinning the canvas section
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=6000", // Scroll track length
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [containerRef]);

  return { scrollProgress };
}