"use client";

import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/data-loader";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ChevronDown,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  Plane,
  MapPin,
  RotateCcw,
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import { ProductHighlightsCard } from "./ProductHighlightsCard";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const router = useRouter();
  const [bundleSelections, setBundleSelections] = useState([
    { color: `${product.collection} black`, size: "M" },
    { color: `${product.collection} black`, size: "M" },
    { color: `${product.collection} black`, size: "M" }
  ]);

  const selectedSize = bundleSelections[0].size;
  const setSelectedSize = (size: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      next[0] = { ...next[0], size };
      return next;
    });
  };

  const selectedColor = bundleSelections[0].color;
  const setSelectedColor = (color: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      next[0] = { ...next[0], color };
      return next;
    });
  };

  const updateBundleSelection = (index: number, field: 'color' | 'size', value: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const [selectedBundle, setSelectedBundle] = useState("single");
  const [isAdding, setIsAdding] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "What are the delivery times?",
      icon: <Plane size={18} className="text-[#C5A358]" />,
      answer: (
        <>
          We dispatch orders within <strong>1ÔÇô3 business days</strong>.<br />
          <br />
          UK delivery typically takes <strong>10ÔÇô20 business days</strong>,
          depending on customs and courier workload.
        </>
      ),
    },
    {
      question: "How can I track my order?",
      icon: <MapPin size={18} className="text-[#C5A358]" />,
      answer: (
        <>
          You will receive a <strong>tracking number by email</strong> once your
          parcel has been shipped.
          <br />
          <br />
          If tracking has not updated, please allow 5ÔÇô7 days from dispatch.
        </>
      ),
    },
    {
      question: "What is your returns policy?",
      icon: <RotateCcw size={18} className="text-[#C5A358]" />,
      answer: (
        <>
          We accept returns within <strong>14 days</strong> of delivery,
          provided the item is unused and in its original condition.
          <br />
          <br />
          To start a return, contact: <strong>support@northmind.store</strong>
        </>
      ),
    },
    {
      question: "What should I do if my item is faulty?",
      icon: <HelpCircle size={18} className="text-[#C5A358]" />,
      answer: (
        <>
          If your product arrives damaged or defective, please email us within{" "}
          <strong>7 days</strong> of delivery with photos.
          <br />
          <br />
          We will promptly arrange a replacement or refund.
        </>
      ),
    },
  ];

  const colors = [
    { name: `${product.collection} black`, image: product.images[0] },
    {
      name: `${product.collection} royal navy`,
      image: product.images[0],
    },
  ];

  const handleAddToCart = () => {
    setIsAdding(true);

    const count = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 2 : 3;
    const priceMultiplier = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 0.9 : 0.8;
    const discountedPrice = product.price * priceMultiplier;

    for (let i = 0; i < count; i++) {
        const selection = bundleSelections[i];
        const productToAdd = { ...product, price: discountedPrice };
        const combinedSize = `${selection.color} - ${selection.size}`;
        addToCart(productToAdd, combinedSize);
    }
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    setIsDrawerOpen(false); // Fecha a gaveta pro caso de ela tentar abrir
    router.push("/checkout");
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <>
      <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Product Images - STICKY on Desktop */}
          <div className="md:sticky md:top-28 self-start">
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative w-full aspect-[4/5] premium-border bg-card/30 flex items-center justify-center overflow-hidden group">
                  <img
                    src={product.images[0]}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                  />
                  {index === 0 && discount > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-accent text-black text-[10px] font-black px-3 py-1 uppercase tracking-luxury">
                      -{discount}% EXCLUSIVE
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scrolls normally */}
          <div className="flex px-4 flex-col justify-center">
          <nav className="text-[10px] uppercase font-bold tracking-luxury text-accent/60 mb-6 flex items-center gap-3">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="w-1 h-1 rounded-full bg-accent/30" />
            <span className="text-white/40">{product.collection}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-[0.9] text-white">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-accent text-accent" />
              ))}
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              4.9/5 (527 Reviews)
            </span>
          </div>

          <div className="flex items-center gap-6 mb-2">
            <span className="text-lg md:text-2xl text-white/20 line-through font-medium">
              ┬ú{product.originalPrice.toFixed(2)}
            </span>
            <span className="text-3xl md:text-2xl font-bold text-white">
              ┬ú{product.price.toFixed(2)}
            </span>
          </div>
          <h1 className="mb-4">Universal Product Highlights</h1>

          <h1 className="md:text-xl font-semibold mb-4 text-white/100">
            Fast UK Delivery ┬À Free Shipping ┬À <br />
            VAT Included
          </h1>
          <div className="md:pr-10">
            <ProductHighlightsCard />
          </div>
          <div className="space-y-4 mb-8">
            <h1 className="text-xs font-black uppercase tracking-luxury text-white/40">
              Color: {selectedColor}
            </h1>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className="relative group flex items-center justify-center size-16"
                >
                  <div
                    className={`absolute inset-0 border-2 rounded-full transition-all duration-500 group-hover:scale-105 ${
                      selectedColor === color.name
                        ? "border-accent opacity-100"
                        : "border-white/10 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  <div className="size-[85%] bg-[#F2F2F2] rounded-full overflow-hidden flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={color.image}
                      alt={color.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10 mb-10">
            <div>
              <h4 className="text-xs uppercase font-bold tracking-luxury text-white/30 mb-5">
                SELECT SIZE
              </h4>
              <div className="flex gap-3 max-sm">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square h-10 w-14 flex rounded-lg items-center justify-center border text-sm font-semibold transition-all duration-500 ${
                      selectedSize === size
                        ? "border-accent text-accent bg-accent/5"
                        : "border-white/5 text-white/30 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 my-10">
            <div className="flex items-center mb-4 gap-4">
              <div className="h-[1px] flex-grow bg-white/10" />
              <h3 className="text-sm font-black uppercase tracking-luxury text-accent">
                Bundle & Save
              </h3>
              <div className="h-[1px] flex-grow bg-white/10" />
            </div>

            {[
              {
                id: "single",
                title: "Single Pack",
                desc: "Standard price",
                price: product.price,
                original: product.originalPrice,
                save: null,
              },
              {
                id: "duo",
                title: "Duo Pack",
                desc: "You save 73% + Free Shipping",
                price: product.price * 1.8,
                original: product.originalPrice * 2,
                isPopular: true,
                save: `SAVE ┬ú${(product.originalPrice * 2 - product.price * 1.8).toFixed(2)}`,
              },
              {
                id: "trio",
                title: "Trio Pack",
                desc: "You save 74% + Free Shipping",
                price: product.price * 2.4,
                original: product.originalPrice * 3,
                save: `SAVE ┬ú${(product.originalPrice * 3 - product.price * 2.4).toFixed(2)}`,
              },
            ].map((bundle) => (
              <div key={bundle.id} className="relative pt-3">
                {bundle.isPopular && (
                  <div className="absolute top-0 inset-x-0 flex justify-center z-20">
                    <div className="bg-accent px-4 h-6 flex items-center justify-center rounded-full border border-white/10 shadow-lg">
                      <span className="text-[9px] font-black uppercase tracking-widest text-black whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}
                <div
                  onClick={() => setSelectedBundle(bundle.id)}
                  className={`relative w-full cursor-pointer rounded-xl transition-all duration-500 border overflow-hidden ${
                    selectedBundle === bundle.id
                      ? "bg-card/100 border-accent shadow-[0_0_20px_rgba(197,163,88,0.1)]"
                      : bundle.isPopular
                        ? "bg-card/50 border-white/20 hover:border-white/30"
                        : "bg-card/50 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="p-5 flex items-center justify-between">
                    {bundle.save && (
                      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none glare-loop opacity-30" />
                    )}
                    <div className="flex gap-6 items-center">
                      <div className="relative h-6 w-6 rounded-full border-2 border-white/20 flex items-center justify-center transition-colors duration-500 group-hover:border-white/40">
                        <div
                          className={`h-3 w-3 rounded-full transition-all duration-500 ${
                            selectedBundle === bundle.id
                              ? "bg-accent scale-100"
                              : "bg-white scale-100"
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                          {bundle.title}
                        </h4>
                        {bundle.save && (
                          <div className="flex items-center justify-center bg-[#E5E5E5] px-2.5 h-5 rounded-[4px] w-fit">
                            <span className="text-[9px] font-black uppercase tracking-widest text-black/90 leading-none">
                              {bundle.save}
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-luxury">
                          {bundle.desc}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-xl font-black text-white leading-none">
                        ┬ú{bundle.price?.toFixed(2) || "0.00"}
                      </h4>
                      <p className="text-xs line-through font-bold text-white/20 tracking-widest mt-1">
                        ┬ú{bundle.original?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-in-out border-t border-white/5 bg-black/20 ${
                      selectedBundle === bundle.id
                        ? "max-h-48 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 pt-2 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-luxury text-white/40">
                        Color, Size
                      </p>
                      {[
                        ...Array(
                          bundle.id === "single"
                            ? 1
                            : bundle.id === "duo"
                              ? 2
                              : 3,
                        ),
                      ].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="size-10 bg-[#F2F2F2] rounded-md overflow-hidden flex items-center justify-center p-1 shrink-0 border border-white/5">
                            <img
                              src={product.images[0]}
                              alt="Thumbnail"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="relative flex-grow h-10">
                            <select 
                              value={bundleSelections[idx].color}
                              onChange={(e) => updateBundleSelection(idx, 'color', e.target.value)}
                              className="w-full h-full bg-white/5 border border-white/10 rounded-md px-3 pr-8 text-[10px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors"
                            >
                              {colors.map((c) => (
                                <option
                                  key={c.name}
                                  value={c.name}
                                  className="bg-background text-white"
                                >
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-white/40 pointer-events-none" />
                          </div>
                          <div className="relative w-20 h-10">
                            <select 
                              value={bundleSelections[idx].size}
                              onChange={(e) => updateBundleSelection(idx, 'size', e.target.value)}
                              className="w-full h-full bg-white/5 border border-white/10 rounded-md px-3 pr-8 text-[10px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors"
                            >
                              {["S", "M", "L", "XL", "XXL"].map((s) => (
                                <option
                                  key={s}
                                  value={s}
                                  className="bg-background text-white"
                                >
                                  {s}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-white/40 pointer-events-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`btn-premium mb-4 w-full text-lg border-2 border-white/90 bg-black text-white flex items-center justify-center gap-3 rounded-md hover:bg-black hover:border-[#C5A358]`}
            >
              {isAdding ? "ADDING TO CART..." : "ADD TO CART"}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={handleDirectCheckout}
              disabled={isAdding}
              className={`btn-premium w-full font-bold text-lg flex items-center justify-center gap-3 rounded-md ${isAdding ? "bg-white" : ""}`}
            >
              <ShoppingCart size={20} />
              CHECKOUT
            </button>

            {/* Trust & Shipping Info - Compact */}
            <div className="mt-8 space-y-4">
              {/* Shipping Badge Row */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C5A358] blur-[2px] animate-pulse " />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                    Ships by <span className="text-white">Wed, Apr 01</span>
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
                    <CheckCircle2
                      size={18}
                      className="text-[#C5A358] fill-[#C5A358]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black uppercase tracking-luxury text-white">
                      Authorized Premium Retailer
                    </h4>
                    <p className="text-[10px] font-medium leading-relaxed text-white/30">
                      Original inventory, guaranteed provenance, and responsive
                      customer support.
                    </p>
                  </div>
                </div>

                {/* Secure Purchase Highlight */}
                <div className="flex items-center gap-3 bg-[#C5A358]/5 border border-[#C5A358]/10 rounded-lg p-3 transition-colors group-hover:bg-[#C5A358]/10">
                  <Package size={16} className="text-[#C5A358]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A358] leading-none">
                    Secure Purchase ┬À Easy Returns
                  </p>
                </div>
              </div>
            </div>

            {/* Lifestyle Section - Mini */}
            <div className="pt-12 space-y-8 border-t border-white/5">
              <h2 className="text-lg font-black text-center uppercase tracking-luxury text-white">
                North Mind Lifestyle
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[9/16] bg-white border border-white/10 rounded-[2rem] flex items-center justify-center group overflow-hidden relative shadow-lg"
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    <div className="size-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/40">
                      <div className="size-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-black border-b-[5px] border-b-transparent ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details - Mini */}
            <div className="pt-12 space-y-8 border-t border-white/5">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                  Product Details
                </h2>
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black uppercase tracking-luxury text-white/20 mb-4">
                    Details
                  </h4>
                  <ul className="space-y-4">
                    {[
                      "Size medium has a 75.5 cm front body length, a 75 cm back body length, a 50 cm shoulder, a 122 cm chest and a 94 cm sleeve length. Sleeve length is taken from the centre back of the neck.",
                      "Mockneck. Zip-off drawstring hood. Two-way full-zip front with a storm guard and a flap on the top to prevent chafing. Zip pulls custom-developed with an 'RL' logo.",
                      "Long sleeves. Adjustable hook-and-loop tabs on the elasticated cuffs.",
                      "Left chest zipped pocket. Two front waist zipped pockets. Interior right chest pocket. Drawstring hem. Fully lined and filled.",
                      "Signature embroidered Pony on the left chest.",
                      "650 fill power. Fill power measures the loft of the down and ranges from 450 to 1,000 for clothing.",
                      "This product is made from polyester.",
                      "Shell and hood fill: 100% polyester. Lining: 100% nylon. Body fill: 75% duck down, 25% duck feathers. Machine washable. Imported.",
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 group items-start">
                        <span className="shrink-0 w-1 h-1 rounded-full bg-[#C5A358]/40 mt-1.5 group-hover:bg-[#C5A358] transition-colors" />
                        <p className="text-[10px] font-medium leading-relaxed text-white/30 group-hover:text-white/60 transition-colors">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-32 space-y-32" style={{overflowX: 'clip'}}>
      {/* North Mind Community - Infinite Carousel */}
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
          <div className="flex animate-marquee gap-8 py-8">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="w-[280px] aspect-[10/14] bg-white rounded-2xl flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 transition-transform duration-700 hover:scale-[1.05]"
              />
            ))}
          </div>

          {/* Vignette Overlays for Smooth Fading */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* FAQ Section - Accordion */}
      <section className="max-w-3xl mx-auto space-y-16 pb-48">
        <h2 className="text-4xl font-black text-center uppercase tracking-tighter text-white">
          FAQ
        </h2>

        <div className="border-t border-white/5 divide-y divide-white/5">
          {faqData.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() =>
                  setActiveFaq(activeFaq === index ? null : index)
                }
                className="w-full py-8 flex items-center justify-between text-left transition-all hover:bg-white/[0.02] px-4 rounded-lg"
              >
                <div className="flex items-center gap-6">
                  <div className="shrink-0 transition-transform duration-500 group-hover:scale-110">
                    {faq.icon}
                  </div>
                  <span className="text-sm md:text-base font-bold text-white uppercase tracking-tight">
                    {faq.question}
                  </span>
                </div>
                {activeFaq === index ? (
                  <ChevronUp size={16} className="text-white/20" />
                ) : (
                  <ChevronDown size={16} className="text-white/20" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeFaq === index
                    ? "max-h-64 opacity-100 pb-10"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-16 pr-8 text-sm md:text-[15px] leading-relaxed text-white/40 font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </>
  );
}
