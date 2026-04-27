"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export function SetPasswordForm({ userId, orderId, email }: { userId: string, orderId: string, email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, orderId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password.");
      }

      // Password set successfully, log in!
      setIsSuccess(true);
      
      const loginResult = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Password created, but auto-login failed. Please sign in manually.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        router.push("/user");
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-4">
        <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black uppercase text-white">Account Created</h3>
        <p className="text-white/60 font-light text-sm">Transferring you to your secure dashboard...</p>
        <Loader2 className="animate-spin text-accent mt-4" size={24} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mt-8 border border-white/10 p-6 rounded-2xl bg-[#0a0a0a] shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="mb-6 relative z-10 text-center">
        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Secure Your Account</h3>
        <p className="text-white/40 text-[11px] font-medium tracking-wide">
          Attach a permanent password to the email <br />
          <strong className="text-accent">{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within/input:text-accent transition-colors">
            <Lock size={16} />
          </div>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            placeholder="New secret password..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent/40 focus:bg-white/5 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
            <>
              Confirm Password
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
