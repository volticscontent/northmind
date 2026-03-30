"use client";

import Link from "next/link";
import { Product } from "@/lib/data-loader";

interface CollectionProductCardProps {
  product: Product;
}

export function CollectionProductCard({ product }: CollectionProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link 
      href={`/product/${product.handle}`}
      className="group flex flex-col no-underline bg-[#F4F4F4] transition-opacity hover:opacity-95"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute bottom-4 left-4 z-10 bg-[#111827] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Sale
          </div>
        )}
      </div>
      
      <div className="px-5 pb-6 pt-2 flex flex-col flex-grow">
        <h3 className="text-[13px] font-bold text-[#111827] mb-2 leading-tight group-hover:underline decoration-1 underline-offset-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2.5 mt-auto">
          {discount > 0 ? (
            <>
              <span className="text-[13px] text-[#868A91] line-through font-medium tracking-wide">
                £{product.originalPrice.toFixed(2)} GBP
              </span>
              <span className="text-[13px] font-bold text-[#111827] tracking-wide">
                £{product.price.toFixed(2)} GBP
              </span>
            </>
          ) : (
            <span className="text-[13px] font-bold text-[#111827] tracking-wide">
              £{product.price.toFixed(2)} GBP
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
