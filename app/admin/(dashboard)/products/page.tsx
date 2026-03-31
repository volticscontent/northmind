import { ProductManager } from "@/components/admin/ProductManager";
import { getProducts } from "@/lib/actions";

export default async function AdminProducts() {
  const products = await getProducts();

  return <ProductManager initialProducts={products} />;
}
