"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "../lib/hooks";
import { useRouter } from "next/navigation";

// Dynamically import CircularGallery to avoid SSR issues with OGL
const CircularGallery = dynamic(() => import("./effects/mobile/CircularGallery"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/20 animate-pulse" />
});

interface VideoSectionProps {
  collections?: {
    name: string;
    handle: string;
    image: string;
    description: string;
  }[];
}

export function VideoSection({ collections = [] }: VideoSectionProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const galleryItems = collections.map(c => ({
    image: c.image,
    text: c.name,
    href: `/collections/${c.handle}`
  }));

  const handleItemClick = (item: any) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <section className="relative w-full h-[60vh] md:h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125 z-0"
      >
        <source src="/assets/video_section.mp4" type="video/mp4" />
      </video>

      {/* Interactive Gallery Layer */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-[300px] md:h-[600px]">
          <CircularGallery
            items={galleryItems.length > 0 ? galleryItems : undefined}
            onItemClick={handleItemClick}
            bend={isMobile ? 1.5 : 3}
            textColor="#ffffff"
            borderRadius={0.05}
          />
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-0 right-0 text-center px-6 pointer-events-none">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white mb-2 drop-shadow-lg">
            HERITAGE COLLECTIONS
          </h2>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/70">
            {isMobile ? "Drag to explore" : "Scroll or Drag to explore"}
          </p>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
    </section>
  );
}
