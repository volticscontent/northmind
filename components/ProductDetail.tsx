import { Product } from "@/lib/data-loader";
import Link from "next/link";
import Image from "next/image";
import { Star, ShieldCheck, CheckCircle2, Package, Truck } from "lucide-react";
import { ProductHighlightsCard } from "./ProductHighlightsCard";
import { ProductCard } from "./ProductCard";
import { ProductFaqBox } from "./product/ProductFaqBox";
import { ProductInteractions } from "./product/ProductInteractions";
import { ProductReviews } from "./product/ProductReviews";

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
}

export function ProductDetail({ product, allProducts }: ProductDetailProps) {
  const safePrice = Number(product?.price) || 0;
  const safeOriginalPrice = Number(product?.originalPrice) || 0;
  const discount = safeOriginalPrice > safePrice
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
    : 0;

  return (
    <>
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Product Images - STICKY on Desktop (Server Rendered) */}
          <div className="md:sticky md:top-28 self-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((index) => {
                const imgSrc = (product.images && product.images[index]) ? product.images[index] : (product.images && product.images[0]) ? product.images[0] : "/assets/community/1.png";
                return (
                  <div
                    key={index}
                    className="relative w-full aspect-[4/5] premium-border bg-card/30 flex items-center justify-center overflow-hidden group"
                  >
                    <Image
                      src={imgSrc}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {index === 0 && discount > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-accent text-black text-[10px] font-black px-3 py-1 uppercase tracking-luxury">
                        -{discount}% EXCLUSIVE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Content (Server Rendered) */}
          <div className="flex px-4 flex-col justify-center">
            <nav className="text-[10px] uppercase font-bold tracking-luxury italic text-accent mb-6 flex items-center gap-3">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="w-1 h-1 rounded-full bg-accent/30" />
              <span className="text-white">{product.collection}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-[0.9] text-white">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className={`${s <= (product.mediaAvaliacoes || 0) ? "fill-accent text-accent" : "text-white/10"}`} />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                {product.mediaAvaliacoes?.toFixed(1) || "5.0"}/5 Premium Standard ({product.totalAvaliacoes || 0})
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-white tracking-tighter">
                £{safePrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-white/30 line-through font-medium">
                  £{safeOriginalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-white/50 mb-10 font-medium max-w-lg">
              {product.description || "Crafted for the modern heritage aesthetic, this piece embodies the peak of British craftsmanship and durability."}
            </p>

            {/* INTERACTIVE ISLAND: Variants, Bundles, Add to Cart */}
            <ProductInteractions product={product} />

            {/* Trust & Shipping Info - Vercel Compact Version */}
            <div className="mt-8 space-y-4 border-b border-white/5 pb-12">
              {/* Shipping Badge Row */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C5A358] blur-[2px] animate-pulse " />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                    Ships by <span className="text-white">Next Business Day</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={12} className="text-[#C5A358]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A358]">
                    Free Shipping
                  </p>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-card/30 border border-white/5 rounded-xl p-5 space-y-4 transition-all duration-500 hover:border-[#C5A358]/30 group">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <CheckCircle2 size={18} className="text-[#C5A358] fill-[#C5A358]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black uppercase tracking-luxury text-white">Authorized Premium Retailer</h4>
                    <p className="text-[10px] font-medium leading-relaxed text-white/30">Original inventory, guaranteed provenance, and responsive customer support.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#C5A358]/5 border border-[#C5A358]/10 rounded-lg p-3 transition-colors group-hover:bg-[#C5A358]/10">
                  <Package size={16} className="text-[#C5A358]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A358] leading-none">Secure Purchase ┬À Easy Returns</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {/* Product Features (Static) */}
              <div className="pt-12 space-y-8">
                <h3 className="text-xs uppercase font-bold tracking-luxury text-white/30">
                  TECHNICAL CRAFTSMANSHIP
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {product.highlights && product.highlights.length > 0 ? (
                    product.highlights.map((h, i) => (
                      <div key={i} className="flex gap-4">
                        <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2">{h.title}</h4>
                          <p className="text-[11px] leading-relaxed text-white/40 font-medium">{h.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2">Weather Resistant Shell</h4>
                          <p className="text-[11px] leading-relaxed text-white/40 font-medium">Japanese-grade high-density polyester with durable water repellent treatment.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Package size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2">Sustainable Insulation</h4>
                          <p className="text-[11px] leading-relaxed text-white/40 font-medium">Recycled synthetic down that provides superior warmth even when damp.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* INTERACTIVE ISLAND: FAQ */}
              <ProductFaqBox />

              {/* INTERACTIVE ISLAND: Reviews */}
              <ProductReviews produtoId={product.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-32 space-y-48" style={{ overflowX: 'clip' }}>
        {/* NORTH MIND REELS - New Section for 3 vertical videos */}
        {product.videos && product.videos.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Live The Experience
              </h2>
              <p className="text-sm font-medium text-white/40 uppercase tracking-widest max-w-xl mx-auto">
                Product movement and artisan details in motion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.videos.slice(0, 3).map((videoSrc, idx) => (
                <div key={idx} className="relative aspect-[9/16] bg-card/30 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                  <video
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* North Mind Community - Static structure + marquee (Server Rendered) */}
        <section className="space-y-16 overflow-hidden">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              North Mind Community
            </h2>
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest max-w-xl mx-auto">
              Many people already live our style. Here are some of them:
            </p>
          </div>

          <div className="relative group">
            {/* Duplicated for seamless loop - 30 items for ultra-smooth transition */}
            <div className="flex animate-marquee gap-10 py-12">
              {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((imageNum, i) => (
                <div
                  key={i}
                  className="relative w-[300px] aspect-[10/14] rounded-3xl flex-shrink-0 shadow-[0_30px_60px_rgba(10,10,9,0.8)] border border-white/5 transition-transform duration-700 hover:scale-[1.05] overflow-hidden"
                >
                  <Image
                    src={`/assets/community/${imageNum}.png`}
                    alt={`Community Member ${i + 1}`}
                    fill
                    sizes="300px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Products Section (Server Rendered) */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 pb-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Heritage Collection
            </h2>
            <p className="text-[10px] md:text-sm text-accent uppercase tracking-widest max-w-xl mx-auto italic font-bold">
              Explore more from the house of North Mind
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {allProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
