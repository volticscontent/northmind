"use client";

import React from "react";
import { Truck } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping Logistics"
      icon={Truck}
      lastUpdated="April 2026"
    >
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 p-10 bg-white/5 border border-white/10 rounded-3xl group hover:border-accent/10 transition-all">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-accent mb-6">Processing Protocol</h2>
            <p className="text-4xl font-light text-white italic leading-tight"><span className="font-bold not-italic">1–3</span> Days</p>
            <p className="mt-8 text-xs text-white/30 uppercase tracking-[0.2em] font-medium">Order validation, precision quality check, and professional packaging.</p>
          </div>
          <div className="flex-1 p-10 bg-accent/5 border border-accent/20 rounded-3xl group hover:bg-accent/10 transition-all">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-accent mb-6">Transit Duration</h2>
            <p className="text-4xl font-light text-white italic leading-tight"><span className="font-bold not-italic">7–15</span> Days</p>
            <p className="mt-8 text-xs text-white/30 uppercase tracking-[0.2em] font-medium">Global delivery through our network of elite premium couriers.</p>
          </div>
        </div>
        <p className="text-sm text-white/40 leading-relaxed max-w-2xl mx-auto text-center italic font-light">
          &quot;Excellence takes time. We ensure every piece reaches you in pristine condition, regardless of your global coordinates.&quot;
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">3. Order Processing</h2>
          <p className="text-white/70">Orders are processed within 1-2 business days. You will receive a confirmation email with a tracking number once your order has been dispatched.</p>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">4. &quot;Failed Delivery&quot; or Returned to Sender</h2>
          <p className="text-white/70">If a package is returned to us due to an incorrect address provided at checkout, or failure to collect from a local depot, a re-shipping fee may apply.</p>
        </div>
      </div>
    </PolicyLayout>
  );
}
