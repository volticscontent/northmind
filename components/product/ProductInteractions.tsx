"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/data-loader";
import { useRouter } from "next/navigation";
import { ShoppingCart, CheckCircle2, ChevronDown, Ruler, X, Search, Sparkles } from "lucide-react";
import { ProductSizeGuide } from "./ProductSizeGuide";
import { ProductCard } from "../ProductCard";

interface ProductInteractionsProps {
  product: Product;
  allProducts?: Product[];
}

export function ProductInteractions({ product, allProducts = [] }: ProductInteractionsProps) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const router = useRouter();

  const safeImage = product?.images?.[0] || "/assets/community/1.png";

  const colors = (product as any).opcoesCor && (product as any).opcoesCor.length > 0
    ? (product as any).opcoesCor.map((c: any) => ({
      name: c.name,
      image: c.image || safeImage
    }))
    : [];

  const isFragrance = product.tipo === "PERFUME" || product.collection?.toLowerCase().includes("fragrance") || product.collection?.toLowerCase().includes("3x1");
  const sizes = product.opcoesTamanho && product.opcoesTamanho.length > 0 ? product.opcoesTamanho : (isFragrance ? ["30ml", "50ml", "100ml"] : ["S", "M", "L", "XL", "XXL"]);

  const collectionProducts = allProducts.filter(p => p.collection === product.collection);

  const [bundleSelections, setBundleSelections] = useState([
    { productId: product.id, color: colors[0]?.name || "", size: sizes[0] },
    { productId: product.id, color: colors[0]?.name || "", size: sizes[0] },
    { productId: product.id, color: colors[0]?.name || "", size: sizes[0] }
  ]);

  const [selectedBundle, setSelectedBundle] = useState("single");
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  // Global selections (applies to "SINGLE" or serves as base for Duo/Trio)
  const selectedSize = bundleSelections[0].size;
  const setSelectedSize = (size: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      for (let i = 0; i < 3; i++) next[i] = { ...next[i], size };
      return next;
    });
  };

  const selectedColor = bundleSelections[0]?.color || "";
  const setSelectedColor = (color: string) => {
    // Update State
    setBundleSelections(prev => {
      const next = [...prev];
      for (let i = 0; i < 3; i++) next[i] = { ...next[i], color };
      return next;
    });

    // Update URL for Gallery Sync
    const params = new URLSearchParams(window.location.search);
    params.set('color', color);
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const updateBundleSelection = (index: number, field: 'color' | 'size', value: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    const safePrice = currentBasePrice;
    const count = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 2 : 3;
    const priceMultiplier = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 0.9 : 0.8;
    const discountedPrice = safePrice * priceMultiplier;

    for (let i = 0; i < count; i++) {
      const selection = bundleSelections[i];
      const selectedProduct = allProducts.find(p => p.id === selection.productId) || product;
      const productToAdd = { ...selectedProduct, price: discountedPrice };
      const combinedSize = selection.color ? `${selection.color} - ${selection.size}` : selection.size;
      addToCart(productToAdd, combinedSize);
    }

    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  // DYNAMIC PRICING ENGINE: Find currently selected variant price
  const variant = (product as any).variantes?.find((v: any) => (v.label || v.name) === selectedSize);
  const currentBasePrice = variant ? Number(variant.price) : Number(product.price) || 0;
  const currentBaseOriginal = variant ? Number(variant.originalPrice) : Number(product.originalPrice) || 0;

  const bundles = [
    {
      id: "single",
      title: "Single Pack",
      desc: "Standard price",
      price: currentBasePrice,
      original: currentBaseOriginal,
      save: null,
    },
    {
      id: "duo",
      title: "Duo Pack",
      desc: `You save 10%`,
      price: currentBasePrice * 1.8,
      original: currentBaseOriginal * 2,
      isPopular: true,
      save: currentBaseOriginal * 2 > currentBasePrice * 1.8 ? `SAVE £${(currentBaseOriginal * 2 - currentBasePrice * 1.8).toFixed(2)}` : null,
    },
    {
      id: "trio",
      title: "Trio Pack",
      desc: `You save 20%`,
      price: currentBasePrice * 2.4,
      original: currentBaseOriginal * 3,
      save: currentBaseOriginal * 3 > currentBasePrice * 2.4 ? `SAVE £${(currentBaseOriginal * 3 - currentBasePrice * 2.4).toFixed(2)}` : null,
    },
  ];

  const handleOpenPicker = (idx: number) => {
    setActiveSlotIdx(idx);
    setIsPickerOpen(true);
  };


  const handleSelectFragrance = (selectedProd: Product) => {
    if (activeSlotIdx !== null) {
      updateBundleSelection(activeSlotIdx, 'productId' as any, selectedProd.id);
      setIsPickerOpen(false);
      setActiveSlotIdx(null);
    }
  };

  // Lock body scroll when picker is open to prevent background interaction
  useEffect(() => {
    if (isPickerOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [isPickerOpen]);

  return (
    <div className="space-y-10">

      {/* Visual Color Selection */}
      {colors.length > 0 && (
        <div className="space-y-4">
          <h1 className="text-xs font-black uppercase tracking-luxury text-white/90">
            Color: {selectedColor}
          </h1>
          <div className="flex gap-3">
            {colors.map((color: any) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className="relative group flex items-center justify-center size-20"
              >
                <div
                  className={`absolute inset-0 border-[3px] rounded-full transition-all duration-500 group-hover:scale-105 ${selectedColor === color.name
                    ? "border-yellow-500"
                    : "border-white/10 opacity-0 group-hover:opacity-100"
                    }`}
                />
                <div className="size-[100%] bg-[#F2F2F2] rounded-full overflow-hidden flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:scale-105">
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
      )}

      {/* Visual Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-xs uppercase font-bold tracking-luxury text-white/60">
            {isFragrance ? "SELECT VOLUME" : "SELECT SIZE"}
          </h4>
          {!isFragrance && product.guiaTamanho && (
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[10px] font-black uppercase tracking-widest text-[#C5A358] hover:text-white transition-colors underline underline-offset-4 flex items-center gap-1.5"
            >
              <Ruler size={12} /> Size Guide
            </button>
          )}
        </div>
        {product.detalhesModelo && (
          <p className="text-[10px] font-medium text-white/90 italic mb-4">
            * {product.detalhesModelo}
          </p>
        )}

        {/* ELITE UPGRADE: Size Guide Drawer */}
        <ProductSizeGuide
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          guide={product.guiaTamanho}
        />
        <div className="flex flex-wrap gap-4">
          {sizes.map((size: string) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`aspect-square h-12 w-20 flex items-center justify-center border text-xl font-semibold transition-all duration-500 ${selectedSize === size
                ? "border-white text-white bg-accent/5"
                : "border-white/5 text-white/30 hover:border-white/20 hover:text-accent"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bundle Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-white/10" />
          <h3 className="text-sm font-black uppercase tracking-luxury text-white/90">
            Bundle & Save
          </h3>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>

        {bundles.map((bundle) => (
          <div key={bundle.id} className="relative pt-3">
            {bundle.isPopular && (
              <div className="absolute top-0 inset-x-0 flex justify-center z-20">
                <div className="bg-black px-4 h-6 flex items-center justify-center rounded-full border border-white/10 shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              </div>
            )}
            <div
              onClick={() => setSelectedBundle(bundle.id)}
              className={`relative w-full cursor-pointer rounded-xl transition-all duration-500 border overflow-hidden ${selectedBundle === bundle.id
                ? "bg-card/100 border-white/90 shadow-[0_0_20px_rgba(197,163,88,0.1)]"
                : bundle.isPopular
                  ? "bg-card/50 border-white/20 hover:border-white/30"
                  : "bg-card/50 border-white/5 hover:border-white/20"
                }`}
            >
              <div className="p-5 flex items-center justify-between">
                {bundle.save && (
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none glare-loop opacity-30" />
                )}
                <div className="flex gap-6 items-center flex-grow">
                  <div className="relative h-6 w-6 rounded-full border-2 border-white/20 flex items-center justify-center transition-colors duration-500 group-hover:border-white/40 shrink-0">
                    <div
                      className={`h-5 w-5 rounded-full transition-all duration-500 ${selectedBundle === bundle.id
                        ? "bg-white/90 scale-100"
                        : "bg-transparent scale-0"
                        }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-none">
                      {bundle.title}
                    </h4>
                    {bundle.save && (
                      <div className="flex items-center justify-center bg-[#E5E5E5] px-2.5 h-5 rounded-[4px] w-fit my-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/90 leading-none">
                          {bundle.save}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <h4 className="text-lg md:text-xl font-black text-white leading-none">
                    £{Number(bundle.price || 0).toFixed(2)}
                  </h4>
                  {bundle.original > 0 && bundle.original > bundle.price && (
                    <p className="text-xs line-through font-bold text-white/80 tracking-widest mt-1">
                      £{Number(bundle.original || 0).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Advanced Bundle Accordion */}
              <div
                className={`transition-all duration-500 ease-in-out border-t border-white/5 bg-black/20 ${selectedBundle === bundle.id && bundle.id !== "single"
                  ? "max-h-64 opacity-100"
                  : "max-h-0 opacity-0"
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 pt-3 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-luxury text-white/90 mb-2">
                    Configure your items: Color & Size
                  </p>
                  {[...Array(bundle.id === "single" ? 1 : bundle.id === "duo" ? 2 : 3)].map((_, idx) => {
                    const currentSelection = bundleSelections[idx];
                    const selectedItemProduct = allProducts.find(p => p.id === currentSelection.productId) || product;
                    const itemThumb = selectedItemProduct.images?.[0] || safeImage;

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="size-10 bg-[#F2F2F2] rounded-md overflow-hidden flex items-center justify-center p-1 shrink-0 border border-white/5">
                          <img
                            src={isFragrance ? itemThumb : (colors.find(c => c.name === bundleSelections[idx].color)?.image || safeImage)}
                            alt="Thumbnail"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {isFragrance ? (
                          <div className="relative flex-grow">
                            <button
                              onClick={() => handleOpenPicker(idx)}
                              className="w-full h-12 bg-white/5 border border-white/20 rounded-xl px-4 flex items-center justify-between group/btn hover:border-accent/40 transition-all"
                            >
                              <div className="flex flex-col items-start">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#C5A358]">Select Fragrance</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate max-w-[120px]">
                                  {selectedItemProduct.title}
                                </span>
                              </div>
                              <Sparkles size={14} className="text-accent group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {colors.length > 0 && (
                              <div className="relative flex-grow h-10">
                                <select
                                  value={bundleSelections[idx].color}
                                  onChange={(e) => updateBundleSelection(idx, 'color', e.target.value)}
                                  className="w-full h-full bg-white/5 border border-white/10 rounded-md px-3 pr-8 text-[10px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
                                >
                                  {colors.map((c: any) => (
                                    <option
                                      key={c.name}
                                      value={c.name}
                                      className="bg-background text-white"
                                    >
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-white/90 pointer-events-none" />
                              </div>
                            )}
                          </>
                        )}

                        <div className={`relative h-10 ${(colors.length > 0 || isFragrance) ? 'w-20' : 'flex-grow'}`}>
                          <select
                            value={bundleSelections[idx].size}
                            onChange={(e) => updateBundleSelection(idx, 'size', e.target.value)}
                            className="w-full h-full bg-white/5 border border-white/10 rounded-md px-3 pr-8 text-[10px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
                          >
                            {sizes.map((s: string) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-background text-white"
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-white/90 pointer-events-none" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn-premium w-full text-base border-2 border-white/90 bg-black text-white flex items-center justify-center gap-3 rounded-md hover:bg-black hover:border-[#C5A358] transition-colors py-4"
        >
          {isAdding ? "ADDING TO CART..." : "ADD TO CART"}
          {!isAdding && <ShoppingCart size={20} />}
        </button>
        <button
          onClick={handleDirectCheckout}
          className="btn-premium bg-white w-full font-bold text-base flex items-center justify-center gap-3 rounded-md hover:bg-white/90 transition-colors py-4 text-black"
        >
          CHECKOUT NOW
        </button>
      </div>

      {/* FRAGRANCE SELECTION VAULT MODAL */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
            onClick={() => setIsPickerOpen(false)}
          />

          <div className="relative w-full h-full bg-[#0A0A09] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(197,163,88,0.1)]">
            {/* Modal Header */}
            <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">Fragrance Selection Vault</h2>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent italic">Select your next essence from the house of North Mind</p>
              </div>
              <button 
                onClick={() => setIsPickerOpen(false)}
                className="size-12 md:size-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Product Grid */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {collectionProducts.map((p) => {
                  const isSelected = activeSlotIdx !== null && bundleSelections[activeSlotIdx].productId === p.id;
                  
                  return (
                    <div key={p.id} className="relative group">
                      <ProductCard 
                        product={p} 
                        onClick={handleSelectFragrance}
                      />
                      {isSelected && (
                        <div className="absolute top-4 right-4 z-20 size-8 md:size-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-white/5 bg-black/50 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">
                Choose a fragment of your story
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
