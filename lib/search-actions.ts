"use server";

import prisma from "@/lib/prisma";

export async function fetchAllForSearch() {
  try {
    const [products, collections] = await Promise.all([
      prisma.produto.findMany({
        where: { publicado: true },
        select: {
          id: true,
          handle: true,
          nome: true,
          preco: true,
          precoOriginal: true,
          collection: true,
          fotos: true,
          fotoPrincipal: true,
        }
      }),
      prisma.collection.findMany({
        where: { publicado: true },
        select: {
          id: true,
          handle: true,
          name: true,
        }
      })
    ]);

    // Formatar products para o padrão esperado pelo SearchPopup
    const formattedProducts = products.map(p => ({
      id: p.id,
      handle: p.handle,
      title: p.nome,
      price: Number(p.preco) || 0,
      originalPrice: Number(p.precoOriginal) || 0,
      collection: p.collection,
      images: p.fotos || (p.fotoPrincipal ? [p.fotoPrincipal] : []),
    }));

    return {
      products: formattedProducts,
      collections
    };
  } catch (error) {
    console.error("Search fetch error:", error);
    return { products: [], collections: [] };
  }
}
