"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("admin-credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push("/admin");
    }
  };

  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white text-center mb-1">Admin Access</h2>
      <p className="text-white/40 text-center mb-8 text-sm">Enter your credentials to manage the store.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-white/50 block mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              placeholder="admin@northmind.co"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-white/50 block mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
