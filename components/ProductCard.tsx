"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data-loader";
import { Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, priority = false, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  // Elite Pricing Logic: Check if there are variants with different prices
  const variants = product.variantes || [];
  const isFragrance = product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance");
  
  // Para perfumes, priorizamos o preço da variante de 100ml se disponível, 
  // pois é a variante selecionada por padrão na página do produto.
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
        className="relative w-full overflow-hidden bg-[#F2F2F2] flex items-center justify-center group"
        style={{
          aspectRatio: (product.collection?.toLowerCase().includes('fragrance') || product.collection?.toLowerCase().includes('offer'))
            ? '1/1'
            : '4/5'
        }}
      >
        {/* Main Image */}
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover transition-all duration-1000 ease-in-out ${isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
        />

        {/* Hover Image (Secondary) */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-all duration-1000 ease-in-out absolute inset-0 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
        )}

        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-accent text-black text-[9px] font-black px-2 py-1 uppercase tracking-luxury shadow-lg">
            -{discount}% OFF
          </div>
        )}

        {/* Quick Size Overlay on Hover */}
        <div className={`absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3 translate-y-full transition-transform duration-500 flex flex-wrap gap-1 justify-center ${isHovered ? 'translate-y-0' : ''}`}>
          <span className="text-[8px] font-black uppercase tracking-widest text-black/40 w-full text-center mb-1">Available Sizes</span>
          {((product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance"))
            ? ["100ml"]
            : (product.opcoesTamanho && product.opcoesTamanho.length > 0 ? product.opcoesTamanho : ["S", "M", "L", "XL", "XXL"])
          ).slice(0, 5).map(size => (
            <span key={size} className="text-[9px] font-bold border border-black/10 px-1.5 py-0.5 rounded text-black/70">
              {size}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-2 pb-4 flex-grow md:p-5 border-black bg-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-luxury text-black truncate flex-grow">
            {product.title}
          </h3>
          {/* Color Dots */}
          <div className="flex gap-1 ml-2">
            {product.opcoesCor?.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <p className="text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-black/40 mb-3">
          {product.collection}
        </p>

        {/* Premium Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={`${s <= Math.round(rating) ? "fill-accent text-accent" : "text-black/10"}`}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
            ({totalReviews})
          </span>
        </div>

        <div className="mt-auto space-y-1">
          {discount > 0 && (
            <span className="text-[11px] md:text-sm text-black/40 line-through font-medium">
              £{product.originalPrice.toFixed(2)}
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            {hasPriceVariation && (
              <span className="text-[9px] text-accent font-black uppercase tracking-widest italic">From</span>
            )}
            <span className="text-base md:text-xl font-black text-black tracking-tight">
              £{minPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const baseClassName = "group flex flex-col bg-white overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] no-underline cursor-pointer border border-black/5";

  if (onClick) {
    return (
      <div
        onClick={() => onClick(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseClassName}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${product.handle}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={baseClassName}
    >
      {content}
    </Link>
  );
}
