"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestions = [
  { label: "Jackets", href: "/collections/jackets" },
  { label: "Silent Warmth", href: "/collections/silent-warmth" },
  { label: "British Heritage", href: "/collections/jackets" },
  { label: "Premium Leather", href: "/collections/jackets" },
  { label: "Winter Classics", href: "/collections/silent-warmth" },
];

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
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

  const filtered = suggestions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
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
            <div className="w-[90vw] max-w-lg pointer-events-auto">
              {/* Border Glow wrapper */}
              <div className="border-glow-card rounded-2xl p-[1px]">
                <div className="bg-black rounded-2xl p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                      Pesquisar
                    </span>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
                    <Search size={18} className="text-white/30 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="O que você procura?"
                      className="bg-transparent w-full text-sm text-white placeholder:text-white/25 outline-none"
                    />
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-bold">
                      {query ? "Resultados" : "Destinos populares"}
                    </span>
                    <div className="space-y-0.5 mt-2">
                      {filtered.length > 0 ? (
                        filtered.map((s) => (
                          <Link
                            key={s.label}
                            href={s.href}
                            onClick={onClose}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 group transition-all"
                          >
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                              {s.label}
                            </span>
                            <ArrowRight
                              size={14}
                              className="text-white/0 group-hover:text-white/50 transition-all transform group-hover:translate-x-1"
                            />
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-white/30 px-3 py-4 text-center">
                          Nenhum resultado encontrado
                        </p>
                      )}
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
