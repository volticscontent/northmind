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
            Established in 2026, North Mind was born from the ambition to merge classic British tailoring with the technical functionality required for the modern man. Our essence lies in the concept of &quot;Silent Luxury&quot; — pieces that don&apos;t need to shout to be noticed.
          </p>
          <div className="py-12">
            <div className="premium-border p-8 bg-card/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
              <h3 className="text-accent text-xs font-black uppercase tracking-luxury mb-4">Meticulous Craftsmanship</h3>
              <p className="text-sm md:text-base italic">
                &quot;Every piece is conceived to last generations, not just seasons. We utilize ethically sourced materials and ancestral British Heritage techniques.&quot;
              </p>
            </div>
          </div>
          <p>
            From the selection of the finest wools to state-of-the-art thermal insulation down, every detail is a tribute to durability and timeless design. North Mind is not just a clothing brand; it is a manifesto of quiet sophistication for those who value substance above spectacle.
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
