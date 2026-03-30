import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto space-y-16 animate-fade-in">
        <section className="text-center space-y-8">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-accent">Our Legacy</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            The North Mind <br />
            <span className="gold-stroke">Heritage</span>
          </h1>
        </section>

        <section className="prose prose-invert prose-lg mx-auto text-white/60 font-medium tracking-wide leading-relaxed">
          <p>
            Fundada em 2026, a North Mind nasceu da ambição de fundir a alfaiataria clássica britânica com a funcionalidade técnica necessária para o homem moderno. Nossa essência reside no conceito de "Silent Luxury" — peças que não precisam gritar para serem notadas.
          </p>
          <div className="py-12">
            <div className="premium-border p-8 bg-card/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
              <h3 className="text-accent text-xs font-black uppercase tracking-luxury mb-4">Meticulous Craftsmanship</h3>
              <p className="text-sm md:text-base italic">
                "Cada peça é concebida para durar gerações, não apenas temporadas. Utilizamos materiais de origem ética e técnicas ancestrais de British Heritage."
              </p>
            </div>
          </div>
          <p>
            Da seleção das lãs mais finas às penugens de isolamento térmico de última geração, cada detalhe é uma homenagem à durabilidade e ao design atemporal. A North Mind não é apenas uma marca de roupas; é um manifesto de sofisticação silenciosa para aqueles que valorizam a substância acima do espetáculo.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          <div className="aspect-square bg-card premium-border overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover grayscale opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-700" 
            />
          </div>
          <div className="aspect-square bg-card premium-border overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800" 
              alt="Materials" 
              className="w-full h-full object-cover grayscale opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-700" 
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
