"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data-loader";
import { Star, Plus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onClick?: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, priority = false, onClick, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  // Elite Pricing Logic: Check if there are variants with different prices
  const variants = product.variantes || [];
  const isFragrance = product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance");
  
  // For fragrances, we prioritize the 100ml variant price if available, 
  // as it is the default selected variant on the product page.
  const defaultVariant = isFragrance 
    ? variants.find((v: any) => v.label === "100ml" || v.name === "100ml")
    : null;

  const prices = variants.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p) && p > 0);
  const minPrice = defaultVariant ? Number(defaultVariant.price) : (prices.length > 0 ? Math.min(...prices) : product.price);
  const hasPriceVariation = !defaultVariant && prices.length > 1 && Math.max(...prices) !== Math.min(...prices);

  // Rating Stars Utility
  const rating = product.mediaAvaliacoes || 5;
  const totalReviews = product.totalAvaliacoes || 0;

  const content = (
    <>
      <div
        className={`relative w-full overflow-hidden ${isFragrance ? 'bg-[#F2F2F2]' : 'bg-[#050505]'} flex items-center justify-center group`}
        style={{ aspectRatio: '4/5' }}
      >
        {/* Main Image */}
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          quality={80}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover transition-transform duration-1000 ease-in-out ${isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
        />

        {/* Hover Image (Secondary) */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            fill
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-1000 ease-in-out absolute inset-0 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
        )}

        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-accent text-black text-[9px] font-black px-2 py-1 uppercase tracking-luxury shadow-lg">
            -{discount}% OFF
          </div>
        )}

        {/* Quick Add Overlay on Hover */}
        <div className={`absolute bottom-4 inset-x-4 flex items-center justify-center translate-y-[150%] opacity-0 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : ''}`}>
          <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors duration-300">
            <Plus size={14} /> Quick View
          </button>
        </div>
      </div>

      <div className="flex flex-col p-4 flex-grow bg-[#0a0a09] border-t border-white/5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-luxury text-white truncate flex-grow">
            {product.title}
          </h3>
          {/* Color Dots */}
          <div className="flex gap-1 ml-2">
            {product.opcoesCor?.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-white/40 mb-3">
          {product.collection}
        </p>

        {/* Premium Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={`${s <= Math.round(rating) ? "fill-accent text-accent" : "text-white/10"}`}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            ({totalReviews})
          </span>
        </div>

        <div className="mt-auto space-y-1">
          {discount > 0 && (
            <span className="text-[11px] md:text-sm text-white/40 line-through font-medium">
              £{product.originalPrice.toFixed(2)}
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            {hasPriceVariation && (
              <span className="text-[9px] text-accent font-black uppercase tracking-widest italic">From</span>
            )}
            <span className="text-base md:text-xl font-black text-white tracking-tight">
              £{minPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const baseClassName = "group flex flex-col overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(255,255,255,0.03)] no-underline cursor-pointer border border-white/5 bg-[#0a0a09]";

  if (onClick) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={() => onClick(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseClassName}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        href={`/product/${product.handle}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${baseClassName} h-full`}
      >
        {content}
      </Link>
    </motion.div>
  );
}
