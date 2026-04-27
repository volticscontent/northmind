import { Product, getProductsByCollection } from "@/lib/data-loader";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

interface CollectionSectionProps {
  title: string;
  collection: string;
}

export async function CollectionSection({
  title,
  collection,
}: CollectionSectionProps) {
  const products = await getProductsByCollection(collection);

  return (
    <section id={collection} className="py-16 px-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">
          {title}
        </h2>
        <div className="h-[1px] flex-grow mx-8 bg-white/10 hidden md:block" />
        <Link
          href={`/collections/${encodeURIComponent(collection.toLowerCase().replace(/ /g, "-"))}`}
          className="shrink-0"
        >
          <span className="text-[14px] cursor-pointer hover:text-white/100 uppercase font-bold tracking-[0.3em] text-white/90 transition-colors whitespace-nowrap">
            View all
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
