import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ScrollingText } from "@/components/effects/mobile/ScrollingText";
import { CollectionSection } from "@/components/CollectionSection";
import { Footer } from "@/components/Footer";
import { VideoSection } from "@/components/VideoSection";
import { getCollections } from "@/lib/data-loader";

export default async function Home() {
  const collections = await getCollections();

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
        <VideoSection collections={collections} />
        <CollectionSection
          title="Silent Warmth"
          collection="Silent Warmth"
        />
      </div>

      <Footer />
    </main>
  );
}
