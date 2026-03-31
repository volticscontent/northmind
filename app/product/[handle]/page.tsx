import { getProductByHandle, getProducts } from "@/lib/data-loader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);
  const products = await getProducts();
  const allProducts = products.filter(p => p.handle !== params.handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <ProductDetail product={product} allProducts={allProducts} />
      <Footer />
    </main>
  );
}
