import { API_URL } from "@/lib/api";

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
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/products/handle/${handle}`, { cache: "no-store" });
    if (!res.ok) return undefined;
    return res.json();
  } catch {
    return undefined;
  }
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products/collection/${collection}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCollections() {
  try {
    const res = await fetch(`${API_URL}/api/products/collections`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
