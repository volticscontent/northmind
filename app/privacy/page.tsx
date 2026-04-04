"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <Link href="/user" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all mb-12">
          <ChevronLeft size={14} /> Back to Account
        </Link>

        <header className="mb-16 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="text-accent" size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Legal & Transparency</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 italic">Privacy <span className="font-medium not-italic">Policy</span></h1>
          <p className="text-sm text-white/40 font-medium uppercase tracking-widest">Last Updated: April 2026 • UK GDPR Compliant</p>
        </header>

        <section className="space-y-16 text-white/80 leading-relaxed font-light">
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">1. Commitment to Privacy</h2>
            <p className="text-sm md:text-base">
              At North Mind, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information when you visit our website and purchase our heritage pieces.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">2. Data We Collect</h2>
            <ul className="list-none space-y-4 text-sm md:text-base pl-6">
              <li className="flex gap-4">
                <span className="text-accent font-bold">•</span>
                <span><strong className="text-white font-medium">Personal Identification:</strong> Name, email address, and phone number.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold">•</span>
                <span><strong className="text-white font-medium">Transactional Data:</strong> Payment details (processed securely via Stripe), billing and shipping addresses.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold">•</span>
                <span><strong className="text-white font-medium">Technical & Analytics:</strong> IP address, device type, and browsing patterns to improve our luxury experience.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">3. Use of Information</h2>
            <p className="text-sm md:text-base">
              Your data is primarily used to fulfill your orders, provide customer support, and, with your consent, send updates about new collections. We do not sell your data to third parties.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">4. UK GDPR Rights</h2>
            <p className="text-sm md:text-base mb-4">
              Under the UK General Data Protection Regulation, you have the following rights:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Right of Access</p>
                <p className="text-xs text-white/60">Request a copy of the personal data we hold about you.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Right to Erasure</p>
                <p className="text-xs text-white/60">Request that we delete your data ("Right to be Forgotten").</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 p-8 rounded-3xl border border-accent/20">
            <h3 className="text-lg font-medium text-white mb-4">Contact Our Data Liaison</h3>
            <p className="text-sm text-white/60 mb-6 font-normal">
              For any privacy-related inquiries or to exercise your rights, please contact us:
            </p>
            <a href="mailto:privacy@northmind.uk" className="inline-block px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors">
              privacy@northmind.uk
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
