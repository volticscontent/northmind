"use server";

import prisma from "@/lib/prisma";

export async function verifyOrder(orderId: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const order = await prisma.pedido.findUnique({
      where: { id: orderId }
    });

    if (!user || !order) {
      return null;
    }

    return {
      email: user.email,
      hasPassword: !!user.hashedPassword
    };
  } catch (error) {
    console.error("Error verifying order via Prisma:", error);
    return null;
  }
}
