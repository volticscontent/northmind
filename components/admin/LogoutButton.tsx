"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-500/10 transition-all text-xs font-bold uppercase tracking-widest text-rose-500/60 hover:text-rose-500"
    >
      <LogOut size={16} />
      Sair do Painel
    </button>
  );
}
