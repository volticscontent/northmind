import { Product } from "@/lib/data-loader";
import { ProductCard } from "@/components/ProductCard";

interface CollectionProductsClientProps {
  products: Product[];
}

export function CollectionProductsClient({
  products,
}: CollectionProductsClientProps) {
  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
