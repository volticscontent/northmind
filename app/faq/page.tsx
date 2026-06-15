"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function FAQPage() {
  return (
    <PolicyLayout
      title="Common Inquiries"
      lastUpdated="April 2026"
    >
      <div className="space-y-12">
        <div className="border-t border-white/10 pt-8">
          {[
            { label: "Dispatch", value: "1–3 business days" },
            { label: "Delivery", value: "7–15 business days" },
            { label: "Tracking", value: "Yes, fully end-to-end" },
            { label: "Exchanges", value: "Not available per policy" },
            { label: "Support", value: "support@northmind.store" },
            { label: "Warranty", value: "30-day manufacturing guarantee" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 group">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/50 mb-2 md:mb-0 w-1/3">{item.label}</p>
              <p className="text-sm font-light text-white md:w-2/3">{item.value}</p>
            </div>
          ))}
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-white/60 leading-relaxed font-light">
            If you have any further questions that are not addressed here, please contact our support team. We aim to respond to all inquiries within 24 hours.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
