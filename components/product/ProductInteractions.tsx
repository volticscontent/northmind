"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/data-loader";
import { useRouter } from "next/navigation";
import { ShoppingCart, CheckCircle2, ChevronDown } from "lucide-react";

interface ProductInteractionsProps {
  product: Product;
}

export function ProductInteractions({ product }: ProductInteractionsProps) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const router = useRouter();
  
  const safeImage = product?.images?.[0] || "/assets/community/1.png";
  
  const colors = (product as any).opcoesCor && (product as any).opcoesCor.length > 0 
    ? (product as any).opcoesCor.map((c: any) => ({ name: c.name, image: safeImage }))
    : [
        { name: `${product.collection || 'Core'} black`, image: safeImage },
        { name: `${product.collection || 'Core'} royal navy`, image: safeImage },
      ];

  const sizes = product.opcoesTamanho && product.opcoesTamanho.length > 0 ? product.opcoesTamanho : ["S", "M", "L", "XL", "XXL"];

  const [bundleSelections, setBundleSelections] = useState([
    { color: colors[0].name, size: sizes[0] },
    { color: colors[0].name, size: sizes[0] },
    { color: colors[0].name, size: sizes[0] }
  ]);

  const [selectedBundle, setSelectedBundle] = useState("single");
  const [isAdding, setIsAdding] = useState(false);

  // Global selections (applies to "SINGLE" or serves as base for Duo/Trio)
  const selectedSize = bundleSelections[0].size;
  const setSelectedSize = (size: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      for(let i=0; i<3; i++) next[i] = { ...next[i], size };
      return next;
    });
  };

  const selectedColor = bundleSelections[0].color;
  const setSelectedColor = (color: string) => {
    setBundleSelections(prev => {
      const next = [...prev];
      for(let i=0; i<3; i++) next[i] = { ...next[i], color };
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

  const handleAddToCart = () => {
    setIsAdding(true);

    const safePrice = Number(product.price) || 0;
    const count = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 2 : 3;
    const priceMultiplier = selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 0.9 : 0.8;
    const discountedPrice = safePrice * priceMultiplier;

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
    setIsDrawerOpen(false); 
    router.push("/checkout");
  };

  const safePrice = Number(product.price) || 0;
  const safeOriginal = Number(product.originalPrice) || 0;
  
  const bundles = [
    {
      id: "single",
      title: "Single Pack",
      desc: "Standard price",
      price: safePrice,
      original: safeOriginal,
      save: null,
    },
    {
      id: "duo",
      title: "Duo Pack",
      desc: `You save 10%`,
      price: safePrice * 1.8,
      original: safeOriginal * 2,
      isPopular: true,
      save: safeOriginal * 2 > safePrice * 1.8 ? `SAVE £${(safeOriginal * 2 - safePrice * 1.8).toFixed(2)}` : null,
    },
    {
      id: "trio",
      title: "Trio Pack",
      desc: `You save 20%`,
      price: safePrice * 2.4,
      original: safeOriginal * 3,
      save: safeOriginal * 3 > safePrice * 2.4 ? `SAVE £${(safeOriginal * 3 - safePrice * 2.4).toFixed(2)}` : null,
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Visual Color Selection */}
      <div className="space-y-4">
        <h1 className="text-xs font-black uppercase tracking-luxury text-white/40">
          Color: {selectedColor}
        </h1>
        <div className="flex gap-3">
          {colors.map((color: any) => (
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

      {/* Visual Size Selection */}
      <div>
        <h4 className="text-xs uppercase font-bold tracking-luxury text-white/30 mb-5">
          SELECT SIZE
        </h4>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size: string) => (
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

      {/* Bundle Selection */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-white/10" />
          <h3 className="text-sm font-black uppercase tracking-luxury text-accent">
            Bundle & Save
          </h3>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>

        {bundles.map((bundle) => (
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
                <div className="flex gap-6 items-center flex-grow">
                  <div className="relative h-6 w-6 rounded-full border-2 border-white/20 flex items-center justify-center transition-colors duration-500 group-hover:border-white/40 shrink-0">
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-500 ${
                        selectedBundle === bundle.id
                          ? "bg-accent scale-100"
                          : "bg-transparent scale-0"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-none">
                      {bundle.title}
                    </h4>
                    {bundle.save && (
                      <div className="flex items-center justify-center bg-[#E5E5E5] px-2.5 h-5 rounded-[4px] w-fit mt-1.5 mb-1.5">
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
                <div className="text-right shrink-0">
                  <h4 className="text-lg md:text-xl font-black text-white leading-none">
                    £{Number(bundle.price || 0).toFixed(2)}
                  </h4>
                  {bundle.original > 0 && bundle.original > bundle.price && (
                    <p className="text-xs line-through font-bold text-white/20 tracking-widest mt-1">
                      £{Number(bundle.original || 0).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Advanced Bundle Accordion */}
              <div
                className={`transition-all duration-500 ease-in-out border-t border-white/5 bg-black/20 ${
                  selectedBundle === bundle.id && bundle.id !== "single"
                    ? "max-h-64 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 pt-3 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-luxury text-white/40 mb-2">
                    Configure your items: Color & Size
                  </p>
                  {[...Array(bundle.id === "single" ? 1 : bundle.id === "duo" ? 2 : 3)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="size-10 bg-[#F2F2F2] rounded-md overflow-hidden flex items-center justify-center p-1 shrink-0 border border-white/5">
                        <img
                          src={safeImage}
                          alt="Thumbnail"
                          className="w-full h-full object-contain"
                        />
                      </div>
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-white/40 pointer-events-none" />
                      </div>
                      <div className="relative w-20 h-10">
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

      {/* Checkout Buttons */}
      <div className="flex flex-col gap-4 pt-6">
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
    </div>
  );
}
