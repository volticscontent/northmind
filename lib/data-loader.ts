import { cache } from "react";
import prisma from "@/lib/prisma";

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  originalPrice: number;
  collection: string;
  description: string;
  images: string[];
  fotoPrincipal?: string;
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
}

export interface Collection {
  id: string;
  name: string;
  handle: string;
  description?: string;
  image?: string;
  publicado: boolean;
}

const mapProduct = (p: any): Product => ({
  id: p.id,
  handle: p.handle,
  title: p.nome,
  description: p.descricao,
  price: Number(p.preco) || 0,
  originalPrice: Number(p.precoOriginal) || 0,
  collection: p.collection,
  fotoPrincipal: p.fotoPrincipal || (p.fotos && p.fotos.length > 0 ? p.fotos[0] : undefined),
  images: p.fotos || [],
  videos: p.videos || [],
  totalAvaliacoes: Number(p.totalAvaliacoes) || 0,
  mediaAvaliacoes: Number(p.mediaAvaliacoes) || 5.0,
  opcoesTamanho: p.opcoesTamanho || [],
  opcoesCor: p.opcoesCor || [],
  highlights: p.highlights || [],
  materiais: p.materiais || [],
  guiaTamanho: p.guiaTamanho || null,
  detalhesModelo: p.detalhesModelo || undefined,
  instrucoesCuidado: p.instrucoesCuidado || undefined,
  especificacoes: p.especificacoes || [],
  variantes: p.variantes || [],
  publicado: p.publicado,
  tipo: p.tipo as any || "ROUPA"
});

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await prisma.produto.findMany({
      where: { publicado: true },
      orderBy: { createdAt: "desc" },
    });
    return products.map(mapProduct);
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
});

export const getProductByHandle = cache(async (handle: string): Promise<Product | undefined> => {
  try {
    const p = await prisma.produto.findUnique({
      where: { handle },
    });
    if (!p || !p.publicado) return undefined;
    return mapProduct(p);
  } catch (error) {
    console.error("getProductByHandle error:", error);
    return undefined;
  }
});

export const getProductsByCollection = cache(async (collection: string): Promise<Product[]> => {
  try {
    const products = await prisma.produto.findMany({
      where: {
        publicado: true,
        collection: {
          equals: collection,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return products.map(mapProduct);
  } catch (error) {
    console.error("getProductsByCollection error:", error);
    return [];
  }
});

export const getCollections = cache(async (): Promise<Collection[]> => {
  try {
    const collections = await prisma.collection.findMany({
      where: { publicado: true },
      orderBy: { createdAt: "asc" },
    });
    return collections.map((c: any) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      description: c.description || undefined,
      image: c.image || undefined,
      publicado: c.publicado,
    }));
  } catch (error) {
    console.error("getCollections error:", error);
    return [];
  }
});

export const getCollectionByHandle = cache(async (handle: string): Promise<Collection | null | undefined> => {
  try {
    const c = await prisma.collection.findUnique({
      where: { handle },
    });
    if (!c || !c.publicado) return null;
    return {
      id: c.id,
      name: c.name,
      handle: c.handle,
      description: c.description || undefined,
      image: c.image || undefined,
      publicado: c.publicado,
    };
  } catch (error) {
    console.error("getCollectionByHandle error:", error);
    return undefined;
  }
});
