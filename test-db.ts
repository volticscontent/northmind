import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function test() {
  try {
    const adminCount = await prisma.admin.count();
    console.log("Admin count:", adminCount);
    const productCount = await prisma.produto.count();
    console.log("Product count:", productCount);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
