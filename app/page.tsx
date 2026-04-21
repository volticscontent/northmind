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

  // Sort collections to put Fragrance Sets at the bottom
  // Sort collections: regular collections first, then 'Fragrances', then 'Fragrance Sets'
  const sortedCollections = [...collections].sort((a, b) => {
    const bottomOrder = ["fragrances", "fragrance sets"];
    const indexA = bottomOrder.indexOf(a.name.toLowerCase());
    const indexB = bottomOrder.indexOf(b.name.toLowerCase());

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return 1;
    if (indexB !== -1) return -1;
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
