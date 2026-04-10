import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupAllPhotoLess() {
  console.log("🕵️ Checking ALL products for missing photos...");

  const toDelete = await prisma.produto.findMany({
    where: {
      OR: [
        { fotoPrincipal: null },
        { fotoPrincipal: "" },
        { fotoPrincipal: " " }
      ]
    }
  });

  console.log(`🔍 Found ${toDelete.length} products to remove.`);

  for (const product of toDelete) {
    try {
      await prisma.produto.delete({ where: { id: product.id } });
      console.log(`✅ DELETED: ${product.nome} (ID: ${product.id})`);
    } catch (err) {
      console.error(`❌ FAILED to delete ${product.nome}:`, err);
    }
  }

  console.log("\n--- CLEANUP COMPLETE ---");
  await prisma.$disconnect();
}

cleanupAllPhotoLess().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
