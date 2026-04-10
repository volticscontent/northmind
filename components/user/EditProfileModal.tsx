"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, MapPin, Loader2 } from "lucide-react";
import { updateUserProfile } from "@/lib/actions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    telefone: string | null;
    localizacao: string | null;
  };
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    telefone: user.telefone || "",
    localizacao: user.localizacao || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await updateUserProfile(formData);
      onClose(); // Fechar o modal em caso de sucesso
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Escuro / Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Elemento de background */}
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-light">Edit <span className="font-bold">Profile</span></h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center relative z-10">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              {/* NOME COMPLETO */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-accent transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent/40 focus:bg-white/[0.08] transition-all outline-none"
                    placeholder="Your legal name"
                  />
                </div>
              </div>

              {/* TELEFONE */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-accent transition-colors">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent/40 focus:bg-white/[0.08] transition-all outline-none"
                    placeholder="+44 20 7946 0958"
                  />
                </div>
              </div>

              {/* LOCALIZAÇÃO */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Location / Address</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-accent transition-colors">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-accent/40 focus:bg-white/[0.08] transition-all outline-none"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-white text-black font-black uppercase tracking-widest text-[10px] p-4 rounded-xl hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
