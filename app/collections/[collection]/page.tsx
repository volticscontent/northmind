import { getProductsByCollection } from "@/lib/data-loader";
import { CollectionProductCard } from "@/components/CollectionProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: {
    collection: string;
  };
}

export default async function CollectionPage({ params }: PageProps) {
  // A string original gerada no CollectionSection foi url-encoded e com os espaços substituídos por hífens.
  // Revertendo a lógica: decoding URL + hífens para espaços.
  const decodedName = decodeURIComponent(params.collection).replace(/-/g, " ");
  
  // O data-loader compara convertendo ambos os lados para minúsculas
  const products = await getProductsByCollection(decodedName);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Container global da nova página clara */}
      <div className="max-w-[1400px] mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho e Navegação */}
        <div className="mb-14">
          <nav className="text-[11px] uppercase tracking-widest text-[#868A91] mb-6 flex items-center gap-3">
            <Link href="/" className="hover:text-[#111827] transition-colors">
              Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-[#111827] font-bold">
              {decodedName}
            </span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111827]">
              {decodedName}
            </h1>
            <p className="text-[13px] font-medium text-[#868A91] uppercase tracking-widest">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </p>
          </div>
        </div>

        {/* Grid de Produtos Baseado na Referência */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <CollectionProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-gray-200 rounded-2xl">
            <h3 className="text-xl font-bold text-[#111827]">
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
