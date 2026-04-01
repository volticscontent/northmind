"use client";

import { useRef, useState, useEffect } from "react";
import { Product } from "@/lib/data-loader";
import { ProductCard } from "../ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  collection: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="pt-12 pb-2 px-2 md:px-8 max-w-[1600px] mx-auto w-full group/section">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black px-2">
            Our Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white px-2 ">
            {title}
          </h2>
        </div>

        {/* Navigation Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-4 rounded-full border transition-all duration-500 ${canScrollLeft
              ? "border-white/20 text-white hover:bg-white hover:text-black"
              : "border-white/5 text-white/10"
              }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-4 rounded-full border transition-all duration-500 ${canScrollRight
              ? "border-white/20 text-white hover:bg-white hover:text-black"
              : "border-white/5 text-white/10"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-4 pb-2 md:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatorypt-2"
          style={{ scrollPadding: "0 2rem" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[240px] md:w-[320px] lg:w-[380px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Gradient Overlay for better feel */}
        <div className="absolute top-0 right-0 bottom-8 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-700 hidden md:block" />
      </div>
    </section>
  );
}
