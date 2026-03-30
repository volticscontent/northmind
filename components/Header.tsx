"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black border-b border-white/5" 
            : "bg-transparent border-b border-white/0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-24 flex items-center justify-between">
          <button className="md:hidden p-2 text-white/50 hover:text-accent transition-colors">
            <Menu size={20} />
          </button>
          
          <nav className="hidden md:flex items-center gap-12">
            <Link href="/collections/jackets" className="text-[10px] uppercase font-bold tracking-luxury text-white/40 hover:text-accent transition-all duration-300">
              Jackets
            </Link>
            <Link href="/collections/silent-warmth" className="text-[10px] uppercase font-bold tracking-luxury text-white/40 hover:text-accent transition-all duration-300">
              Silent Warmth
            </Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 transition-transform duration-500 hover:scale-105">
            <Image 
              src="/assets/logo.svg" 
              alt="NORTH MIND" 
              width={160} 
              height={50} 
              priority
              className="h-8 md:h-12 w-auto invert brightness-0"
            />
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2 text-white/80 hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <button className="hidden md:block p-2 text-white/80 hover:text-gold transition-colors">
              <User size={20} />
            </button>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-white/80 hover:text-gold transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
