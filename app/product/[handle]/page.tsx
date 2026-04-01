import { getProductByHandle, getProducts } from "@/lib/data-loader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    return {
      title: "Product Not Found | North Mind",
    };
  }

  return {
    title: `${product.title} | North Mind Premium Heritage`,
    description: `Shop the ${product.title} from North Mind. ${product.collection} crafted for durability and contemporary british style.`,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ 
  params,
  searchParams 
}: { 
  params: { handle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const product = await getProductByHandle(params.handle);
  const products = await getProducts();
  const allProducts = products.filter(p => p.handle !== params.handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <ProductDetail 
        product={product} 
        allProducts={allProducts} 
        searchParams={searchParams} 
      />
      <Footer />
    </main>
  );
}
