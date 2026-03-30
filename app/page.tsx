import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ScrollingText } from "@/components/ScrollingText";
import { CollectionSection } from "@/components/CollectionSection";
import { Footer } from "@/components/Footer";

import { VideoSection } from "@/components/VideoSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <ScrollingText />
      
      <div id="collections" className="space-y-0">
        <CollectionSection 
          title="The North Mind Jacket's News" 
          collection="Jackets" 
        />
        
        <VideoSection />

        <CollectionSection 
          title="Silent Warmth" 
          collection="Silent Warmth" 
        />
      </div>

      <Footer />
    </main>
  );
}
