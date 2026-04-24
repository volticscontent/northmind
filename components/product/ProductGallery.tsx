"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface ProductGalleryProps {
  images: string[];
  title: string;
  discount: number;
  opcoesCor?: { name: string; image?: string }[];
  isFragrance?: boolean;
}

export function ProductGallery({ images, title, discount, opcoesCor, isFragrance }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("color");

  // Reset gallery index when the image list (variant) changes
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const safeImages = images && images.length > 0 ? images : ["/assets/community/1.png"];
  return (
    <>
      {/* Desktop View (Left Thumbnails + Main Photo) */}
      <div className="hidden md:flex gap-4 items-start">
        {/* Vertical Thumbnail Carousel - Only shows if there are extra photos */}
        {safeImages.length > 1 && (
          <div
            className="w-20 lg:w-24 flex-shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-hide snap-y max-h-[calc(100vh-8rem)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {safeImages.map((imgSrc, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative bg-white w-full aspect-[4/4] shrink-0 snap-start overflow-hidden transition-all ${i === activeIndex
                  ? "border-2 border-accent scale-100 opacity-100"
                  : "border border-white/10 opacity-50 hover:opacity-100 cursor-pointer"
                  }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${title} Thumbnail ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Foto Principal Desktop */}
        <div
          className="relative flex-grow premium-border bg-white overflow-hidden group"
          style={isFragrance ? { aspectRatio: '1/1' } : { aspectRatio: '4/5' }}
        >
          <Image
            key={safeImages[activeIndex]}
            src={safeImages[activeIndex]}
            alt={`${title} Principal`}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          />
          {discount > 0 && (
            <div className="absolute top-4 right-4 z-10 bg-black text-white text-[10px] font-black px-3 py-1 uppercase tracking-luxury">
              -{discount}% EXCLUSIVE
            </div>
          )}
        </div>
      </div>

      {/* Mobile View (Main Photo + Carousel) */}
      <div className="flex md:hidden flex-col gap-[1px]">
        {/* Foto Principal */}
        <div
          className="relative w-full premium-border bg-white overflow-hidden"
          style={isFragrance ? { aspectRatio: '5/5' } : { aspectRatio: '4/5' }}
        >
          <Image
            key={safeImages[activeIndex]}
            src={safeImages[activeIndex]}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-accent border-l text-[10px] font-black px-3 py-1 uppercase tracking-luxury">
              -{discount}% EXCLUSIVE
            </div>
          )}
        </div>

        {/* Mobile Thumbnail Carousel - Only shows if there are extra photos */}
        {safeImages.length > 1 && (
          <div className="flex overflow-x-auto gap-[1px] pb-2 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {safeImages.map((imgSrc, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-[35%] aspect-[5/5] shrink-0 snap-start overflow-hidden transition-all ${i === activeIndex
                  ? "border border-yellow-300 bg-white scale-100 opacity-100"
                  : "border border-white/60 bg-white opacity-60 hover:opacity-100"
                  }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${title} Thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
