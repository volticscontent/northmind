import { getProductByHandle, getProducts } from "@/lib/data-loader";
import { getReviews, canUserReview } from "@/lib/actions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour (ISR)

// ... generateMetadata and generateStaticParams remain unchanged ...
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    return {
      title: "Product Not Found | North Mind",
    };
  }

  return {
    title: `${product.title} | North Mind Premium Heritage`,
    description: `Shop the ${product.title} from North Mind. ${product.collection} crafted for durability and contemporary british style. Price: $${product.price}.`,
    openGraph: {
      title: `${product.title} | North Mind`,
      description: `Crafted for durability. Discover the ${product.title}.`,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.title,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: `Shop the ${product.title} at North Mind.`,
      images: [product.images[0]],
    }
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
  
  if (!product) {
    notFound();
  }

  const products = await getProducts();
  const allProducts = products.filter(p => p.handle !== params.handle);

  const [initialReviews, canReviewInitially] = await Promise.all([
    getReviews(product.id),
    canUserReview(product.id)
  ]);

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <ProductDetail 
        product={product} 
        allProducts={allProducts} 
        searchParams={searchParams} 
        initialReviews={initialReviews}
        canReviewInitially={canReviewInitially}
      />
      <Footer />
    </main>
  );
}
