"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/data-loader";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  CheckCircle2,
  ChevronDown,
  Ruler,
  X,
  Sparkles,
} from "lucide-react";
import { ProductSizeGuide } from "./ProductSizeGuide";
import { ProductCard } from "../ProductCard";
import {
  FRAGRANCE_COLLECTION_BUNDLES,
  isFragranceCollection,
} from "@/lib/fragrance-overrides";

interface ProductInteractionsProps {
  product: Product;
  allProducts?: Product[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

type BundleSelection = {
  productId: string;
  color: string;
  size: string;
};

function getProductSizes(product: Product): string[] {
  if (product.opcoesTamanho && product.opcoesTamanho.length > 0) {
    return product.opcoesTamanho;
  }

  if (product.tipo === "PERFUME" || isFragranceCollection(product.collection)) {
    return ["100ml"];
  }

  return ["S", "M", "L", "XL", "XXL"];
}

function createSelection(product: Product, color = ""): BundleSelection {
  return {
    productId: product.id,
    color,
    size: getProductSizes(product)[0],
  };
}

function getBundleItemCount(bundleId: string, isFragrance: boolean): number {
  if (bundleId === "single") {
    return 1;
  }

  if (isFragrance) {
    return bundleId === "bundle-5" ? 5 : 3;
  }

  return bundleId === "duo" ? 2 : 3;
}

export function ProductInteractions({
  product,
  allProducts = [],
  searchParams,
}: ProductInteractionsProps) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const router = useRouter();

  const [selectedBundle, setSelectedBundle] = useState("single");
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  const isFragrance =
    product.tipo === "PERFUME" || isFragranceCollection(product.collection);
  const sizes = getProductSizes(product);

  const isSet = selectedBundle !== "single" && isFragrance;

  const safeImage = product?.images?.[0] || "/assets/community/1.png";

  const colors =
    (product as any).opcoesCor && (product as any).opcoesCor.length > 0
      ? (product as any).opcoesCor.map((c: any) => ({
          name: c.name,
          image: c.image || safeImage,
        }))
      : [];

  const collectionProducts = useMemo(() => {
    const scopedProducts = allProducts.filter(
      (p) => p.collection === product.collection,
    );
    return [product, ...scopedProducts.filter((p) => p.id !== product.id)];
  }, [allProducts, product]);

  const [bundleSelections, setBundleSelections] = useState<BundleSelection[]>(
    () =>
      Array.from({ length: 5 }, () =>
        createSelection(product, colors[0]?.name || ""),
      ),
  );

  useEffect(() => {
    const desiredBundle = Array.isArray(searchParams?.bundle)
      ? searchParams?.bundle[0]
      : searchParams?.bundle;

    if (!isFragrance) {
      return;
    }

    if (desiredBundle === "5") {
      setSelectedBundle("bundle-5");
    } else if (desiredBundle === "3") {
      setSelectedBundle("bundle-3");
    }
  }, [isFragrance, searchParams]);

  // Global selections (applies to "SINGLE" or serves as base for Duo/Trio)
  const selectedSize = bundleSelections[0].size;
  const setSelectedSize = (size: string) => {
    setBundleSelections((prev) => {
      const next = [...prev];
      next[0] = { ...next[0], size };
      return next;
    });
  };

  const selectedColor = bundleSelections[0]?.color || "";
  const setSelectedColor = (color: string) => {
    // Update State
    setBundleSelections((prev) => {
      const next = [...prev];
      next[0] = { ...next[0], color };
      return next;
    });

    // Update URL for Gallery Sync
    const params = new URLSearchParams(window.location.search);
    params.set("color", color);
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const updateBundleSelection = (
    index: number,
    field: "color" | "size" | "productId",
    value: string,
  ) => {
    setBundleSelections((prev) => {
      const next = [...prev];
      const current = next[index];

      if (field === "productId") {
        const selectedProduct =
          collectionProducts.find((item) => item.id === value) || product;
        const selectedSizes = getProductSizes(selectedProduct);
        next[index] = {
          ...current,
          productId: selectedProduct.id,
          size: selectedSizes.includes(current.size)
            ? current.size
            : selectedSizes[0],
        };
        return next;
      }

      next[index] = { ...current, [field]: value };
      return next;
    });
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    if (isFragrance && selectedBundle !== "single") {
      const bundle = bundles.find((item) => item.id === selectedBundle);
      const count = getBundleItemCount(selectedBundle, true);
      const selectedItems = bundleSelections
        .slice(0, count)
        .map((selection) => {
          const selectedProduct =
            collectionProducts.find(
              (item) => item.id === selection.productId,
            ) || product;

          return {
            product: selectedProduct,
            selection,
          };
        });

      const bundleProduct: Product = {
        ...product,
        id: `${selectedBundle}-${selectedItems
          .map((item) => `${item.product.id}-${item.selection.size}`)
          .join("-")}`,
        handle: product.handle,
        title: bundle?.title || product.title,
        description: selectedItems
          .map((item) => item.product.title)
          .join(" | "),
        images: [selectedItems[0]?.product.images?.[0] || safeImage],
        price: bundle?.price || 0,
        originalPrice: bundle?.original || 0,
        opcoesTamanho: [],
      };

      addToCart(
        bundleProduct,
        selectedItems
          .map((item) => `${item.product.title} (${item.selection.size})`)
          .join(" | "),
      );
    } else {
      const count = getBundleItemCount(selectedBundle, false);
      const priceMultiplier =
        selectedBundle === "single" ? 1 : selectedBundle === "duo" ? 0.9 : 0.8;
      const discountedPrice = currentBasePrice * priceMultiplier;

      for (let i = 0; i < count; i += 1) {
        const selection = bundleSelections[i];
        const selectedProduct =
          collectionProducts.find((item) => item.id === selection.productId) ||
          product;
        const productToAdd = { ...selectedProduct, price: discountedPrice };
        const combinedSize = selection.color
          ? `${selection.color} - ${selection.size}`
          : selection.size;
        addToCart(productToAdd, combinedSize);
      }
    }

    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  // DYNAMIC PRICING ENGINE: Find currently selected variant price
  const variant = (product as any).variantes?.find(
    (v: any) => (v.label || v.name) === selectedSize,
  );
  const currentBasePrice =
    isFragrance || !variant
      ? Number(product.price) || 0
      : Number(variant.price) || 0;
  const currentBaseOriginal =
    isFragrance || !variant
      ? Number(product.originalPrice) || 0
      : Number(variant.originalPrice) || 0;
  const getOriginalSumForSelection = (count: number) =>
    bundleSelections.slice(0, count).reduce((total, selection) => {
      const selectedProduct =
        collectionProducts.find((item) => item.id === selection.productId) ||
        product;
      return total + Number(selectedProduct.originalPrice || 0);
    }, 0);

  const bundles = isFragrance
    ? [
        {
          id: "single",
          title: "Single Pack",
          desc: "Standard price",
          price: currentBasePrice,
          original: currentBaseOriginal,
          save: null,
          badge: null,
        },
        {
          id: "bundle-3",
          title: FRAGRANCE_COLLECTION_BUNDLES[0].title,
          desc: "Choose any 3 fragrances",
          price: FRAGRANCE_COLLECTION_BUNDLES[0].price,
          original: getOriginalSumForSelection(3),
          save:
            getOriginalSumForSelection(3) >
            FRAGRANCE_COLLECTION_BUNDLES[0].price
              ? `SAVE £${(
                  getOriginalSumForSelection(3) -
                  FRAGRANCE_COLLECTION_BUNDLES[0].price
                ).toFixed(2)}`
              : null,
          badge: FRAGRANCE_COLLECTION_BUNDLES[0].badge,
        },
        {
          id: "bundle-5",
          title: FRAGRANCE_COLLECTION_BUNDLES[1].title,
          desc: "Choose any 5 fragrances",
          price: FRAGRANCE_COLLECTION_BUNDLES[1].price,
          original: getOriginalSumForSelection(5),
          save:
            getOriginalSumForSelection(5) >
            FRAGRANCE_COLLECTION_BUNDLES[1].price
              ? `SAVE £${(
                  getOriginalSumForSelection(5) -
                  FRAGRANCE_COLLECTION_BUNDLES[1].price
                ).toFixed(2)}`
              : null,
          badge: FRAGRANCE_COLLECTION_BUNDLES[1].badge,
          isPopular: true,
        },
      ]
    : [
        {
          id: "single",
          title: "Single Pack",
          desc: "Standard price",
          price: currentBasePrice,
          original: currentBaseOriginal,
          save: null,
          badge: null,
        },
        {
          id: "duo",
          title: "Duo Pack",
          desc: "You save 10%",
          price: currentBasePrice * 1.8,
          original: currentBaseOriginal * 2,
          save:
            currentBaseOriginal * 2 > currentBasePrice * 1.8
              ? `SAVE £${(currentBaseOriginal * 2 - currentBasePrice * 1.8).toFixed(2)}`
              : null,
          badge: "Most Popular",
          isPopular: true,
        },
        {
          id: "trio",
          title: "Trio Pack",
          desc: "You save 20%",
          price: currentBasePrice * 2.4,
          original: currentBaseOriginal * 3,
          save:
            currentBaseOriginal * 3 > currentBasePrice * 2.4
              ? `SAVE £${(currentBaseOriginal * 3 - currentBasePrice * 2.4).toFixed(2)}`
              : null,
          badge: null,
        },
      ];

  const handleOpenPicker = (idx: number) => {
    setActiveSlotIdx(idx);
    setIsPickerOpen(true);
  };

  const handleSelectFragrance = (selectedProd: Product) => {
    if (activeSlotIdx !== null) {
      updateBundleSelection(activeSlotIdx, "productId" as any, selectedProd.id);
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
                  className={`absolute inset-0 border-[2px] rounded-lg transition-all duration-500 group-hover:scale-105 ${
                    selectedColor === color.name
                      ? "border-yellow-300"
                      : "border-white/10 opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div className="size-[100%] bg-[#F2F2F2] rounded-lg overflow-hidden flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:scale-105">
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
        {isSet ? (
          <div className="border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/65">
              Bundle volumes are configured item by item below.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`aspect-square h-12 w-20 flex items-center justify-center border text-xl font-semibold transition-all duration-500 ${
                  selectedSize === size
                    ? "border-white text-white bg-accent/5"
                    : "border-white/5 text-white/30 hover:border-white/20 hover:text-accent"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bundle Selection */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="h-[1px] flex-grow bg-white/10" />
          <h3 className="text-sm font-black uppercase tracking-luxury text-white/90">
            Bundle & Save
          </h3>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>

        {bundles.map((bundle) => (
          <div key={bundle.id} className="relative">
            {bundle.isPopular && (
              <div className="absolute top-[-12px] inset-x-0 flex justify-end z-20">
                <div className="bg-black px-4 h-6 flex items-center justify-center rounded-full border border-white/10 shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                    {bundle.badge || "Most Popular"}
                  </span>
                </div>
              </div>
            )}
            <div
              onClick={() => setSelectedBundle(bundle.id)}
              className={`relative w-full cursor-pointer rounded-xl transition-all duration-500 border overflow-hidden ${
                selectedBundle === bundle.id
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
                      className={`h-5 w-5 rounded-full transition-all duration-500 ${
                        selectedBundle === bundle.id
                          ? "bg-white/90 scale-100"
                          : "bg-transparent scale-0"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-none">
                      {bundle.title}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {bundle.desc}
                    </p>
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
                className={`transition-all duration-500 ease-in-out border-t border-white/5 bg-black/20 ${
                  selectedBundle === bundle.id && bundle.id !== "single"
                    ? "max-h-64 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 pt-3 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-luxury text-white/90 mb-2">
                    {isFragrance
                      ? "Configure your fragrances and volumes"
                      : "Configure your items: Color & Size"}
                  </p>
                  {[...Array(getBundleItemCount(bundle.id, isFragrance))].map(
                    (_, idx) => {
                      const currentSelection = bundleSelections[idx];
                      const selectedItemProduct =
                        collectionProducts.find(
                          (p) => p.id === currentSelection.productId,
                        ) || product;
                      const itemThumb =
                        selectedItemProduct.images?.[0] || safeImage;
                      const selectionSizes =
                        getProductSizes(selectedItemProduct);

                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="size-10 bg-[#F2F2F2] rounded-md overflow-hidden flex items-center justify-center p-1 shrink-0 border border-white/5">
                            <img
                              src={
                                isFragrance
                                  ? itemThumb
                                  : colors.find(
                                      (c) =>
                                        c.name === bundleSelections[idx].color,
                                    )?.image || safeImage
                              }
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
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[#C5A358]">
                                    Select Fragrance
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate max-w-[120px]">
                                    {selectedItemProduct.title}
                                  </span>
                                </div>
                                <Sparkles
                                  size={14}
                                  className="text-accent group-hover/btn:scale-110 transition-transform"
                                />
                              </button>
                            </div>
                          ) : (
                            <>
                              {colors.length > 0 && (
                                <div className="relative flex-grow h-10">
                                  <select
                                    value={bundleSelections[idx].color}
                                    onChange={(e) =>
                                      updateBundleSelection(
                                        idx,
                                        "color",
                                        e.target.value,
                                      )
                                    }
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

                          <div
                            className={`relative h-10 ${colors.length > 0 || isFragrance ? "w-20" : "flex-grow"}`}
                          >
                            <select
                              value={bundleSelections[idx].size}
                              onChange={(e) =>
                                updateBundleSelection(
                                  idx,
                                  "size",
                                  e.target.value,
                                )
                              }
                              className="w-full h-full bg-white/5 border border-white/10 rounded-md px-3 pr-8 text-[10px] font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
                            >
                              {selectionSizes.map((s: string) => (
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
                    },
                  )}
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
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
                  Fragrance Selection Vault
                </h2>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent italic">
                  Select your next essence from the house of North Mind
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="size-12 md:size-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Product Grid */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-1 md:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-1">
                {collectionProducts.map((p) => {
                  const isSelected =
                    activeSlotIdx !== null &&
                    bundleSelections[activeSlotIdx].productId === p.id;

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
