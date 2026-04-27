import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function cleanupMissingImages() {
  console.log("🕵️ Checking Fragrances for missing images on disk...");

  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    }
  });

  console.log(`🔍 Found ${products.length} fragrances to verify.`);

  let deletedCount = 0;
  for (const product of products) {
    const photoPath = product.fotoPrincipal;
    
    // Check if empty
    if (!photoPath || photoPath.trim() === "") {
        console.log(`🗑️ NO PHOTO PATH: ${product.nome}. Deleting...`);
        await prisma.produto.delete({ where: { id: product.id } });
        deletedCount++;
        continue;
    }

    // Check if file exists on disk
    const absolutePath = path.join(process.cwd(), "public", photoPath);
    if (!fs.existsSync(absolutePath)) {
        console.log(`🗑️ IMAGE MISSING ON DISK: ${product.nome} -> ${photoPath}. Deleting...`);
        try {
            await prisma.produto.delete({ where: { id: product.id } });
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete ${product.id}`);
        }
    }
  }

  console.log(`\n--- CLEANUP COMPLETE. Removed ${deletedCount} defective perfumes. ---`);
  await prisma.$disconnect();
}

cleanupMissingImages().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
