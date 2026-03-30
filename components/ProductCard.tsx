"use client";

import Link from "next/link";
import { Product } from "@/lib/data-loader";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group flex flex-col premium-border bg-card/50 overflow-hidden transition-all duration-500 hover:bg-[#1a1a19] no-underline"
    >
      <div className="relative w-full overflow-hidden bg-card h-64 md:h-80 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-accent text-black text-[9px] font-black px-2 py-1 uppercase tracking-luxury">
            -{discount}% OFF
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow bg-black/40">
        <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-luxury text-white/50 group-hover:text-accent transition-colors duration-300 min-h-[40px] leading-relaxed">
          {product.title}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex justify-between items-center w-full gap-3">
            <span className="text-sm md:text-lg  text-white/20 line-through">
              £{product.originalPrice.toFixed(2)}
            </span>
            <span className="text-[10px] md:text-xl font-bold text-white">
              £{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
