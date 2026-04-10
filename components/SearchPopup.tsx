"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCollections, Product, Collection } from "@/lib/data-loader";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [pData, cData] = await Promise.all([getProducts(), getCollections()]);
      setProducts(pData);
      setCollections(cData);
      setIsLoading(false);
    }
    if (isOpen) {
      loadData();
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.collection.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Card container */}
          <motion.div
            ref={cardRef}
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-start justify-center pt-20 pointer-events-none"
          >
            <div className="w-[90vw] max-w-xl pointer-events-auto">
              {/* Border Glow wrapper */}
              <div className="border-glow-card rounded-2xl p-[1px]">
                <div className="bg-[#0a0a09] rounded-2xl p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                      Intelligent Search
                    </span>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-4 focus-within:border-white/30 transition-all bg-white/5">
                    <Search size={18} className="text-white/30 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="bg-transparent w-full text-base text-white placeholder:text-white/25 outline-none"
                    />
                  </div>

                  {/* Results Section */}
                  <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-white/10">

                    {/* Collections */}
                    {(query === "" || filteredCollections.length > 0) && (
                      <div className="space-y-3">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-bold">
                          Collections
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {filteredCollections.map((c) => (
                            <Link
                              key={c.handle}
                              href={`/collections/${c.handle}`}
                              onClick={onClose}
                              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:border-white/30 transition-all"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products */}
                    <div className="space-y-4">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-bold">
                        {query ? "Product Results" : "Featured Products"}
                      </span>

                      <div className="space-y-2">
                        {isLoading ? (
                          <div className="py-8 flex justify-center">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          </div>
                        ) : filteredProducts.length > 0 ? (
                          filteredProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.handle}`}
                              onClick={onClose}
                              className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 group transition-all"
                            >
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-white/10">
                                <Image
                                  src={p.images[0] || "/assets/community/1.png"}
                                  alt={p.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="text-sm font-bold text-white/90 group-hover:text-white truncate">
                                  {p.title}
                                </h4>
                                <p className="text-[10px] uppercase tracking-luxury text-white/40 mt-1">
                                  {p.collection}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-white">
                                  £{p.price.toFixed(2)}
                                </span>
                                {p.originalPrice > p.price && (
                                  <p className="text-[10px] text-white/30 line-through mt-0.5">
                                    £{p.originalPrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-white/30 py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                            No products found matching "{query}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
