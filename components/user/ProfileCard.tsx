"use client";

import { useState } from "react";
import { User as UserIcon, Package, Calendar } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileCardProps {
  user: {
    name: string | null;
    email: string;
    telefone: string | null;
    localizacao: string | null;
    dataDeEntrada: Date;
    pedidos: any[];
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/20 flex-shrink-0">
          <UserIcon size={32} className="text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{user.name || "Sem Nome"}</h3>
          <p className="text-sm text-white/40 font-light truncate">{user.email}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-white/20" />
            <span className="text-xs font-medium text-white/60">Total Orders</span>
          </div>
          <span className="font-black text-sm">{user.pedidos.length}</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-white/20" />
            <span className="text-xs font-medium text-white/60">Member Since</span>
          </div>
          <span className="font-black text-sm">{new Date(user.dataDeEntrada).getFullYear()}</span>
        </div>
      </div>

      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="w-full mt-8 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
      >
        Edit Profile
      </button>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
      />
    </div>
  );
}
