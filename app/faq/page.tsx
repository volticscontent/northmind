"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    { 
      q: "Origins & Heritage", 
      a: "North Mind was established in 2026 to bridge the gap between traditional British craftsmanship and the demands of the modern technical landscape. Each piece is a testament to our pursuit of silent luxury." 
    },
    { 
      q: "Global Logistics", 
      a: "We offer priority worldwide shipping. UK orders are typically delivered within 1-2 business days via our premium courier network. International deliveries vary by destination but always include full end-to-end tracking." 
    },
    { 
      q: "Garment Maintenance", 
      a: "To preserve the integrity of our high-performance fabrics and heritage wools, we recommend professional dry cleaning. For technical jackets, avoid traditional fabric softeners to maintain water-repellent properties." 
    },
    {
      q: "Returns & Exchanges",
      a: "We provide a 14-day window for returns of unworn items in their original packaging. For more details, please visit our Refund Policy page in the member area."
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-white/30 mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-white">Central Help</span>
        </nav>

        <header className="mb-20 border-b border-white/10 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <HelpCircle className="text-accent" size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white/40">Knowledge Base</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-6 italic leading-none">
            Common <span className="font-bold not-italic">Inquiries</span>
          </h1>
          <p className="text-sm text-white/30 uppercase tracking-[0.2em] max-w-md italic">
            Essential information regarding our protocols and heritage standards.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="group p-8 md:p-12 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-700 rounded-3xl">
              <h3 className="text-sm md:text-lg font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-4">
                <span className="text-accent/20 group-hover:text-accent transition-colors font-black">0{i+1}</span>
                {faq.q}
              </h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed font-light pl-10">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-accent/5 rounded-3xl border border-accent/10 text-center">
          <h3 className="text-xl font-medium text-white mb-4 italic">Still seeking clarity?</h3>
          <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto uppercase tracking-widest">
            Our concierge team is at your disposal for bespoke assistance.
          </p>
          <a href="mailto:support@northmind.uk" className="inline-block px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors">
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
