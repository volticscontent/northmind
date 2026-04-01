import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function strictCleanup() {
  console.log("🕵️ STRICT CLEANUP: Deleting products with missing files on disk...");

  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    }
  });

  let deletedCount = 0;
  for (const product of products) {
    const photoPath = product.fotoPrincipal || "";
    
    // Normalize path: remove leading slash if present for joining
    const relativePath = photoPath.startsWith("/") ? photoPath.slice(1) : photoPath;
    const absolutePath = path.resolve(process.cwd(), "public", relativePath);

    if (!fs.existsSync(absolutePath)) {
        console.log(`🗑️ DELETE: ${product.nome}. Missing: ${absolutePath}`);
        try {
            await prisma.produto.delete({ where: { id: product.id } });
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete ${product.id}`);
        }
    }
  }

  console.log(`\n--- CLEANUP COMPLETE. Removed ${deletedCount} products with broken image links. ---`);
  await prisma.$disconnect();
}

strictCleanup();
