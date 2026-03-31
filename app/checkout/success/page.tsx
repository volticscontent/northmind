import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SetPasswordForm } from "@/components/SetPasswordForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { u?: string; o?: string; payment_intent?: string };
}) {
  const userId = searchParams.u;
  const orderId = searchParams.o;

  if (!userId || !orderId) {
    redirect("/");
  }

  // Verificar pedido e usuário via Backend API
  const res = await fetch(`${API_URL}/api/admin/verify-order/${orderId}/${userId}`, { cache: "no-store" });
  
  if (!res.ok) {
    redirect("/");
  }

  const { email, hasPassword } = await res.json();

  if (!email) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* Ícone Sucesso */}
        <div className="size-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Check size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-white text-center mb-4">
          Pedido Confirmado
        </h1>

        <p className="text-white/60 text-center mb-8 font-light text-sm max-w-sm">
          Sua compra foi processada com sucesso. O recibo e detalhes do código de rastreamento serão enviados para <strong className="text-white">{email}</strong>.
        </p>

        {/* Lógica de Hashing / Claim */}
        {!hasPassword ? (
          <SetPasswordForm 
            userId={userId} 
            orderId={orderId} 
            email={email} 
          />
        ) : (
          <Link
            href="/customer"
            className="bg-white text-black font-black uppercase tracking-widest text-xs py-5 px-10 rounded-xl flex items-center justify-center gap-3 hover:bg-accent transition-all duration-300 shadow-xl"
          >
            Acessar Meus Pedidos
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
