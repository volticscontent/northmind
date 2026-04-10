import { getProductsByCollection } from "@/lib/data-loader";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.collection).replace(/-/g, " ");

  return {
    title: `${decodedName.toUpperCase()} Collection | North Mind`,
    description: `Explore our premium ${decodedName} collection. British heritage craftsmanship for the modern man.`,
  };
}

interface PageProps {
  params: {
    collection: string;
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.collection).replace(/-/g, " ");
  const products = await getProductsByCollection(decodedName);

  return (
    <>
      <div className="min-h-screen bg-[#000000] text-white">
        <div className="max-w-[1400px] mx-auto pt-10 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <nav className="text-[11px] uppercase tracking-widest text-white mb-6 flex items-center gap-3">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={10} />
              <span className="text-accent font-bold">
                {decodedName}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                {decodedName}
              </h1>
              <p className="text-[13px] font-medium text-accent uppercase tracking-widest">
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-gray-200 rounded-2xl">
              <h3 className="text-xl font-bold text-white">
                No products available.
              </h3>
              <p className="text-[#868A91] mt-2 text-sm">
                We couldn't match any products to the collection "{decodedName}".
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex h-10 items-center justify-center bg-[#111827] text-white px-6 text-[11px] uppercase font-bold tracking-widest hover:bg-black transition-colors"
              >
                Return Home
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
