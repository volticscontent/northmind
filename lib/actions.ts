"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import Stripe from "stripe";

/**
 * REVIEWS ACTIONS
 */

export async function getReviews(produtoId: string) {
  try {
    const reviews = await prisma.comentario.findMany({
      where: { produtoId },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("GET_REVIEWS_ERROR", error);
    return [];
  }
}

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const orders = await prisma.pedido.findMany({
    orderBy: { dataCompra: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const allProductIds = Array.from(new Set(orders.flatMap((o) => o.produtosIds)));
  const products = allProductIds.length
    ? await prisma.produto.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, nome: true, fotoPrincipal: true },
      })
    : [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  return orders.map((o: any) => ({
    ...o,
    dataCompra: o.dataCompra?.toISOString() || null,
    dataEntrega: o.dataEntrega?.toISOString() || null,
    produtos: o.produtosIds
      .map((id: string) => productMap.get(id))
      .filter(Boolean) as { id: string; nome: string; fotoPrincipal: string | null }[],
  }));
}

export async function canUserReview(produtoId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { pedidos: true },
    });
    if (!user) return false;

    const hasPurchased = user.pedidos.some(
      (p) =>
        (p.status === "PAGO" || p.status === "ENTREGUE" || p.status === "PAID") &&
        p.produtosIds.includes(produtoId)
    );
    return hasPurchased;
  } catch {
    return false;
  }
}

async function updateProductRating(produtoId: string) {
  const reviews = await prisma.comentario.findMany({
    where: { produtoId },
    select: { rating: true },
  });

  const totalAvaliacoes = reviews.length;
  const mediaAvaliacoes = totalAvaliacoes > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalAvaliacoes
    : 5.0;

  await prisma.produto.update({
    where: { id: produtoId },
    data: {
      totalAvaliacoes,
      mediaAvaliacoes,
    },
  });
}

export async function addReview(data: {
  produtoId: string;
  rating: number;
  texto: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const review = await prisma.comentario.create({
    data: {
      userId: user.id,
      userName: user.name,
      produtoId: data.produtoId,
      rating: data.rating,
      texto: data.texto,
      fotos: [],
      videoUrl: null,
    },
  });

  await updateProductRating(data.produtoId);

  revalidatePath(`/product/[handle]`, "page");
  return review;
}

/**
 * ADMIN ACTIONS
 */

export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const [totalOrders, totalUsers, orders] = await Promise.all([
    prisma.pedido.count(),
    prisma.user.count(),
    prisma.pedido.findMany({
      orderBy: { dataCompra: "desc" },
      include: { user: { select: { name: true, email: true } } },
      take: 100, // get some recent orders
    })
  ]);

  const totalRevenue = orders
    .filter((o) => ["PAGO", "ENVIADO", "ENTREGUE"].includes(o.status))
    .reduce((acc, order) => acc + (order.totalAmmount || 0), 0);

  const formattedOrders = orders.map((o: any) => ({
    ...o,
    dataCompra: o.dataCompra?.toISOString() || null,
    dataEntrega: o.dataEntrega?.toISOString() || null,
  }));

  return {
    totalOrders,
    totalUsers,
    totalRevenue,
    recentOrders: formattedOrders.slice(0, 5),
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await prisma.pedido.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/orders");
}

export async function upsertProduct(data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const { id, nome, handle, descricao, preco, precoOriginal, collection, fotoPrincipal, fotos, videos, opcoesTamanho, opcoesCor, variantes, tipo, highlights, materiais, guiaTamanho, detalhesModelo, instrucoesCuidado, especificacoes } = data;
  
  const handleFormatado = handle || nome?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const dbData = {
    nome,
    handle: handleFormatado,
    descricao,
    preco: Number(preco),
    precoOriginal: Number(precoOriginal),
    collection,
    fotoPrincipal,
    fotos,
    videos,
    opcoesTamanho,
    opcoesCor,
    variantes,
    highlights,
    materiais,
    guiaTamanho,
    detalhesModelo,
    instrucoesCuidado,
    especificacoes,
    tipo: tipo || "ROUPA"
  };

  if (id) {
    await prisma.produto.update({ 
      where: { id }, 
      data: dbData
    });
  } else {
    await prisma.produto.create({ 
      data: dbData
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await prisma.produto.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getProducts() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const products = await prisma.produto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function getCollections() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
  });
  return collections;
}

export async function upsertCollection(data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const handleFormatado = data.handle || data.name?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  if (data.id) {
    await prisma.collection.update({
      where: { id: data.id },
      data: {
        name: data.name,
        handle: handleFormatado,
        description: data.description,
        image: data.image,
      }
    });
  } else {
    await prisma.collection.create({
      data: {
        name: data.name,
        handle: handleFormatado,
        description: data.description,
        image: data.image,
      }
    });
  }

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCollection(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await prisma.collection.delete({ where: { id } });

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function setCollectionStatus(collectionName: string, publicado: boolean) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await prisma.produto.updateMany({
    where: { collection: collectionName },
    data: { publicado },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function setCollectionDraft(id: string, publicado: boolean) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await prisma.collection.update({
    where: { id },
    data: { publicado },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
}

export async function getStoreSettings() {
  try {
    return await (prisma as any).storeSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
  } catch {
    return null;
  }
}

export async function saveStoreSettings(data: {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleTagId?: string | null;
  utmifyPixelId?: string | null;
  utmifyMetaApiKey?: string | null;
  utmifyTiktokApiKey?: string | null;
  utmifyGoogleApiKey?: string | null;
  gbpToBrlRate?: number;
  trackingMode?: string;
}) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  await (prisma as any).storeSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/admin/settings");
  revalidateTag("store-settings");
}

export async function syncGbpToBrlRate(): Promise<number> {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
  });

  // Stripe provides rates relative to USD — derive GBP→BRL cross-rate
  const { rates } = await stripe.exchangeRates.retrieve("usd") as any;
  const usdToGbp: number = rates["gbp"];
  const usdToBrl: number = rates["brl"];

  if (!usdToGbp || !usdToBrl) throw new Error("Taxa GBP/BRL não disponível no Stripe");

  // 1 GBP = (usdToBrl / usdToGbp) BRL
  const gbpToBrl = Number((usdToBrl / usdToGbp).toFixed(4));

  await (prisma as any).storeSettings.upsert({
    where: { id: "singleton" },
    update: { gbpToBrlRate: gbpToBrl },
    create: { id: "singleton", gbpToBrlRate: gbpToBrl },
  });

  revalidatePath("/admin/settings");
  revalidateTag("store-settings");

  return gbpToBrl;
}

export async function getAdminReviews() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const reviews = await prisma.comentario.findMany({
    orderBy: { createdAt: "desc" },
    include: { produto: { select: { id: true, nome: true } } }
  });
  return reviews;
}

export async function updateReview(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const review = await prisma.comentario.update({
    where: { id },
    data: {
      rating: data.rating,
      texto: data.texto,
      fotos: data.fotos || [],
      videoUrl: data.videoUrl || null,
    },
  });

  await updateProductRating(review.produtoId);

  revalidatePath("/admin/reviews");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return review;
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const review = await prisma.comentario.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");

  await prisma.comentario.delete({ where: { id } });

  await updateProductRating(review.produtoId);

  revalidatePath("/admin/reviews");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateUserProfile(data: { name: string; telefone: string; localizacao: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: data.name,
      telefone: data.telefone,
      localizacao: data.localizacao,
    },
  });

  revalidatePath("/user");
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  pais: string;
  aniversario: string;
  telefone: string;
}) {
  const { email, name, password, pais, aniversario, telefone } = data;

  if (!email || !name || !password) {
    throw new Error("Missing info");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      pais,
      aniversario: aniversario ? new Date(aniversario) : null,
      telefone,
    },
  });

  return { success: true, email: user.email };
}
