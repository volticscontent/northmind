"use client";

import { Product } from "@/lib/data-loader";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Star, ShieldCheck, CheckCircle2, Package, Truck, Info } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductFaqBox } from "./product/ProductFaqBox";
import { ProductInteractions } from "./product/ProductInteractions";
import { ProductReviews } from "./product/ProductReviews";
import { ProductGallery } from "./product/ProductGallery";
import { ProductAccordion } from "./product/ProductAccordion";
import { LifestyleStories } from "./product/LifestyleStories";
import { trackViewProduct } from "@/lib/tracking";

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  searchParams?: { [key: string]: string | string[] | undefined };
  initialReviews?: any[];
  canReviewInitially?: boolean;
}

export function ProductDetail({ 
  product, 
  allProducts, 
  searchParams,
  initialReviews = [],
  canReviewInitially = false
}: ProductDetailProps) {
  useEffect(() => {
    if (product) {
      trackViewProduct({
        id: product.id,
        title: product.title,
        price: Number(product.price)
      });
    }
  }, [product]);

  const safePrice = Number(product?.price) || 0;
  const safeOriginalPrice = Number(product?.originalPrice) || 0;
  const discount = safeOriginalPrice > safePrice
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
    : 0;

  const selectedColor = searchParams?.color;

  // Elite Filtering: Filter images by variant or show all if none selected
  const colorData = product.opcoesCor?.find(c => c.name === selectedColor);
  const imagesToShow = colorData?.fotos && colorData.fotos.length > 0
    ? colorData.fotos
    : product.images || [];

  return (
    <>
      <div className="pt-10 md:pt-32 pb-14 max-w-[100%] lg:max-w-[90%] md:max-w-[70%] mx-auto animate-fade-in">
        <nav className="text-[10px] pl-4 pt-8 md:pt-0 uppercase font-medium tracking-[0.2em] text-white/60 mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="bg-white/40" />/
          <span className="text-white/90">{product.collection}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold px-4 md:px-0 uppercase tracking-tight mb-3 leading-[0.95] text-white break-words">
          {product.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start px-4 md:px-0">
          {/* Product Images - STICKY on Desktop */}
          <div className="md:sticky md:top-32 self-start">
            {imagesToShow.length > 0 ? (
              <ProductGallery
                images={imagesToShow}
                title={product.title}
                discount={discount}
                opcoesCor={product.opcoesCor}
                isFragrance={product.collection?.toLowerCase().includes('fragrance') || product.collection?.toLowerCase().includes('offer')}
              />
            ) : (
              <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No assets available for this item</p>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="flex px-4 md:px-0 flex-col justify-center">

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-medium text-white tracking-tight">
                £{safePrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-white/40 line-through font-light">
                  £{safeOriginalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* INTERACTIVE ISLAND: Variants, Bundles, Add to Cart */}
            <ProductInteractions product={product} allProducts={allProducts} />


            {/* Trust & Shipping Info - Vercel Compact Version */}
            <div className="mt-8 space-y-4">
              {/* Shipping Badge Row */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                    Ships by <span className="text-white">Next In 5 Days</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={12} className="text-green-500" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-green-500">
                    Free Shipping
                  </p>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-5 transition-colors duration-500 hover:bg-white/[0.04]">
                <div className="flex gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">Authorized Premium Retailer</h4>
                    <p className="text-[10px] font-medium leading-relaxed text-white/60">Original inventory, guaranteed provenance, and responsive customer support.</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/80 mb-10 font-light max-w-lg">
                  {product.description || "Crafted for the modern heritage aesthetic, this piece embodies the peak of British craftsmanship and durability."}
                </p>
                <div className="flex items-center gap-3 bg-white/[0.05] border border-white/5 rounded-lg p-3 transition-colors hover:bg-white/10">
                  <Package size={16} className="text-white/80" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/80 leading-none">Secure Purchase & Easy Returns</p>
                </div>
              </div>
            </div>

            <div className="">
              <ProductAccordion
                items={[
                  // SECTION 1: Technical Details (from Shopify/Admin specs)
                  {
                    id: "details",
                    title: (product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance")) ? "Fragrance Profile" : "Product Details",
                    icon: <Info size={16} />,
                    content: (
                      <ul className="space-y-2">
                        {(product.especificacoes || []).length > 0 ? (
                          product.especificacoes?.map((spec, i) => (
                            <li key={i} className="flex gap-3">
                              <div className="w-1 h-1 rounded-full bg-accent/40 mt-1.5 shrink-0" />
                              <span>{spec}</span>
                            </li>
                          ))
                        ) : (
                          <li className="italic text-white/30 tracking-tight">No additional technical specs listed for this item.</li>
                        )}
                      </ul>
                    )
                  },
                  // SECTION 2: Fabrication & Care
                  {
                    id: "fabrication",
                    title: (product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance")) ? "Fragrance Notes & Care" : "Fabrication & Care",
                    icon: <ShieldCheck size={16} />,
                    content: (
                      <div className="space-y-2">
                        {product.materiais && product.materiais.length > 0 && (
                          <div className="flex flex-wrap gap-x-8 gap-y-2">
                            {product.materiais.map((m, i) => (
                              <div key={i} className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A358]">{m.percentage}</p>
                                <p className="text-[11px] font-medium text-white/60">{m.item}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {product.instrucoesCuidado && (
                          <p className="text-[11px] font-medium leading-relaxed italic border-l border-accent/20 pl-4">
                            &quot;{product.instrucoesCuidado}&quot;
                          </p>
                        )}
                      </div>
                    )
                  },
                  // SECTION 3: Custom highlights (Storytelling)
                  ...(product.highlights || []).map((h, i) => ({
                    id: `highlight-${i}`,
                    title: h.title,
                    icon: h.icon === 'Package' ? <Package size={16} /> : <CheckCircle2 size={16} />,
                    content: <p className="leading-relaxed">{h.text}</p>
                  })),
                  // SECTION 4: Customer Reviews
                  {
                    id: "reviews",
                    title: "Customer Reviews",
                    icon: <Star size={16} />,
                    content: (
                      <div className="py-2">
                        <ProductReviews 
                          produtoId={product.id} 
                          initialReviews={initialReviews}
                          canReviewInitially={canReviewInitially}
                        />
                      </div>
                    )
                  },
                  // SECTION 5: Shipping & Returns (Static)
                  {
                    id: "shipping",
                    title: "Shipping & Returns",
                    icon: <Truck size={16} />,
                    content: (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                          <p><strong>Free Standard Shipping</strong> on all UK orders. Delivered within 10-20 business days.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                          <p>Returns accepted within 14 days for all unworn assets in original condition.</p>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </div>

            {/* ELITE LIFESTYLE STORIES: Compact vertical unboxing (Layout Original) */}
            <LifestyleStories videos={product.videos} />

            {/* INTERACTIVE ISLAND: FAQ */}
            <ProductFaqBox />

          </div>
        </div>
      </div>

      <div className="space-y-12" style={{ overflowX: 'clip' }}>

        {/* North Mind Community */}
        <section className="overflow-hidden px-4 pt-24 md:pt-32">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
              North Mind Community
            </h2>
            <p className="text-xs md:text-sm font-light text-white/50 uppercase tracking-[0.2em] max-w-xl mx-auto">
              Many people already live our style. Here are some of them.
            </p>
          </div>

          <div className="relative group">
            {/* Duplicated for seamless loop - 30 items for ultra-smooth transition */}
            <div className="flex animate-marquee gap-5 py-12">
              {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((imageNum, i) => (
                <div
                  key={i}
                  className="relative w-[250px] md:w-[300px] aspect-[10/14] rounded-3xl flex-shrink-0 border border-white/90 transition-transform duration-700 hover:scale-[1.05] overflow-hidden"
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

        {/* Other Products Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-24">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
              Heritage Collection
            </h2>
            <p className="text-[10px] md:text-xs text-accent uppercase tracking-[0.2em] max-w-xl mx-auto font-medium">
              Explore more from the house of North Mind
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {allProducts.slice(0, 16).map((relatedProduct, index) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
