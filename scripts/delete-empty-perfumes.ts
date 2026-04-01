import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteEmptyPerfumes() {
  console.log("🧴 Starting Perfume Cleanup (Empty Photo/Videos)...");

  // Find perfumes without photoPrincipal
  const toDelete = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ],
      AND: [
        {
          OR: [
            { fotoPrincipal: null },
            { fotoPrincipal: "" },
            { fotoPrincipal: " " }
          ]
        }
      ]
    }
  });

  console.log(`🔍 Found ${toDelete.length} incomplete fragrances to remove.`);

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

deleteEmptyPerfumes().catch(err => {
  console.error("Fatal Cleanup Error:", err);
  process.exit(1);
});
