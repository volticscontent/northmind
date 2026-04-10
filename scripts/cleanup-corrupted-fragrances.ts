import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupMalformedFragrances() {
  console.log("🕵️ Checking Fragrances for malformed paths (quotes, brackets, etc)...");

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
    
    // Check for malformed characters (corruption indicators)
    const isMalformed = 
        photoPath.includes('"') || 
        photoPath.includes(']') || 
        photoPath.includes('\n') || 
        photoPath.includes('\r') ||
        photoPath.includes('}') ||
        photoPath.includes('{');

    if (isMalformed) {
        console.log(`🗑️ MALFORMED PATH DETECTED: ${product.nome}. Deleting...`);
        try {
            await prisma.produto.delete({ where: { id: product.id } });
            deletedCount++;
        } catch (e) {
            console.error(`Failed to delete ${product.id}`);
        }
    }
  }

  console.log(`\n--- CLEANUP COMPLETE. Removed ${deletedCount} malformed perfumes. ---`);
  await prisma.$disconnect();
}

cleanupMalformedFragrances().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
