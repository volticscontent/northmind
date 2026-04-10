"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trash2, ChevronLeft, AlertTriangle, CheckCircle } from "lucide-react";

export default function DataDeletion() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for data deletion request
    setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        console.log(`Data deletion request for: ${email}`);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <Link href="/user" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all mb-12">
          <ChevronLeft size={14} /> Back to Account
        </Link>

        {!submitted ? (
          <>
            <header className="mb-16 border-b border-white/10 pb-8">
              <div className="flex items-center gap-4 mb-4">
                <Trash2 className="text-rose-500/60" size={24} />
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Privacy Controls</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 italic">Right to <span className="font-medium not-italic text-rose-500/80">Erasure</span></h1>
              <p className="text-sm text-white/40 font-medium uppercase tracking-widest">Delete your North Mind account and data permanently.</p>
            </header>

            <section className="space-y-12 text-white/80 leading-relaxed font-light">
              <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl flex items-start gap-6">
                <AlertTriangle className="text-rose-500/60 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Important Information</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    By submitting this request, your account, order history, and personal information will be permanently removed from our active systems. 
                    This action is irreversible and you will lose access to your member area and heritage collection records.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">Request Permanent Deletion</h2>
                <p className="text-sm md:text-base mb-8">
                  Please enter the email address associated with your North Mind account. We will send a confirmation link to this address to verify your request.
                </p>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. nathan@northmind.uk"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:border-accent focus:bg-white/[0.05] transition-all outline-none"
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-5 bg-rose-600/20 border border-rose-600/30 text-rose-100 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "CONFIRM DATA ERASURE"}
                  </button>
                </form>
              </div>

              <div className="space-y-6 pt-12">
                <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">UK GDPR Compliance</h2>
                <p className="text-sm md:text-base">
                  North Mind complies with the Data Protection Act 2018 and the UK GDPR. Once your request is verified, we will aim to complete the deletion within 30 days. We may retain certain transaction data for legal and accounting purposes as required by HMRC.
                </p>
              </div>
            </section>
          </>
        ) : (
          <div className="py-20 text-center animate-fade-in">
            <CheckCircle className="mx-auto mb-8 text-emerald-500/60" size={64} />
            <h2 className="text-3xl font-light mb-4 italic">Request <span className="font-medium not-italic">Received</span></h2>
            <p className="text-white/40 max-w-md mx-auto mb-12 leading-relaxed uppercase tracking-widest text-xs">
              We have sent a verification email to <span className="text-white font-bold">{email}</span>. Please click the link in that email to confirm your permanent data deletion.
            </p>
            <Link href="/" className="inline-block px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors">
              Return to Store
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
