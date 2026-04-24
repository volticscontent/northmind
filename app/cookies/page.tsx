"use client";

import React from "react";
import { Cookie } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function CookiesPolicy() {
  return (
    <PolicyLayout
      title="Cookies Policy"
      icon={Cookie}
      lastUpdated="April 2026"
    >
      <div className="space-y-6">
        <p className="text-xl font-light leading-relaxed">
          We use cookies to improve your experience, store preferences, and analyse traffic to ensure the best performance of our heritage boutique.
        </p>
        <div className="space-y-4 pt-4 border-l border-white/10 pl-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-[#C5A358]">Essential Cookies</h3>
           <p className="text-sm text-white/50">Necessary for basic site functions like checkout and login.</p>
        </div>
        <div className="space-y-4 pt-4 border-l border-white/10 pl-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-[#C5A358]">Performance & Analytics</h3>
           <p className="text-sm text-white/50">Helps us understand how you interact with North Mind to improve our technical design.</p>
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium pt-8">
          Contact us for data inquiries: support@northmind.store
        </p>
      </div>
    </PolicyLayout>
  );
}
