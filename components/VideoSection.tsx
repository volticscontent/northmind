"use client";

export function VideoSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-screen overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-80 grayscale"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>
      {/* Subtle overlay to keep it dark/premium */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
    </section>
  );
}
