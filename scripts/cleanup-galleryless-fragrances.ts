import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteGalleryLessFragrances() {
  console.log("🕵️ CLEANUP: Deleting fragrances with empty gallery (fotos)...");

  // Get all fragrances
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    }
  });

  console.log(`🔍 Found ${products.length} fragrances to check.`);

  let deletedCount = 0;
  for (const product of products) {
    if (!product.fotos || product.fotos.length === 0) {
        console.log(`🗑️ DELETE: ${product.nome}. Reason: Empty Gallery (fotos).`);
        try {
            await prisma.produto.delete({ where: { id: product.id } });
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete ${product.id}`);
        }
    }
  }

  console.log(`\n--- CLEANUP COMPLETE. Removed ${deletedCount} fragrances with no gallery images. ---`);
  await prisma.$disconnect();
}

deleteGalleryLessFragrances().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
