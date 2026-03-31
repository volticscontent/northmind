"use client";

import { Product } from "@/lib/data-loader";
import { Star, ShieldCheck, CheckCircle2, Package, Truck, Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import { ProductFaqBox } from "../product/ProductFaqBox";

interface AdminProductPreviewProps {
  product: Partial<Product> & { fotoPrincipal?: string };
  viewMode: "mobile" | "desktop";
}

export function AdminProductPreview({ product, viewMode }: AdminProductPreviewProps) {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const originalPrice = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : (product.originalPrice || 0);
  
  const discount = originalPrice > 0 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.fotoPrincipal || "/assets/placeholder.png"];

  const highlights = (product as any).highlights || [
    { icon: "ShieldCheck", title: "2 Year Warranty", text: "Heritage Guarantee" },
    { icon: "Truck", title: "Free UK Delivery", text: "Premium Courier" }
  ];

  return (
    <div className={`bg-black min-h-screen transition-all duration-500 mx-auto overflow-hidden border border-white/10 shadow-2xl ${
      viewMode === "mobile" ? "max-w-[375px] rounded-[3rem]" : "max-w-full"
    }`}>
      {/* Simulation of the Store Layout */}
      <div className={`${viewMode === "mobile" ? "scale-[0.95]" : "scale-100"} origin-top transition-transform h-full overflow-y-auto custom-scrollbar`}>
        <div className={`py-12 px-6 ${viewMode === "mobile" ? "space-y-8" : "grid grid-cols-2 gap-12 items-start"}`}>
          
          {/* Images */}
          <div className="space-y-4">
             <div className="relative aspect-[4/5] premium-border bg-white/5 overflow-hidden">
                <img 
                  src={images[0]} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-black/80 text-white text-[8px] font-black px-2 py-1 uppercase tracking-luxury">
                    -{discount}% EXCLUSIVE
                  </div>
                )}
             </div>
             <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-white/5 border border-white/5 opacity-40" />
                ))}
             </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <nav className="text-[8px] uppercase font-bold tracking-luxury text-accent mb-4">
              Home • {product.collection || "Collection"}
            </nav>

            <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white leading-none">
              {product.title || "Product Name"}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={8} className="fill-accent text-accent" />)}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                {(product as any).mediaAvaliacoes || 5.0}/5 Premium Standard
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-white tracking-tighter">
                £{price.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-white/20 line-through font-medium">
                  £{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[11px] leading-relaxed text-white/40 mb-8 line-clamp-4">
              {product.description || "Describe your heritage piece here..."}
            </p>

            {/* Sizes (Mock) */}
            <div className="mb-8">
               <h4 className="text-[8px] font-black uppercase text-white/30 mb-3 tracking-widest">Select Size</h4>
               <div className="flex gap-2">
                  {(product.opcoesTamanho || ["S", "M", "L"]).map(s => (
                    <div key={s} className="w-8 h-8 rounded-md border border-white/10 flex items-center justify-center text-[10px] text-white/60">
                      {s}
                    </div>
                  ))}
               </div>
            </div>

            {/* Actions (Mock) */}
            <div className="space-y-3 mb-8">
               <div className="w-full py-3 bg-white text-black text-[10px] font-black uppercase text-center rounded-md">Add to Cart</div>
               <div className="w-full py-3 border border-white/20 text-white text-[10px] font-black uppercase text-center rounded-md">Checkout Now</div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/5">
                {highlights.slice(0, 2).map((h: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                       {i === 0 ? <ShieldCheck size={14} className="text-accent" /> : <Truck size={14} className="text-accent" />}
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white uppercase">{h.title}</p>
                      <p className="text-[7px] text-white/30 uppercase">{h.text}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* FAQ Mock */}
            <div className="mt-8 pt-8 border-t border-white/5">
               <h4 className="text-[8px] font-black uppercase text-white/30 mb-6 tracking-widest">Heritage FAQ</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white/60">Sizing & Fit guide</span>
                    <span className="text-white/20">+</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white/60">Shipping & Returns</span>
                    <span className="text-white/20">+</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
