"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  guide: any; // { type: "table", headers: [...], rows: [...] }
}

export function ProductSizeGuide({ isOpen, onClose, guide }: ProductSizeGuideProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const data = guide || {
    headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
    rows: [
      ["S", "54", "70", "64"],
      ["M", "56", "72", "66"],
      ["L", "58", "74", "68"],
      ["XL", "60", "76", "70"]
    ]
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-xl h-full bg-[#0a0a0b] border-l border-white/5 shadow-2xl p-8 md:p-12 animate-in slide-in-from-right duration-700 ease-in-out overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-12">
          <header className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Size Guide</h2>
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest leading-relaxed">
              Find your perfect fit. Our garments are tailored to the North Mind standard of excellence.
            </p>
          </header>

          <div className="overflow-hidden border border-white/5 rounded-2xl bg-white/[0.02]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                  {data.headers.map((h: string, i: number) => (
                    <th key={i} className="px-6 py-4 text-[10px] font-black uppercase tracking-luxury text-accent">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {data.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-white/[0.01] transition-colors">
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className={`px-6 py-5 text-xs font-medium ${cellIndex === 0 ? "text-white font-black" : "text-white/60"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-luxury text-white/30">How to Measure</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-widest">1. Chest</p>
                <p className="text-[11px] font-medium leading-relaxed text-white/40">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-widest">2. Length</p>
                <p className="text-[11px] font-medium leading-relaxed text-white/40">Measure from the highest point of your shoulder down to the hem.</p>
              </div>
            </div>
          </div>

          <footer className="pt-12 border-t border-white/5">
            <p className="text-[10px] font-medium italic text-white/20">
              * Measurements are in centimeters. Fit may vary slightly depending on the collection&apos;s silhouette.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
