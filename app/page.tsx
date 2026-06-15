import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getCollections, getProductsByCollection } from "@/lib/data-loader";

// Lazy loading components below the fold
const ProductCarousel = dynamic(() => import("@/components/product/ProductCarousel").then(mod => mod.ProductCarousel), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: true });
const ScrollingText = dynamic(() => import("@/components/effects/mobile/ScrollingText").then(mod => mod.ScrollingText), { ssr: true });

export const revalidate = 3600; // Cache de 1 hora para a home

async function HomeCollections() {
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

  if (collectionsWithProducts.length === 0) {
    return (
      <div className="py-20 text-center text-white/20 uppercase tracking-luxury">
        Discovering our heritage...
      </div>
    );
  }

  return (
    <>
      {collectionsWithProducts.map((c, index) => (
        <div key={c.handle}>
          <ProductCarousel
            title={c.name}
            collection={c.name}
            products={c.products}
          />
        </div>
      ))}
    </>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="py-24 space-y-12">
      <div className="text-center space-y-4">
        <div className="h-4 bg-white/5 w-48 mx-auto rounded animate-pulse" />
        <div className="h-8 bg-white/10 w-64 mx-auto rounded animate-pulse" />
      </div>
      <div className="flex gap-4 px-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black" suppressHydrationWarning>
      <Header />
      <Hero />
      <ScrollingText />

      <div id="collections" className="space-y-0">
        <Suspense fallback={<CollectionsSkeleton />}>
          <HomeCollections />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
