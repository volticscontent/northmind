"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PolicyLayoutProps {
  title: string;
  icon: React.ElementType;
  lastUpdated: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  icon: Icon,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  // Split title into words to style them differently
  const titleWords = title.split(" ");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Header />

      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all mb-12 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Boutique
        </Link>

        <header className="mb-16 border-b border-white/10 pb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white/40">
                  Legal Protocol
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 italic leading-none">
                {titleWords.map((word, i) => (
                  <span key={i} className={i === 1 ? "font-bold not-italic" : "not-italic"}>
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                Last Updated: {lastUpdated} • International Standards
              </p>
            </div>
          </div>
        </header>

        <section className="relative min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 text-white/70 leading-relaxed font-light prose prose-invert max-w-none prose-p:text-sm md:prose-p:text-base prose-headings:text-white prose-headings:font-medium prose-li:text-sm md:prose-li:text-base"
          >
            {children}
          </motion.div>
        </section>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Direct Inquiries</p>
             <a href="mailto:support@northmind.store" className="text-xl font-light hover:text-accent transition-colors">
               support@northmind.store
             </a>
           </div>
           <Link href="/about" className="flex items-center gap-4 px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all">
             Our Heritage <ArrowRight size={14} />
           </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
