"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function WarrantyPolicy() {
  return (
    <PolicyLayout
      title="Warranty Protocols"
      icon={ShieldCheck}
      lastUpdated="April 2026"
    >
      <div className="space-y-12">
        <div className="p-12 md:p-20 bg-accent/5 border border-accent/20 rounded-[3rem] relative overflow-hidden group hover:bg-accent/10 transition-colors">
          <div className="absolute top-0 right-0 p-8 text-accent/10 group-hover:text-accent/20 transition-all duration-700">
            <ShieldCheck size={160} strokeWidth={0.5} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-8">Limited Heritage Warranty</h2>
          <p className="text-4xl md:text-6xl font-light text-white italic leading-tight">
            Comprehensive <span className="font-bold not-italic">30-day</span> warranty for all manufacturing defects.
          </p>
          <p className="mt-12 text-sm text-white/40 leading-relaxed font-normal max-w-xl">
            Our commitment to British craftsmanship is unwavering. Every North Mind asset undergoes rigorous inspection before departure. If a manufacturing flaw is detected within 30 days of purchase, we offer a full repair or replacement.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
           <div className="flex-1 p-8 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C5A358] mb-4">Inclusions</h4>
              <p className="text-xs text-white/60">Structural failures, sewing defects, material imperfections beyond natural variation.</p>
           </div>
           <div className="flex-1 p-8 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C5A358] mb-4">Exclusions</h4>
              <p className="text-xs text-white/60">Accidental damage, misuse, improper cleaning, natural wear and tear over time.</p>
           </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
