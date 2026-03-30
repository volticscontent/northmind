import productsData from "@/data/products.json";

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  originalPrice: number;
  collection: string;
  description: string;
  images: string[];
}

export interface Collection {
  name: string;
  handle: string;
}

export async function getProducts(): Promise<Product[]> {
  return productsData.products as Product[];
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  return productsData.products.find((p) => p.handle === handle) as Product | undefined;
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  return productsData.products.filter(
    (p) => p.collection.toLowerCase() === collection.toLowerCase()
  ) as Product[];
}
