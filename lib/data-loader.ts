import { API_URL } from "@/lib/api";
import {
  applyFragranceOverride,
  FragrancePriceTier,
} from "@/lib/fragrance-overrides";

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  originalPrice: number;
  collection: string;
  description: string;
  images: string[];
  publicado: boolean;
  opcoesTamanho: string[];
  opcoesCor?: { name: string; hex: string; image?: string; fotos?: string[] }[];
  highlights?: { icon: string; title: string; text: string }[];
  mediaAvaliacoes?: number;
  totalAvaliacoes?: number;
  videos: string[];
  materiais?: { item: string; percentage: string }[];
  guiaTamanho?: any;
  detalhesModelo?: string;
  instrucoesCuidado?: string;
  especificacoes?: string[];
  variantes?: any[];
  tipo: "ROUPA" | "PERFUME";
  tags?: string[];
  priceTier?: FragrancePriceTier;
}

export interface Collection {
  id: string;
  name: string;
  handle: string;
  description?: string;
  image?: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const products = await res.json();
    return normalizeProducts(products);
  } catch {
    return [];
  }
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/products/handle/${handle}`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const product = await res.json();
    return normalizeProduct(product);
  } catch {
    return undefined;
  }
}

export async function getProductsByCollection(
  collection: string,
): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/products/collection/${collection}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const products = await res.json();
    return normalizeProducts(products);
  } catch {
    return [];
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${API_URL}/api/collections`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`getCollections failed with status: ${res.status}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("getCollections fetch error:", error);
    return [];
  }
}

// Returns the collection if found, null if API worked but collection was not found, undefined on API error
export async function getCollectionByHandle(
  handle: string,
): Promise<Collection | null | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/collections`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const collections: Collection[] = await res.json();
    const found = collections.find((c) => c.handle === handle);
    return found ?? null;
  } catch {
    return undefined;
  }
}

function normalizeProducts(products: unknown): Product[] {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map(normalizeProduct);
}

function normalizeProduct(product: any): Product {
  const normalized: Product = {
    ...product,
    price: Number(product?.price ?? 0),
    originalPrice: Number(product?.originalPrice ?? 0),
    images: Array.isArray(product?.images) ? product.images : [],
    videos: Array.isArray(product?.videos) ? product.videos : [],
    opcoesTamanho: Array.isArray(product?.opcoesTamanho)
      ? product.opcoesTamanho
      : [],
    tags: Array.isArray(product?.tags) ? product.tags : [],
    tipo: product?.tipo === "PERFUME" ? "PERFUME" : "ROUPA",
  };

  return applyFragranceOverride(normalized);
}
