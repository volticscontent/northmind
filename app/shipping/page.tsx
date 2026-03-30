import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ShippingPage() {
  const policies = [
    {
      title: "Premium Logistics",
      content: "Oferecemos envio prioritário global para todas as encomendas. Cada item é embalado em caixas personalizadas de luxo para garantir a integridade da peça e o prazer desembalar."
    },
    {
      title: "Returns & Exchanges",
      content: "Aceitamos devoluções e trocas num prazo de 14 dias após a entrega. Apenas itens em estado imaculado, com todas as etiquetas e fatura original, podem ser processados. Os custos de retorno são responsabilidade do cliente, a menos que o produto apresente defeito de fabricação."
    },
    {
      title: "Silent Support",
      content: "Nossa equipe de concierge está disponível para auxiliar com tamanhos e dúvidas de logística via support@northmind.store."
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto space-y-16 animate-fade-in">
        <section className="text-center space-y-8">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-accent">Policy Protocol</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            Shipping & <br />
            <span className="gold-stroke">Returns</span>
          </h1>
        </section>

        <section className="space-y-12">
          {policies.map((policy, index) => (
            <div key={index} className="premium-border p-10 bg-card/30 relative group transition-all duration-700 hover:bg-card/50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-accent/10 transition-colors" />
              <h2 className="text-accent text-xs font-black uppercase tracking-luxury mb-4 italic">{policy.title}</h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed tracking-wide font-medium">
                {policy.content}
              </p>
            </div>
          ))}
        </section>

        <div className="pt-12 text-center">
            <p className="text-[9px] uppercase font-bold tracking-widest text-white/20">
              Free Premium Shipping on orders over £200. Established 2026.
            </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
