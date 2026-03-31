"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale contrast-125"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-white">
          British Heritage <br />
          <span className="gold-stroke">Premium</span>
        </h1>
        <p className="text-xs md:text-base text-white/60 max-w-xl mx-auto mb-12 font-medium tracking-wide leading-relaxed">
          Discover the harmony between classic British design and contemporary sophistication. Essentials crafted to last for generations.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full md:w-auto">
          <Link
            href="/collections/jackets"
            className="btn-premium bg-white block w-full md:w-auto text-center"
          >
            Shop Collection
          </Link>
          <Link href="/collections/silent-warmth" className="text-[10px] font-bold uppercase tracking-luxury text-white/80 hover:text-white transition-all duration-300 px-6 py-4">
            View Lookbook
          </Link>
        </div>
      </div>
    </section>
  );
}
