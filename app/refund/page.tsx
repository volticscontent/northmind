"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RotateCcw, ChevronLeft, Package, Clock } from "lucide-react";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <Link href="/user" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all mb-12">
          <ChevronLeft size={14} /> Back to Account
        </Link>

        <header className="mb-16 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <RotateCcw className="text-accent" size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Heritage Guarantee</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 italic">Refund <span className="font-medium not-italic">& Returns</span></h1>
          <p className="text-sm text-white/40 font-medium uppercase tracking-widest">Standard UK 14-Day Return Window</p>
        </header>

        <section className="space-y-16 text-white/80 leading-relaxed font-light">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-10 bg-white/[0.02] border border-white/10 rounded-3xl text-center">
              <Clock className="mx-auto mb-6 text-accent" size={32} />
              <h3 className="text-lg font-medium text-white mb-2 uppercase tracking-widest">14 Days</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                You have 14 days from receipt of your shipment to notify us of your intent to return.
              </p>
            </div>
            <div className="p-10 bg-white/[0.02] border border-white/10 rounded-3xl text-center">
              <Package className="mx-auto mb-6 text-accent" size={32} />
              <h3 className="text-lg font-medium text-white mb-2 uppercase tracking-widest">Original Condition</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Items must be unworn, unwashed, and in their original heritage packaging with all tags attached.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">1. Return Process</h2>
            <p className="text-sm md:text-base">
              To initiate a return, please visit your account dashboard or contact <Link href="mailto:support@northmind.uk" className="text-accent hover:underline">support@northmind.uk</Link> with your order number. We will provide you with a return authorization and shipping instructions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">2. Refunds</h2>
            <p className="text-sm md:text-base">
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
            </p>
          </div>

           <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">3. Fragrance Policy</h2>
            <p className="text-sm md:text-base">
              For hygiene reasons, fragrances can only be returned if they are in their original, sealed, and unopened cellophane packaging. Samples and sets that have been opened are not eligible for return.
            </p>
          </div>

          <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
            <h3 className="text-xl font-medium text-white mb-4">Need Help with your Return?</h3>
            <p className="text-sm text-white/60 mb-8 max-w-md mx-auto leading-relaxed uppercase tracking-widest">
              Our support team is available 24/7 to assist with any questions regarding your heritage pieces.
            </p>
            <a href="mailto:support@northmind.uk" className="inline-block px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors">
              Contact Support
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
