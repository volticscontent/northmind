import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FAQPage() {
  const faqs = [
    { q: "What is your heritage?", a: "North Mind was established in 2026 to bring British craftsmanship to the modern man." },
    { q: "Do you ship internationally?", a: "Yes, we offer premium global shipping to all major destinations." },
    { q: "How do I care for my jacket?", a: "We recommend professional dry cleaning for all our down and wool products." }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto space-y-16 animate-fade-in">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white text-center">Protocol <span className="gold-stroke">FAQ</span></h1>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="premium-border p-8 bg-card/30">
              <h3 className="text-accent text-xs font-black uppercase tracking-luxury mb-4">{faq.q}</h3>
              <p className="text-white/60 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
