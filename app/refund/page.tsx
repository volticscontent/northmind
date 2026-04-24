"use client";

import React from "react";
import { Undo2 } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Returns & Refunds"
      icon={Undo2}
      lastUpdated="April 2026"
    >
      <div className="space-y-12">
        <div className="p-10 bg-white/5 border border-white/10 rounded-3xl group hover:border-accent/20 transition-all">
          <h2 className="text-sm font-black uppercase tracking-widest text-accent mb-4">Return Window</h2>
          <p className="text-3xl font-light text-white italic">Returns are accepted within <span className="font-bold not-italic">14 days</span> of delivery.</p>
          <p className="mt-6 text-sm text-white/40 leading-relaxed font-normal">Items must be unused, in their original condition, and with all heritage tags attached to be eligible for a refund.</p>
        </div>
        <div className="p-10 bg-white/5 border border-white/10 rounded-3xl group hover:border-accent/20 transition-all">
          <h2 className="text-sm font-black uppercase tracking-widest text-accent mb-4">Refund Processing</h2>
          <p className="text-3xl font-light text-white italic">Refunds are processed within <span className="font-bold not-italic">5–10 business days</span>.</p>
          <p className="mt-6 text-sm text-white/40 leading-relaxed font-normal">Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be applied to your original method of payment.</p>
        </div>
      </div>
    </PolicyLayout>
  );
}
