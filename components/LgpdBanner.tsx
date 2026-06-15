"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function LgpdBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("nm_cookie_consent")) setVisible(true);
  }, []);

  const accept = (type: "all" | "essential") => {
    localStorage.setItem("nm_cookie_consent", type);
    window.dispatchEvent(new CustomEvent("nm_consent_changed", { detail: type }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9000] border-t border-white/10 bg-[#070707]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4 flex-1">
          <div className="size-8 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
              Privacidade & Cookies
            </p>
            <p className="text-[11px] text-white/40 leading-relaxed max-w-xl">
              Utilizamos cookies e tecnologias de rastreamento para personalizar sua experiência e
              mensurar o desempenho das nossas campanhas. Ao continuar, você concorda com nossa{" "}
              <Link
                href="/privacidade"
                className="text-white/60 underline underline-offset-2 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              {" "}em conformidade com a LGPD.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => accept("essential")}
            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all"
          >
            Apenas essenciais
          </button>
          <button
            onClick={() => accept("all")}
            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-black bg-white rounded-full hover:bg-white/90 transition-all"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
