"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2, Calendar, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";

const countries = [
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    telefone: "",
    aniversario: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        pais: selectedCountry.name,
        telefone: `${selectedCountry.code} ${formData.telefone}`,
      };
      await axios.post(`${API_URL}/api/auth/register`, dataToSubmit);
      router.push("/login");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white">
              North <span className="text-accent">Mind</span>
            </h1>
          </Link>
          <h2 className="text-3xl font-light text-white mb-2">Create Account</h2>
          <p className="text-white/40 font-light text-sm">Enter your details to join the heritage.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="James Harrison"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="james@heritage.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Birthday</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  required
                  disabled={isLoading}
                  value={formData.aniversario}
                  onChange={(e) => setFormData({ ...formData, aniversario: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Phone</label>
              <div className="relative flex group">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowCountrySelector(!showCountrySelector)}
                  className="flex items-center gap-1.5 px-3 bg-white/5 border border-white/10 rounded-l-xl border-r-0 hover:bg-white/[0.08] transition-all"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <ChevronDown size={12} className={`text-white/20 transition-transform ${showCountrySelector ? 'rotate-180' : ''}`} />
                </button>
                <input
                  type="tel"
                  required
                  disabled={isLoading}
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-r-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
                />

                <AnimatePresence>
                  {showCountrySelector && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCountrySelector(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-black/90 border border-white/10 rounded-xl overflow-hidden z-50 backdrop-blur-md shadow-2xl"
                      >
                        <div className="max-h-60 overflow-y-auto scrollbar-hide py-2">
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setShowCountrySelector(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-accent hover:text-black transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{c.flag}</span>
                                <span className="text-xs font-bold">{c.name}</span>
                              </div>
                              <span className="text-[10px] opacity-50 font-mono">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all duration-300 disabled:opacity-50 group shadow-xl active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
              <>
                Register Account
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-8">
          <p className="text-white/40 text-xs font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold hover:text-accent transition-colors underline underline-offset-4 decoration-white/10">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
