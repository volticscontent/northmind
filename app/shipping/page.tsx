"use client";

import React from "react";
import { Truck } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping Logistics"
      lastUpdated="April 2026"
    >
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-b border-white/10">
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-6">Processing Protocol</h2>
            <p className="text-3xl font-medium text-white mb-4">1–3 Days</p>
            <p className="text-sm text-white/50 font-light leading-relaxed">Order validation, precision quality check, and professional packaging prior to dispatch.</p>
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-6">Transit Duration</h2>
            <p className="text-3xl font-medium text-white mb-4">7–15 Days</p>
            <p className="text-sm text-white/50 font-light leading-relaxed">Global delivery through our network of elite premium couriers straight to your door.</p>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto pt-8">
          <p className="text-sm text-white/50 leading-relaxed font-light">
            Excellence takes time. We ensure every piece reaches you in pristine condition, regardless of your global coordinates.
          </p>
        </div>

        <div className="space-y-12 max-w-3xl mx-auto pt-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Order Processing</h3>
            <p className="text-sm text-white/60 leading-relaxed">Orders are processed within 1-2 business days. You will receive a confirmation email with a tracking number once your order has been dispatched.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Failed Delivery / Returned to Sender</h3>
            <p className="text-sm text-white/60 leading-relaxed">If a package is returned to us due to an incorrect address provided at checkout, or failure to collect from a local depot, a re-shipping fee may apply.</p>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
