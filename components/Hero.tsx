"use client";

import Link from "next/link";
import { FrameSequence } from "./FrameSequence";
import { useEffect, useState } from "react";

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative h-[90dvh] md:h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Frame Sequence - Bypasses iOS native player issues */}
      <div className="absolute inset-0 z-0">
        <FrameSequence
          key={isMobile ? "mobile" : "desktop"}
          basePath={isMobile ? "/assets/hero-frames/mobile" : "/assets/hero-frames/desktop"}
          frameCount={492}
          fps={40}
          poster="/assets/hero-video.png"
          className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
        <h1 className="text-3xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 md:mb-8 leading-[0.9] text-white">
          British Heritage <br />
          <span className="gold-stroke">Premium</span>
        </h1>
        <p className="text-xs md:text-base text-white/60 max-w-xl mx-auto mb-8 md:mb-12 font-medium tracking-wide leading-relaxed">
          Discover the harmony between classic British design and contemporary sophistication. Essentials crafted to last for generations.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full md:w-auto">
          <Link
            href="/collections/jackets"
            className="btn-premium bg-white block w-full md:w-auto text-center active:scale-[0.97] active:opacity-90"
          >
            Shop Collection
          </Link>
          <Link href="/collections/silent-warmth" className="text-[10px] font-bold uppercase tracking-luxury text-white/80 hover:text-white transition-all duration-300 px-6 py-4 active:text-accent min-h-[44px] flex items-center">
            View Lookbook
          </Link>
        </div>
      </div>
    </section>
  );
}
