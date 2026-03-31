"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { SearchPopup } from "./SearchPopup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Header() {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const icons = [
    { id: "search", icon: Search, label: "Pesquisar", action: () => setIsSearchOpen(true) },
    { 
      id: "auth", 
      icon: User, 
      label: status === "authenticated" ? (session?.user?.name?.split(" ")[0] || "Perfil") : "Login", 
      action: () => router.push(status === "authenticated" ? "/customer" : "/login"), 
      desktopOnly: true 
    },
    {
      id: "cart",
      icon: ShoppingBag,
      label: "Comprar",
      action: () => setIsDrawerOpen(true),
      badge: totalItems
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5 h-16 md:h-20"
          : "bg-transparent border-b border-white/0 h-16 md:h-24"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <button className="md:hidden p-2 text-white/90 hover:text-accent transition-colors">
            <Menu size={20} />
          </button>

          <nav className="hidden md:flex items-center gap-12">
            <Link href="/collections/jackets" className="text-[10px] uppercase font-bold tracking-luxury text-white/80 hover:text-accent hover:underline transition-all duration-300">
              Jackets
            </Link>
            <Link href="/collections/silent-warmth" className="text-[10px] uppercase font-bold tracking-luxury text-white/80 hover:text-accent hover:underline   transition-all duration-300">
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

          <div className="flex items-center gap-1 md:gap-4">
            {icons.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onMouseEnter={() => setHoveredIcon(item.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  onClick={item.action}
                  className={`flex items-center gap-2 p-2 rounded-full transition-all duration-300 ${item.desktopOnly ? "hidden md:flex" : "flex"
                    } ${hoveredIcon === item.id ? "bg-white/5 text-white" : "text-white/80"}`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={1.5} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-black text-[8px] font-black rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {hoveredIcon === item.id && (
                      <motion.span
                        initial={{ width: 0, opacity: 0, x: -5 }}
                        animate={{ width: "auto", opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: -5 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="overflow-hidden whitespace-nowrap text-[10px] font-black uppercase tracking-widest"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </header>
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
