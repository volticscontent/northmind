"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * REVIEWS ACTIONS
 */

export async function getReviews(produtoId: string) {
  try {
    const res = await fetch(`${API_URL}/api/reviews/product/${produtoId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("GET_REVIEWS_ERROR", error);
    return [];
  }
}

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/orders`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function canUserReview(produtoId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  try {
    const res = await fetch(`${API_URL}/api/reviews/can-review/${produtoId}/${session.user.email}`, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return data.canReview;
  } catch {
    return false;
  }
}

export async function addReview(data: {
  produtoId: string;
  rating: number;
  texto: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail: session.user.email,
      ...data,
    }),
  });

  if (!res.ok) throw new Error("Failed to add review");

  revalidatePath(`/product/[handle]`, "page");
  return res.json();
}

/**
 * ADMIN ACTIONS
 */

export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/admin/stats`, { 
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });
  if (!res.ok) return { totalOrders: 0, totalRevenue: 0, totalUsers: 0, recentOrders: [] };
  return res.json();
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order");
  revalidatePath("/admin/orders");
}

export async function upsertProduct(data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/products/upsert`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to upsert product");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete product");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getProducts() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/products/raw`, { 
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getCollections() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/collections/raw`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function upsertCollection(data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  console.log('📦 Upserting collection:', data.name || data.id);
  const res = await fetch(`${API_URL}/api/collections/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to upsert collection");
  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return res.json();
}

export async function deleteCollection(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  console.log('🗑️ Deleting collection ID:', id);
  const res = await fetch(`${API_URL}/api/collections/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete collection");
  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getAdminReviews() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/reviews/all`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function updateReview(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/reviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update review");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return res.json();
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.type !== "ADMIN") throw new Error("Unauthorized Admin Only");

  const res = await fetch(`${API_URL}/api/reviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(session?.user as any)?.token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete review");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateUserProfile(data: { name: string; telefone: string; localizacao: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/api/admin/profile/${session.user.email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  revalidatePath("/user");
}
