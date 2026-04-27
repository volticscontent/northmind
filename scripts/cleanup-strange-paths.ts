import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupStrangePaths() {
  console.log("🕵️ Checking Fragrances for STRANGE paths...");

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
    const photoPath = product.fotoPrincipal || "";
    
    // Check if path is weird
    const isWeird = 
        !photoPath.startsWith("/") || 
        photoPath.length < 5 ||
        photoPath.includes("Exclusivo") || // Many weird paths had this
        photoPath.includes("De Toilette");

    if (isWeird) {
        console.log(`🗑️ STRANGE PATH DELETED: ${product.nome}. Path: ${photoPath}`);
        try {
            await prisma.produto.delete({ where: { id: product.id } });
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete ${product.id}`);
        }
    }
  }

  console.log(`\n--- CLEANUP COMPLETE. Removed ${deletedCount} strange perfumes. ---`);
  await prisma.$disconnect();
}

cleanupStrangePaths().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
