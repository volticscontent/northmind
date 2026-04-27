"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, User, Search, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { SearchPopup } from "./SearchPopup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const mobileNavLinks = [
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Silent Warmth", href: "/collections/silent-warmth" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Shipping", href: "/shipping" },
];

export function Header() {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const icons = [
    { id: "search", icon: Search, label: "Search", action: () => setIsSearchOpen(true) },
    {
      id: "auth",
      icon: User,
      label: status === "authenticated" ? (session?.user?.name?.split(" ")[0] || "Account") : "Login",
      action: () => router.push(status === "authenticated" ? "/user" : "/login"),
      desktopOnly: true
    },
    {
      id: "cart",
      icon: ShoppingBag,
      label: "Basket",
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
          {/* Mobile Menu Button - 44px minimum touch target */}
          <button
            className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-white/90 hover:text-accent active:text-accent/70 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            <Link href="/collections/outerwear" className="text-[10px] uppercase font-bold tracking-luxury text-white/80 hover:text-accent hover:underline transition-all duration-300">
              Outerwear
            </Link>
            <Link href="/collections/silent-warmth" className="text-[10px] uppercase font-bold tracking-luxury text-white/80 hover:text-accent hover:underline transition-all duration-300">
              Silent Warmth
            </Link>
          </nav>

          {/* Logo */}
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

          {/* Icon Buttons - 44px minimum touch targets */}
          <div className="flex items-center gap-2 md:gap-4">
            {icons.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onMouseEnter={() => setHoveredIcon(item.id)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  onClick={item.action}
                  aria-label={item.label}
                  className={`flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center rounded-full px-4 transition-all duration-300 ${item.desktopOnly ? "hidden md:flex" : "flex"
                    } ${hoveredIcon === item.id ? "bg-white/5 text-white" : "text-white/80"}`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={1.5} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black text-[8px] font-black rounded-full flex items-center justify-center">
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
                        className="overflow-hidden whitespace-nowrap text-[10px] font-black uppercase tracking-widest hidden md:inline"
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

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[85vw] max-w-[360px] bg-[#0a0a09] border-r border-white/5 flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Image
                  src="/assets/logo.svg"
                  alt="NORTH MIND"
                  width={120}
                  height={40}
                  className="h-6 w-auto invert brightness-0"
                />
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                  className="flex items-center justify-center min-h-[44px] min-w-[44px] text-white/60 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-grow overflow-y-auto py-4">
                {mobileNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all min-h-[52px]"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} className="text-white/20" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer - Login/Profile */}
              <div className="p-6 border-t border-white/5 space-y-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
                <Link
                  href={status === "authenticated" ? "/customer" : "/login"}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all min-h-[52px]"
                >
                  <User size={20} className="text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">
                    {status === "authenticated" ? (session?.user?.name?.split(" ")[0] || "Profile") : "Sign In"}
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
