"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PolicyLayoutProps {
  title: string;
  icon?: React.ElementType; // Optional now, we might not use it visually
  lastUpdated: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Header />

      <div className="pt-32 pb-32 px-6 max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-16"
        >
          &larr; Back to Boutique
        </Link>

        <header className="mb-16 pb-8 border-b border-white/10">
          <span className="block text-[9px] uppercase font-black tracking-widest text-white/40 mb-4">
            Legal Protocol
          </span>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 uppercase">
            {title}
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <section className="relative min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 text-white/60 leading-relaxed font-light text-sm md:text-base prose prose-invert max-w-none prose-headings:text-white prose-headings:font-medium prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-xs prose-a:text-white prose-a:underline-offset-4 hover:prose-a:text-white/70"
          >
            {children}
          </motion.div>
        </section>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
           <div className="space-y-1">
             <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Direct Inquiries</p>
             <a href="mailto:support@northmind.store" className="text-sm font-medium hover:text-white/70 transition-colors">
               support@northmind.store
             </a>
           </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
