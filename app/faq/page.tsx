"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function FAQPage() {
  return (
    <PolicyLayout
      title="Common Inquiries"
      icon={HelpCircle}
      lastUpdated="April 2026"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Dispatch", value: "1–3 business days" },
            { label: "Delivery", value: "7–15 business days" },
            { label: "Tracking", value: "Yes, fully end-to-end" },
            { label: "Exchanges", value: "Not available per policy" },
            { label: "Support", value: "support@northmind.store" },
            { label: "Warranty", value: "30-day manufacturing guarantee" },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl group hover:border-accent/30 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">{item.label}</p>
              <p className="text-xl font-light text-white italic">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </PolicyLayout>
  );
}
