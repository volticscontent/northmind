"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useIsMobile } from "../lib/hooks";
import { useRouter } from "next/navigation";
import { FrameSequence } from "./FrameSequence";

// Dynamically import CircularGallery to avoid SSR issues with OGL
const CircularGallery = dynamic(() => import("./effects/mobile/CircularGallery"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/20 animate-pulse" />,
});

interface VideoSectionProps {
  collections?: {
    name: string;
    handle: string;
    image?: string;
  }[];
}

export function VideoSection({ collections = [] }: VideoSectionProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const galleryItems = collections.map(c => ({
    image: c.image || "/collections/placeholder.png",
    text: c.name,
    href: `/collections/${c.handle}`
  }));

  const handleItemClick = useCallback((item: any) => {
    if (item.href) {
      router.push(item.href);
    }
  }, [router]);

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black">
      {/* Background Frame Sequence - PURE BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <FrameSequence
          key={isMobile ? "mobile" : "desktop"}
          basePath={isMobile ? "/assets/video-section-frames/mobile" : "/assets/video-section-frames/desktop"}
          frameCount={381}
          fps={20}
          poster="/assets/video_section-poster.jpg"
          className="h-full w-full object-cover opacity-55 grayscale contrast-125"
        />
        {/* Gradient Overlays inside background layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
      </div>

      {/* Content Layer - Floating over background */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-24 pb-12">
        {/* Header Title - Project Typography Applied */}
        <div className="text-center px-6 mb-12 font-plus-jakarta-sans">
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-2xl">
            HERITAGE COLLECTIONS
          </h2>
          <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-3" />
          <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-white/50 font-bold font-sans">
            Masterfully Crafted Editions
          </p>
        </div>

        {/* Interactive Gallery - Centered with proper height padding */}
        <div className="w-full h-[450px] md:h-[650px] relative">
          <CircularGallery
            items={galleryItems.length > 0 ? galleryItems : undefined}
            onItemClick={handleItemClick}
            bend={isMobile ? 1.5 : 3}
            textColor="#ffffff"
            borderRadius={0.05}
          />
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 text-center px-6 opacity-50">
          <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/80 font-sans">
            {isMobile ? "Drag to explore" : "Scroll or Drag to explore"}
          </p>
        </div>
      </div>
    </section>
  );
}
