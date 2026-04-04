"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck, ChevronLeft, ChevronRight, MapPin, Package, Clock } from "lucide-react";

export default function ShippingPage() {
  const regions = [
    { name: "Mainland UK", time: "1-2 Business Days", price: "Free on orders over £200" },
    { name: "Europe (EU)", time: "3-5 Business Days", price: "Priority Tracked" },
    { name: "International", time: "5-10 Business Days", price: "Premium Logistics" }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <nav className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-white/30 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-white font-bold">Logistics Protocols</span>
        </nav>

        <header className="mb-20 border-b border-white/10 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <Truck className="text-accent" size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Heritage Distribution</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-6 italic leading-none">
            Shipping <span className="font-bold not-italic">& Delivery</span>
          </h1>
          <p className="text-sm text-white/30 uppercase tracking-[0.2em] max-w-md italic">
            Global delivery standards for the modern collector.
          </p>
        </header>

        <section className="space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <Package className="mx-auto mb-6 text-accent/40" size={32} />
              <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 leading-tight italic">Secure <span className="not-italic">Packaging</span></h3>
              <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed">
                All heritage pieces are packed in vacuum-sealed luxury boxes to preserve fabric integrity.
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <Clock className="mx-auto mb-6 text-accent/40" size={32} />
              <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 leading-tight italic">Priority <span className="not-italic">Dispatch</span></h3>
              <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed">
                Orders placed before 2:00 PM GMT are typically dispatched the same business day.
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <MapPin className="mx-auto mb-6 text-accent/40" size={32} />
              <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 leading-tight italic">Tracked <span className="not-italic">Journey</span></h3>
              <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed">
                Full end-to-end tracking provided via email and SMS on all priority shipments.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-light uppercase tracking-widest text-white pl-4 border-l-2 border-accent mb-8 italic">Delivery <span className="font-medium not-italic">Estimates</span></h2>
            <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.03]">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Destination</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Estimate</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {regions.map((region, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 text-sm font-medium text-white">{region.name}</td>
                      <td className="px-8 py-6 text-sm text-white/40">{region.time}</td>
                      <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-accent">{region.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
            <h3 className="text-xl font-medium text-white mb-4 italic">Customs & Duties</h3>
            <p className="text-sm text-white/40 mb-8 max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
              Please note that international orders may be subject to import duties and taxes. These costs are calculated locally and are not included in our logistics protocol.
            </p>
            <Link href="mailto:logistics@northmind.uk" className="inline-block px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors">
              Enquire Logistics
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
