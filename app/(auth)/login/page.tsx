"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (session?.status === "authenticated") {
      const userType = (session?.data?.user as any)?.type;
      if (userType === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    }
  }, [session?.status, router, session?.data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        ...formData,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      }
      // O useEffect do session vai cuidar do redirect correto
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-10 group">
            <h1 className="text-2xl font-black uppercase tracking-[0.25em] text-white group-hover:text-accent transition-colors duration-500">
              North <span className="text-accent group-hover:text-white transition-colors duration-500">Mind</span>
            </h1>
          </Link>
          <h2 className="text-3xl font-light text-white mb-3">Welcome Back</h2>
          <p className="text-white/40 font-light text-sm">Enter your credentials to access your heritage.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block ml-1">Email</label>
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block">Password</label>
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-accent/60 hover:text-accent transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-accent transition-all duration-300 disabled:opacity-50 group shadow-xl active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
              <>
                Confirm Identity
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-white/40 text-[11px] font-medium tracking-wide uppercase">
            Not part of the heritage yet?{" "}
            <Link href="/register" className="text-white hover:text-accent transition-colors border-b border-white/20 hover:border-accent pb-0.5 ml-1">
              Join here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
