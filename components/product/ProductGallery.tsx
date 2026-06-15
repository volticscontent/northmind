"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  title: string;
  discount: number;
  opcoesCor?: { name: string; image?: string }[];
  isFragrance?: boolean;
}

export function ProductGallery({ images, title, discount, opcoesCor, isFragrance }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset gallery index when the image list (variant) changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [images]);

  const safeImages = images && images.length > 0 ? images : ["/assets/community/1.png"];

  // Update active index based on scroll position for mobile
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <>
      {/* Desktop View (Left Thumbnails + Main Photo) */}
      <div className="hidden md:flex gap-6 items-start">
        {/* Vertical Thumbnail Carousel */}
        {safeImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="w-20 flex-shrink-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {safeImages.map((imgSrc, i) => (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative bg-white w-full aspect-[3/4] shrink-0 overflow-hidden rounded-md transition-all duration-300 ${i === activeIndex
                  ? "border border-white/60 scale-100 opacity-100"
                  : "border border-transparent opacity-40 hover:opacity-100 cursor-pointer"
                  }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${title} Thumbnail ${i + 1}`}
                  fill
                  quality={60}
                  sizes="80px"
                  className="object-cover"
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Foto Principal Desktop */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative flex-grow w-full bg-[#F5F5F5] overflow-hidden group rounded-lg"
          style={isFragrance ? { aspectRatio: '1/1' } : { aspectRatio: '4/5' }}
        >
          <Image
            src={safeImages[activeIndex]}
            alt={`${title} Principal`}
            fill
            quality={85}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
              -{discount}% OFF
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile View (Native CSS Snap Carousel) */}
      <div className="md:hidden relative w-full">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {safeImages.map((imgSrc, i) => (
            <div
              key={i}
              className="relative w-full flex-shrink-0 snap-center bg-[#F5F5F5] rounded-xl overflow-hidden mr-2 last:mr-0"
              style={isFragrance ? { aspectRatio: '1/1' } : { aspectRatio: '3/4' }}
            >
              <Image
                src={imgSrc}
                alt={`${title} view ${i + 1}`}
                fill
                quality={85}
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {discount > 0 && i === 0 && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm">
                  -{discount}% OFF
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Minimalist Dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-full flex gap-2">
              {safeImages.map((_, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 rounded-full ${i === activeIndex
                    ? "w-4 h-1.5 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
