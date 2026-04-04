import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ScrollingText } from "@/components/effects/mobile/ScrollingText";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Footer } from "@/components/Footer";
import { VideoSection } from "@/components/VideoSection";
import { getCollections, getProductsByCollection } from "@/lib/data-loader";

export const dynamic = "force-dynamic";

export default async function Home() {
  const collections = await getCollections();

  // Sort collections to put Fragrances/Fragrance first
  const sortedCollections = [...collections].sort((a, b) => {
    if (a.name.toLowerCase().includes('3x1 fragrances')) return -1;
    if (b.name.toLowerCase().includes('3x1 fragrances')) return 1;
    return 0;
  });

  // Fetch products for all collections
  const collectionsWithProducts = await Promise.all(
    sortedCollections.map(async (c) => {
      const products = await getProductsByCollection(c.name);
      return { ...c, products };
    })
  );

  return (
    <main className="min-h-screen bg-black" suppressHydrationWarning>
      <Header />
      <Hero />
      <ScrollingText />

      <div id="collections" className="space-y-0">
        {collectionsWithProducts.map((c, index) => (
          <div key={c.handle}>
            <ProductCarousel
              title={c.name}
              collection={c.name}
              products={c.products}
            />
          </div>
        ))}

        <VideoSection collections={collections} />

        {/* If no collections found, show a fallback space */}
        {collectionsWithProducts.length === 0 && (
          <div className="py-20 text-center text-white/20 uppercase tracking-luxury">
            Discovering our heritage...
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
